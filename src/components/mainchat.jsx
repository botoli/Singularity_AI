import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/App.scss';
import { FiCode, FiSend, FiUser, FiLoader, FiCopy, FiEye, FiPlus, FiX } from 'react-icons/fi';

function MainChat({ apiConfig, serverConfig }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activePreview, setActivePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [currentChatId, setCurrentChatId] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [stickyHeaders, setStickyHeaders] = useState({});
  const [previewWidth, setPreviewWidth] = useState('50%');
  const [isResizing, setIsResizing] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const observerRef = useRef(null);
  const previewSidebarRef = useRef(null);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);
  const location = useLocation();

  // Intersection Observer для sticky заголовков
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const updates = {};
        entries.forEach((entry) => {
          const messageId = entry.target.getAttribute('data-message-id');
          updates[messageId] = !entry.isIntersecting;
        });
        setStickyHeaders((prev) => ({ ...prev, ...updates }));
      },
      {
        rootMargin: '-70px 0px 0px 0px',
        threshold: 0,
      },
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Наблюдаем за sticky трекерами
  useEffect(() => {
    if (observerRef.current) {
      const trackers = document.querySelectorAll('.sticky-tracker');
      trackers.forEach((tracker) => {
        observerRef.current.observe(tracker);
      });
    }
  }, [messages]);

  // Ресайз предпросмотра
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const deltaX = resizeStartX.current - e.clientX;
      const newWidth = Math.min(
        Math.max(300, resizeStartWidth.current + deltaX),
        window.innerWidth * 0.8,
      );
      setPreviewWidth(`${newWidth}px`);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      if (previewSidebarRef.current) {
        previewSidebarRef.current.classList.remove('resizing');
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      if (previewSidebarRef.current) {
        previewSidebarRef.current.classList.add('resizing');
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Загрузка чата
  useEffect(() => {
    const loadChat = () => {
      try {
        const currentChat = localStorage.getItem('currentChat');
        const currentChatId = localStorage.getItem('currentChatId');

        if (currentChat) {
          const parsedMessages = JSON.parse(currentChat);
          setMessages(parsedMessages || []);
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

  // Preset prompt
  useEffect(() => {
    if (location.state?.presetPrompt) {
      setInput(location.state.presetPrompt);
    }
  }, [location.state]);

  // Сохранение чата
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

  // Auto-scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  };

  // Создание нового чата
  const createNewChat = () => {
    const newChatId = 'local_' + Date.now();
    setCurrentChatId(newChatId);
    setMessages([]);
    setActivePreview(null);
    setInput('');

    localStorage.setItem('currentChatId', newChatId);
    localStorage.setItem('currentChat', JSON.stringify([]));
  };

  // Начало ресайза
  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = previewSidebarRef.current?.offsetWidth || 600;
  };

  // Отправка сообщения
  const sendMessage = async (retryCount = 0) => {
    if (!input.trim() || isLoading) return;

    if (!apiConfig?.apiKey || apiConfig.apiKey.includes('VITE_GROQ_API_KEY')) {
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
          content: `
Ты — senior frontend engineer. Отвечай ТОЛЬКО рабочим кодом без пояснений.

Всегда возвращай полный HTML/CSS в блоках:
\`\`\`html
...
\`\`\`
или
\`\`\`css
...
\`\`\`

ТРЕБОВАНИЯ:
• HTML/CSS только, адаптив mobile-first
• Семантика, aria, flex/grid, responsive states
• Код чистый, готовый к вставке
`,
        },
        ...updatedMessages.map((msg) => ({
          role: msg.role,
          content:
            msg.role === 'user'
              ? `${msg.content}\n\nВАЖНО: Верни ПОЛНЫЙ РАБОЧИЙ КОД с адаптивным дизайном, современными практиками и доступностью.`
              : msg.content,
        })),
      ];

      const requestBody = {
        model: apiConfig.model,
        messages: apiMessages,
        max_completion_tokens: 2048,
        temperature: 0.7,
        stream: false,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      let response;

      if (apiConfig.useProxy) {
        const proxyBody = {
          url: 'https://api.groq.com/openai/v1/chat/completions',
          body: requestBody,
          headers: {
            Authorization: `Bearer ${apiConfig.apiKey}`,
          },
        };

        response = await fetch(apiConfig.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(proxyBody),
          signal: controller.signal,
        });
      } else {
        response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiConfig.apiKey}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
      }

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
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = 'Произошла неизвестная ошибка';

      if (error.name === 'AbortError') {
        errorMessage = 'Превышено время ожидания ответа от сервера.';
      } else if (error.message === 'Failed to fetch') {
        errorMessage = 'Не удалось подключиться к серверу.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Неверный API-ключ. Проверьте настройки API.';
      } else {
        errorMessage = `Ошибка: ${error.message}`;
      }

      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Форматирование кода
  const formatCode = (content) => {
    if (!content) return '';

    const codeBlockMatch = content.match(/```(?:html|css|javascript|js)\n([\s\S]*?)```/);

    if (codeBlockMatch) {
      const codeType = content.match(/```(html|css|javascript|js)/)?.[1] || 'code';
      const codeContent = codeBlockMatch[1];

      return `
        <div class="code-block">
          <div class="code-header">${codeType.toUpperCase()}</div>
          <pre class="code-content"><code class="language-${codeType}">${escapeHtml(
        codeContent,
      )}</code></pre>
        </div>
      `;
    }

    return `<div class="text-content">${escapeHtml(content)}</div>`;
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Создание предпросмотра
  const createPreviewContent = (content) => {
    if (!content) return '';

    const cssMatch = content.match(/```css\n([\s\S]*?)```/);
    const htmlMatch = content.match(/```html\n([\s\S]*?)```/);

    const htmlCode = htmlMatch
      ? htmlMatch[1]
      : '<div class="demo-container"><p>Демо контент</p></div>';
    const cssCode = cssMatch ? cssMatch[1] : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <base target="_blank">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; min-height: 100vh; }
          .demo-container { 
            padding: 20px; 
            display: flex; 
            flex-wrap: wrap; 
            gap: 10px; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
          }
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
              e.preventDefault();
              e.stopPropagation();
            }
          });
          document.querySelectorAll('a').forEach(link => {
            link.href = 'javascript:void(0)';
          });
        </script>
      </body>
      </html>
    `;
  };

  // Открытие предпросмотра
  const openPreview = (messageId, content) => {
    setActivePreview({ messageId, content });
  };

  // Закрытие предпросмотра
  const closePreview = () => {
    setActivePreview(null);
  };

  // Копирование кода
  const copyToClipboard = async (content) => {
    if (!content) return;

    let codeToCopy = content;
    const codeMatch = content.match(/```(?:html|css|javascript|js)\n([\s\S]*?)```/);
    if (codeMatch) {
      codeToCopy = codeMatch[1];
    }

    try {
      await navigator.clipboard.writeText(codeToCopy);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Не удалось скопировать код');
    }
  };

  // Определение типа файла
  const getFileType = (content) => {
    if (!content) return 'Text';
    if (content.includes('```html')) return 'HTML';
    if (content.includes('```css')) return 'CSS';
    if (content.includes('```javascript') || content.includes('```js')) return 'JavaScript';
    return 'Text';
  };

  const getPreviewHint = (content) => {
    const type = getFileType(content);
    return type === 'HTML' || type === 'CSS' ? 'Доступен предпросмотр' : 'Только код';
  };

  // Очистка чата
  const clearChat = () => {
    if (!window.confirm('Вы уверены, что хотите очистить чат?')) {
      return;
    }

    setMessages([]);
    setActivePreview(null);

    if (currentChatId) {
      const savedChats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      const updatedChats = savedChats.filter((chat) => chat.id !== currentChatId);
      localStorage.setItem('chatHistory', JSON.stringify(updatedChats));
    }

    localStorage.setItem('currentChat', JSON.stringify([]));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`chat-with-preview ${activePreview ? 'with-preview' : ''}`}
      style={{ '--preview-width': previewWidth }}>
      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
        </div>
      )}

      <div className="chat-content" ref={messagesContainerRef}>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}>
            Чат
          </button>
        </div>

        <div className="chat-container">
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
                        {/* Трекер для отслеживания видимости */}
                        <div className="sticky-tracker" data-message-id={msg.id} />

                        {/* Sticky заголовок */}
                        <div
                          className={`message-header-sticky ${
                            stickyHeaders[msg.id] ? 'visible' : ''
                          }`}>
                          <div className="sticky-header-content">
                            <div className="header-left">
                              <div className="message-avatar">
                                <FiCode size={18} />
                              </div>
                              <div className="message-info">
                                <div className="type_of_file">{getFileType(msg.content)}</div>
                                <div className="message-preview">{getPreviewHint(msg.content)}</div>
                              </div>
                            </div>
                            <div className="message-actions">
                              <button
                                className={`action-button copy-button ${
                                  copiedMessageId === msg.id ? 'copied' : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(msg.content);
                                  setCopiedMessageId(msg.id);
                                  setTimeout(() => setCopiedMessageId(null), 2000);
                                }}>
                                <FiCopy size={16} />
                                {copiedMessageId === msg.id ? 'Скопировано!' : 'Копировать'}
                              </button>

                              {(getFileType(msg.content) === 'HTML' ||
                                getFileType(msg.content) === 'CSS') && (
                                <button
                                  className={`action-button preview-button ${
                                    activePreview?.messageId === msg.id ? 'preview-active' : ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPreview(msg.id, msg.content);
                                  }}>
                                  <FiEye size={16} />
                                  Предпросмотр
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Основной контент сообщения */}
                        <div className="message-content">
                          <div
                            className="ai_message_text"
                            dangerouslySetInnerHTML={{ __html: formatCode(msg.content) }}
                          />

                          <div className="inline-actions">
                            <button
                              className="action-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(msg.content);
                                setCopiedMessageId(msg.id);
                                setTimeout(() => setCopiedMessageId(null), 2000);
                              }}>
                              <FiCopy size={14} />
                              Копировать код
                            </button>

                            {(getFileType(msg.content) === 'HTML' ||
                              getFileType(msg.content) === 'CSS') && (
                              <button
                                className="action-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPreview(msg.id, msg.content);
                                }}>
                                <FiEye size={14} />
                                Открыть предпросмотр
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} className="scroll-anchor" />
              </div>
            )
          ) : null}
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

      {/* Правая панель предпросмотра */}
      <div
        className={`preview-sidebar ${activePreview ? 'active' : ''}`}
        ref={previewSidebarRef}
        style={{ width: previewWidth }}
        onMouseDown={startResize}>
        <div className="preview-header">
          <h3>Предпросмотр кода</h3>
          <button className="preview-close" onClick={closePreview}>
            <FiX size={18} /> Закрыть
          </button>
        </div>
        <div className="preview-content">
          {activePreview && (
            <iframe
              srcDoc={createPreviewContent(activePreview.content)}
              title="Code Preview"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MainChat;
