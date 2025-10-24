import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/App.scss';
import { FiCode, FiSend, FiUser, FiLoader, FiCopy, FiEye, FiPlus } from 'react-icons/fi';

function MainChat({ apiConfig, serverConfig }) {
  const [messages, setMessages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewMessageId, setPreviewMessageId] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const previewRefs = useRef({});
  const location = useLocation();

  // Load chat history and current chat
  useEffect(() => {
    const loadChat = () => {
      try {
        const currentChat = localStorage.getItem('currentChat');
        const currentChatId = localStorage.getItem('currentChatId');

        if (currentChat) {
          const parsedMessages = JSON.parse(currentChat);
          setMessages(parsedMessages || []);

          // Extract previews from assistant messages with code
          const codeMessages = (parsedMessages || []).filter(
            (msg) =>
              msg.role === 'assistant' &&
              (msg.content.includes('```css') || msg.content.includes('```html')),
          );
          setPreviews(codeMessages.map((msg) => ({ ...msg, previewId: msg.id || Date.now() })));
        }

        if (currentChatId) {
          setCurrentChatId(currentChatId);
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error('Error loading chat:', error);
        createNewChat();
      }
    };

    loadChat();
  }, []);

  // Handle preset prompt from navigation
  useEffect(() => {
    if (location.state?.presetPrompt) {
      setInput(location.state.presetPrompt);
    }
  }, [location.state]);

  // Save current chat to history
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      try {
        const savedChats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        const existingChatIndex = savedChats.findIndex((chat) => chat.id === currentChatId);

        const chatData = {
          id: currentChatId,
          title: messages[0]?.content?.substring(0, 50) + '...' || 'Новый чат',
          messages: messages,
          timestamp: Date.now(),
        };

        if (existingChatIndex >= 0) {
          savedChats[existingChatIndex] = chatData;
        } else {
          savedChats.push(chatData);
        }

        localStorage.setItem('chatHistory', JSON.stringify(savedChats));
        localStorage.setItem('currentChatId', currentChatId);
        localStorage.setItem('currentChat', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    }
  }, [messages, currentChatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, previews, activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  };

  // Create new chat
  const createNewChat = () => {
    const newChatId = 'local_' + Date.now();
    setCurrentChatId(newChatId);
    setMessages([]);
    setPreviews([]);
    setPreviewMessageId(null);
    setInput('');

    localStorage.setItem('currentChatId', newChatId);
    localStorage.setItem('currentChat', JSON.stringify([]));
  };

  // Send message to API
  const sendMessage = async (retryCount = 0) => {
    if (!input.trim() || isLoading) return;

    // ДОБАВЬ ЭТУ ПРОВЕРКУ
    if (!apiConfig.apiKey || apiConfig.apiKey.includes('VITE_GROQ_API_KEY')) {
      setError('Ошибка: API ключ не настроен. Проверьте конфигурацию.');
      return;
    }
    const userMessage = {
      role: 'user',
      content: input.trim(),
      id: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = [
        {
          role: 'system',
          content:
            'Ты ассистент по веб-дизайну. Всегда возвращай полный, рабочий CSS-код в формате ```css\n[код]\n``` или HTML в формате ```html\n[код]\n``` для запросов, связанных с дизайном. Код должен быть адаптивным и функциональным. Если запрос общий, создай CSS для кнопки.',
        },
        ...updatedMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      const requestBody = {
        model: apiConfig.model,
        messages: apiMessages,
        max_completion_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
        stream: false,
      };

      console.log('API Request:', JSON.stringify(requestBody, null, 2));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/groq-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          payload: requestBody,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        if (retryCount < 2) {
          return sendMessage(retryCount + 1);
        }
        throw new Error(`API ошибка ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Неверный формат ответа от API');
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content,
        id: Date.now() + 1,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Add to previews if contains code
      if (
        assistantMessage.content.includes('```css') ||
        assistantMessage.content.includes('```html')
      ) {
        const newPreview = { ...assistantMessage, previewId: Date.now() };
        setPreviews((prev) => [...prev, newPreview]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      let errorMessage = 'Произошла неизвестная ошибка';

      if (error.name === 'AbortError') {
        errorMessage =
          'Превышено время ожидания ответа от сервера. Проверьте подключение к интернету.';
      } else if (error.message === 'Failed to fetch') {
        errorMessage = 'Не удалось подключиться к серверу. Проверьте интернет-соединение.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Неверный API-ключ. Проверьте настройки API.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Превышен лимит запросов. Попробуйте позже.';
      } else {
        errorMessage = `Ошибка: ${error.message}`;
      }

      setError(errorMessage);

      const errorMessageObj = {
        role: 'assistant',
        content: `Ошибка: ${error.message}`,
        id: Date.now() + 1,
      };

      const errorMessages = [...updatedMessages, errorMessageObj];
      setMessages(errorMessages);

      // Auto-hide error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Format code with syntax highlighting
  const formatCode = (content) => {
    if (!content) return '';

    return content
      .replace(
        /```css\n([\s\S]*?)```/g,
        '<div class="code-block"><div class="code-header">CSS</div><pre class="code-content"><code class="language-css">$1</code></pre></div>',
      )
      .replace(
        /```html\n([\s\S]*?)```/g,
        '<div class="code-block"><div class="code-header">HTML</div><pre class="code-content"><code class="language-html">$1</code></pre></div>',
      )
      .replace(
        /```javascript\n([\s\S]*?)```/g,
        '<div class="code-block"><div class="code-header">JavaScript</div><pre class="code-content"><code class="language-javascript">$1</code></pre></div>',
      )
      .replace(
        /```js\n([\s\S]*?)```/g,
        '<div class="code-block"><div class="code-header">JavaScript</div><pre class="code-content"><code class="language-javascript">$1</code></pre></div>',
      )
      .replace(/\n/g, '<br>');
  };

  // Preview toggle
  const togglePreview = (messageIndex) => {
    setPreviewMessageId(previewMessageId === messageIndex ? null : messageIndex);
  };

  // Render preview content
  const renderPreview = (content, index) => {
    if (!content) return null;

    const cssMatch = content.match(/```css\n([\s\S]*?)```/);
    const htmlMatch = content.match(/```html\n([\s\S]*?)```/);

    if (cssMatch && htmlMatch) {
      const cssCode = cssMatch[1];
      const htmlCode = htmlMatch[1];

      // Создаем HTML для iframe с CSS и HTML
      const iframeContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                pointer-events: none;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
              }
              html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
              body { 
                margin: 0; 
                padding: 20px; 
                display: flex; 
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center; 
                align-items: center; 
                min-height: calc(100vh - 40px);
                background: #f5f5f5;
                font-family: Arial, sans-serif;
                overflow: hidden;
              }
              a, button, input, [onclick] {
                pointer-events: none !important;
                cursor: default !important;
              }
              ${cssCode}
            </style>
          </head>
          <body>
            ${htmlCode}
            <script>
              // Блокируем все события
              document.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              });
              document.addEventListener('mousedown', function(e) {
                e.preventDefault();
                return false;
              });
              document.addEventListener('mouseup', function(e) {
                e.preventDefault();
                return false;
              });
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
              });
              // Блокируем все ссылки
              var links = document.querySelectorAll('a');
              links.forEach(function(link) {
                link.setAttribute('href', 'javascript:void(0)');
                link.addEventListener('click', function(e) {
                  e.preventDefault();
                  return false;
                });
              });
              // Блокируем все кнопки
              var buttons = document.querySelectorAll('button');
              buttons.forEach(function(button) {
                button.addEventListener('click', function(e) {
                  e.preventDefault();
                  return false;
                });
              });
            </script>
          </body>
        </html>
      `;

      return (
        <div className="preview-container" ref={(el) => (previewRefs.current[index] = el)}>
          <iframe
            srcDoc={iframeContent}
            style={{
              width: '100%',
              height: '300px',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              pointerEvents: 'none',
            }}
            title="Preview"
            loading="lazy"
            sandbox="allow-same-origin"
          />
        </div>
      );
    } else if (cssMatch) {
      const cssCode = cssMatch[1];

      // Создаем HTML для iframe только с CSS
      const iframeContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                pointer-events: none;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
              }
              html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
              body { 
                margin: 0; 
                padding: 20px; 
                display: flex; 
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center; 
                align-items: center; 
                min-height: calc(100vh - 40px);
                background: #f5f5f5;
                font-family: Arial, sans-serif;
                overflow: hidden;
              }
              a, button, input, [onclick] {
                pointer-events: none !important;
                cursor: default !important;
              }
              ${cssCode}
              
              /* Создаем демо-кнопки для CSS */
              .demo-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                align-items: center;
                width: 100%;
              }
            </style>
          </head>
          <body>
            <div class="demo-container">
              <button class="button" onclick="return false">Основная кнопка</button>
              <button class="button" onclick="return false">Вторичная кнопка</button>
              <button class="button" onclick="return false">Опасная кнопка</button>
              <button class="button" onclick="return false">Успех</button>
              <button class="button" onclick="return false">Маленькая</button>
              <button class="button" onclick="return false">Большая</button>
            </div>
            <script>
              // Блокируем все события
              document.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              });
              document.addEventListener('mousedown', function(e) {
                e.preventDefault();
                return false;
              });
              document.addEventListener('mouseup', function(e) {
                e.preventDefault();
                return false;
              });
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
              });
              // Блокируем все кнопки
              var buttons = document.querySelectorAll('button');
              buttons.forEach(function(button) {
                button.addEventListener('click', function(e) {
                  e.preventDefault();
                  return false;
                });
              });
            </script>
          </body>
        </html>
      `;

      return (
        <div className="preview-container" ref={(el) => (previewRefs.current[index] = el)}>
          <iframe
            srcDoc={iframeContent}
            style={{
              width: '100%',
              height: '300px',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              pointerEvents: 'none',
            }}
            title="CSS Preview"
            loading="lazy"
            sandbox="allow-same-origin"
          />
        </div>
      );
    } else if (htmlMatch) {
      const htmlCode = htmlMatch[1];

      // Создаем HTML для iframe только с HTML
      const iframeContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                pointer-events: none;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
              }
              html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
              body { 
                margin: 0; 
                padding: 20px; 
                background: #f5f5f5;
                font-family: Arial, sans-serif;
                overflow: hidden;
              }
              a, button, input, [onclick] {
                pointer-events: none !important;
                cursor: default !important;
              }
            </style>
          </head>
          <body>
            ${htmlCode
              .replace(/<a /g, '<a onclick="return false" ')
              .replace(/<button /g, '<button onclick="return false" ')}
            <script>
              // Блокируем все события
              document.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              });
              document.addEventListener('mousedown', function(e) {
                e.preventDefault();
                return false;
              });
              document.addEventListener('mouseup', function(e) {
                e.preventDefault();
                return false;
              });
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
              });
              // Блокируем все ссылки и кнопки
              var links = document.querySelectorAll('a');
              links.forEach(function(link) {
                link.setAttribute('href', 'javascript:void(0)');
                link.addEventListener('click', function(e) {
                  e.preventDefault();
                  return false;
                });
              });
              var buttons = document.querySelectorAll('button');
              buttons.forEach(function(button) {
                button.addEventListener('click', function(e) {
                  e.preventDefault();
                  return false;
                });
              });
            </script>
          </body>
        </html>
      `;

      return (
        <div className="preview-container" ref={(el) => (previewRefs.current[index] = el)}>
          <iframe
            srcDoc={iframeContent}
            style={{
              width: '100%',
              height: '300px',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              pointerEvents: 'none',
            }}
            title="HTML Preview"
            loading="lazy"
            sandbox="allow-same-origin"
          />
        </div>
      );
    }
    return null;
  };

  // Handle Enter key for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear current chat
  const clearChat = () => {
    if (!window.confirm('Вы уверены, что хотите очистить чат?')) {
      return;
    }

    setMessages([]);
    setPreviews([]);
    setPreviewMessageId(null);

    // Update in history
    if (currentChatId) {
      const savedChats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      const updatedChats = savedChats.filter((chat) => chat.id !== currentChatId);
      localStorage.setItem('chatHistory', JSON.stringify(updatedChats));
    }

    localStorage.setItem('currentChat', JSON.stringify([]));
  };

  // Copy code to clipboard
  const copyToClipboard = async (content, button) => {
    if (!content) return;

    let codeToCopy = content;

    // Extract code from markdown code blocks
    const codeMatch = content.match(/```(?:css|html|javascript|js)\n([\s\S]*?)```/);
    if (codeMatch) {
      codeToCopy = codeMatch[1];
    }

    try {
      await navigator.clipboard.writeText(codeToCopy);

      // Show success feedback
      const originalHTML = button.innerHTML;
      button.innerHTML = '<span style="color: #00ff88">✓</span>';
      button.style.background = 'rgba(0, 255, 136, 0.2)';

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Не удалось скопировать код');
    }
  };

  // Determine file type
  const getFileType = (content) => {
    if (!content) return 'Text';
    if (content.includes('```css')) return 'CSS';
    if (content.includes('```javascript') || content.includes('```js')) return 'JavaScript';
    if (content.includes('```html')) return 'HTML';
    return 'Text';
  };

  return (
    <div className="main-chat">
      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}>
          Чат
        </button>
        <button
          className={`tab ${activeTab === 'previews' ? 'active' : ''}`}
          onClick={() => setActiveTab('previews')}>
          Предпросмотры
        </button>
      </div>

      <div className="chat-container" ref={messagesContainerRef}>
        {activeTab === 'chat' ? (
          messages.length === 0 ? (
            <div className="welcome-message">
              Привет! Опиши любой элемент дизайна, и я сгенерирую для него CSS или HTML код.
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id || idx}
                  className={msg.role === 'user' ? 'sent_message' : 'ai_message'}>
                  {msg.role === 'user' ? (
                    <>
                      <div className="message-avatar">
                        <FiUser size={18} />
                      </div>
                      <div className="message-content">
                        <div className="sent_message__text">{msg.content}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="message-header">
                        <div className="message-avatar">
                          <FiCode size={18} />
                        </div>
                        <div className="message-info">
                          <div className="type_of_file">{getFileType(msg.content)}</div>
                          {(getFileType(msg.content) === 'CSS' ||
                            getFileType(msg.content) === 'HTML') && (
                            <div className="message-actions">
                              <button
                                className="action-button copy-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(msg.content, e.currentTarget);
                                }}
                                title="Копировать код">
                                <FiCopy size={14} />
                              </button>
                              <button
                                className="action-button preview-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePreview(idx);
                                }}
                                title="Предпросмотр">
                                <FiEye size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="ai_message_text"
                        dangerouslySetInnerHTML={{ __html: formatCode(msg.content) }}
                      />
                      {previewMessageId === idx && renderPreview(msg.content, idx)}
                    </>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} className="scroll-anchor" />
            </div>
          )
        ) : previews.length === 0 ? (
          <div className="welcome-message">
            📝 Пока нет сохранённых предпросмотров. Начни диалог на вкладке "Чат".
          </div>
        ) : (
          <div className="previews-list">
            {previews.map((msg, idx) => (
              <div key={msg.previewId || idx} className="preview-item">
                <div className="message-header">
                  <div className="message-avatar">
                    <FiCode size={18} />
                  </div>
                  <div className="message-info">
                    <div className="type_of_file">{getFileType(msg.content)}</div>
                    <div className="message-actions">
                      <button
                        className="action-button copy-button"
                        onClick={(e) => copyToClipboard(msg.content, e.currentTarget)}
                        title="Копировать код">
                        <FiCopy size={14} />
                      </button>
                      <button
                        className="action-button preview-button"
                        onClick={() => togglePreview(idx)}
                        title="Предпросмотр">
                        <FiEye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="ai_message_text"
                  dangerouslySetInnerHTML={{ __html: formatCode(msg.content) }}
                />
                {previewMessageId === idx && renderPreview(msg.content, idx)}
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'chat' && (
        <div className="input-wrapper_chat">
          <textarea
            className="input_prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Опиши элемент дизайна (например, 'неоновая кнопка с градиентом')..."
            maxLength={1000}
            rows={3}
            disabled={isLoading}
          />
          <button
            className={`send-button ${isLoading ? 'loading' : ''}`}
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}>
            {isLoading ? <FiLoader className="spin" size={20} /> : <FiSend size={20} />}
          </button>
        </div>
      )}

      <div className="chat-controls">
        <button className="new-chat-button" onClick={createNewChat}>
          <FiPlus size={16} /> Новый чат
        </button>
        <button className="clear-chat-button" onClick={clearChat}>
          🗑️ Очистить чат
        </button>
      </div>
    </div>
  );
}

export default MainChat;
