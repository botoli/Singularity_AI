import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.scss';
import { FiSend } from 'react-icons/fi';

function Home({ apiConfig, serverConfig }) {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!idea.trim()) {
      alert('Пожалуйста, введите описание элемента дизайна');
      return;
    }

    setIsLoading(true);

    const requestBody = {
      model: apiConfig.model,
      messages: [
        {
          role: 'system',
          content:
            'Ты ассистент по веб-дизайну. Всегда возвращай полный, рабочий CSS-код в формате ```css\n[код]\n``` или HTML в формате ```html\n[код]\n``` для запросов, связанных с дизайном. Код должен быть адаптивным и функциональным. Если запрос общий, создай CSS для кнопки.',
        },
        {
          role: 'user',
          content: idea,
        },
      ],
      max_completion_tokens: 2048,
      temperature: 0.7,
      stream: false,
    };

    console.log('API Request from Home:', JSON.stringify(requestBody, null, 2));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // Увеличиваем таймаут

      let response;

      if (apiConfig.useProxy) {
        // Используем proxy для мобильных
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
        // Прямое подключение для десктопа
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
        console.error('Ошибка API:', errorText);
        throw new Error(`API ошибка ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Неверный формат ответа от API');
      }

      const userMessage = { role: 'user', content: idea };
      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };

      // Сохранение в localStorage для немедленного доступа
      const newMessages = [userMessage, assistantMessage];
      localStorage.setItem('currentChat', JSON.stringify(newMessages));

      // Создаем ID для нового чата
      const chatId = 'local_' + Date.now();
      localStorage.setItem('currentChatId', chatId);

      navigate('/chat');
    } catch (error) {
      console.error('Ошибка в Home:', error);

      let errorMessage = 'Произошла неизвестная ошибка';

      if (error.name === 'AbortError') {
        errorMessage =
          'Превышено время ожидания ответа от сервера. Проверьте подключение к интернету.';
      } else if (error.message === 'Failed to fetch') {
        errorMessage = 'Не удалось подключиться к серверу. Проблема с интернет-соединением.';
      } else if (error.message.includes('CORS') || error.message.includes('cors')) {
        errorMessage = 'Ошибка доступа. Пожалуйста, попробуйте обновить страницу.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Неверный API-ключ. Проверьте настройки API.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Превышен лимит запросов. Попробуйте позже.';
      } else {
        errorMessage = `Ошибка: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="home">
      <div className="main-text-div">
        <div className="main_text">
          <span className="brand-text">Singularity AI</span>
          <span className="subtitle">Твой персональный генератор веб-дизайна</span>
        </div>
        <div className="home-description">
          Превращай идеи в готовый код: создавай стильные кнопки, анимированные элементы и
          современные интерфейсы с помощью искусственного интеллекта. Просто опиши, что хочешь —
          получи готовый CSS и HTML код для любого проекта.
        </div>
      </div>
      <div className="input-wrapper-home">
        <textarea
          className="input_prompt"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Опиши элемент дизайна (например, 'неоновая кнопка в тёмной теме')..."
          maxLength={1000}
          rows={3}
          disabled={isLoading}
        />
        <button
          className={`send ${isLoading ? 'loading' : ''}`}
          onClick={handleSend}
          disabled={isLoading || !idea.trim()}
          aria-label="Отправить запрос">
          {isLoading ? <div className="spinner"></div> : <FiSend size={24} className="send-icon" />}
        </button>
      </div>
    </div>
  );
}

export default Home;
