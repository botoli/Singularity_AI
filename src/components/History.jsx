import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.scss';
import { FiHome, FiMessageSquare, FiClock, FiTrash2 } from 'react-icons/fi';

function History({ serverConfig }) {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setError(null);
      // Пробуем загрузить с сервера
      if (serverConfig && serverConfig.baseURL) {
        const response = await fetch(`${serverConfig.baseURL}${serverConfig.endpoints.getChats}`);
        if (response.ok) {
          const serverChats = await response.json();
          setChats(serverChats);
          setLoading(false);
          return;
        }
      }
      throw new Error('Сервер недоступен');
    } catch (error) {
      // Fallback на localStorage
      console.log('Загружаем историю из localStorage');
      try {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        const currentChat = localStorage.getItem('currentChat');

        // Объединяем историю и текущий чат
        let allChats = [...chatHistory];

        if (currentChat) {
          const currentChatData = JSON.parse(currentChat);
          const existingCurrentIndex = allChats.findIndex((chat) => chat.id === 'current');

          if (existingCurrentIndex >= 0) {
            allChats[existingCurrentIndex] = {
              id: 'current',
              title: currentChatData[0]?.content?.substring(0, 50) + '...' || 'Текущий чат',
              messages: currentChatData,
              timestamp: Date.now(),
            };
          } else {
            allChats.push({
              id: 'current',
              title: currentChatData[0]?.content?.substring(0, 50) + '...' || 'Текущий чат',
              messages: currentChatData,
              timestamp: Date.now(),
            });
          }
        }

        setChats(allChats);
      } catch (localError) {
        setError('Ошибка загрузки истории чатов');
        console.error('Ошибка загрузки из localStorage:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (chatId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот чат?')) {
      return;
    }

    try {
      if (chatId.startsWith('local_') || chatId === 'current') {
        // Удаляем из localStorage
        const updatedChats = chats.filter((chat) => chat.id !== chatId);
        setChats(updatedChats);

        if (chatId === 'current') {
          localStorage.removeItem('currentChat');
        }

        localStorage.setItem(
          'chatHistory',
          JSON.stringify(updatedChats.filter((chat) => chat.id !== 'current')),
        );
      } else if (serverConfig && serverConfig.baseURL) {
        // Удаляем с сервера
        await fetch(
          `${serverConfig.baseURL}${serverConfig.endpoints.deleteChat.replace(':id', chatId)}`,
          {
            method: 'DELETE',
          },
        );
        loadChatHistory(); // Перезагружаем список
      }
    } catch (error) {
      console.error('Ошибка удаления чата:', error);
      setError('Ошибка при удалении чата');
    }
  };

  const loadChat = (chat) => {
    try {
      localStorage.setItem('currentChat', JSON.stringify(chat.messages));
      navigate('/chat');
    } catch (error) {
      console.error('Ошибка загрузки чата:', error);
      setError('Ошибка при загрузке чата');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="main">
        <div className="chat-container">
          <div className="welcome-message">Загрузка истории...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="history-container">
        <div className="history-header">
          <h2>История чатов</h2>
        </div>

        {error && (
          <div className="error-message" onClick={() => setError(null)}>
            {error}
          </div>
        )}

        {chats.length === 0 ? (
          <div className="welcome-message">
            История чатов пуста. Начните новый диалог на главной странице.
          </div>
        ) : (
          <div className="chats-list">
            {chats.map((chat, index) => (
              <div key={chat.id || `chat-${index}`} className="chat-item">
                <div className="chat-info" onClick={() => loadChat(chat)}>
                  <div className="chat-title">
                    {chat.title || `Чат ${formatDate(chat.timestamp)}`}
                  </div>
                  <div className="chat-meta">
                    <div className="chat-date">{formatDate(chat.timestamp)}</div>
                    <div className="chat-message-count">
                      {chat.messages ? chat.messages.length : 0} сообщений
                    </div>
                  </div>
                </div>
                <button
                  className="delete-chat"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  aria-label="Удалить чат">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
