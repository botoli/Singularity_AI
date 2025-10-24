import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.scss';
import { FiSend } from 'react-icons/fi';
import { CryptoUtils } from '../utils/crypto';
function Home({ apiConfig, serverConfig }) {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!idea.trim()) {
      alert('Пожалуйста, введите описание элемента дизайна');
      return;
    }

    // Проверяем API ключ
    if (!apiConfig?.apiKey || !CryptoUtils.validateKey(apiConfig.apiKey)) {
      alert('Ошибка: Неверная конфигурация API');
      return;
    }

    setIsLoading(true);

    const requestBody = {
      model: apiConfig.model,
      messages: [
        {
          role: 'system',
          content:
            'Ты ассистент по веб-дизайну. Всегда возвращай полный, рабочий CSS-код в формате ```css\n[код]\n``` или HTML в формате ```html\n[код]\n``` для запросов, связанных с дизайном.',
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

    try {
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoint}`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(requestBody),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API ошибка ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.choices?.[0]?.message) {
        throw new Error('Неверный формат ответа от API');
      }

      const userMessage = { role: 'user', content: idea };
      const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };

      localStorage.setItem('currentChat', JSON.stringify([userMessage, assistantMessage]));
      localStorage.setItem('currentChatId', 'local_' + Date.now());

      navigate('/chat');
    } catch (error) {
      console.error('Ошибка:', error);
      alert(error.message);
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
