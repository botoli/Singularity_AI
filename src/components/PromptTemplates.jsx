import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.scss';
import {
  FiCopy,
  FiCode,
  FiLayout,
  FiStar,
  FiTrendingUp,
  FiEye,
  FiX,
  FiMenu,
  FiGrid,
} from 'react-icons/fi';

function PromptTemplates() {
  const navigate = useNavigate();
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const templates = [
    {
      category: 'Кнопки',
      icon: <FiTrendingUp />,
      items: [
        {
          title: 'Неоновая кнопка',
          prompt:
            'Создай неоновую кнопку с glow эффектом для тёмной темы с плавной анимацией при наведении',
          description: 'Кнопка с ярким неоновым свечением',
          preview: `.btn-neon {
  background: transparent;
  color: #0ff;
  border: 2px solid #0ff;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.3s;
  text-transform: uppercase;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
}

.btn-neon:hover {
  background: #0ff;
  color: #000;
  box-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
}`,
          type: 'css',
        },
        {
          title: 'Градиентная кнопка',
          prompt: 'Создай кнопку с плавным градиентом и hover эффектами, современный дизайн',
          description: 'Современная кнопка с градиентом',
          preview: `.btn-gradient {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  font-family: 'Roboto', sans-serif;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}`,
          type: 'css',
        },
        {
          title: '3D кнопка',
          prompt: 'Создай 3D кнопку с эффектом нажатия и тенью',
          description: 'Кнопка с 3D эффектом и анимацией нажатия',
          preview: `.btn-3d {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 4px #388E3C;
  position: relative;
  transition: all 0.1s;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
}

.btn-3d:active {
  box-shadow: 0 2px #388E3C;
  transform: translateY(2px);
}`,
          type: 'css',
        },
        {
          title: 'Кнопка с загрузкой',
          prompt: 'Создай кнопку с анимацией загрузки при клике',
          description: 'Кнопка с индикатором загрузки',
          preview: `.btn-loading {
  background: #2196F3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  font-family: 'Roboto', sans-serif;
}

.btn-loading.loading {
  padding-right: 40px;
}

.btn-loading::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-loading.loading::after {
  opacity: 1;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}`,
          type: 'css',
        },
        {
          title: 'Кнопка с пульсацией',
          prompt: 'Создай кнопку с пульсирующим эффектом при наведении',
          description: 'Кнопка с анимацией пульсации',
          preview: `.btn-pulse {
  background: #ff4081;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  font-family: 'Roboto', sans-serif;
}

.btn-pulse:hover::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transform: translate(-50%, -50%) scale(1);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}`,
          type: 'css',
        },
        {
          title: 'Кнопка с обводкой',
          prompt: 'Создай минималистичную кнопку с обводкой и эффектом заполнения при наведении',
          description: 'Кнопка с обводкой и заливкой при наведении',
          preview: `.btn-outline {
  background: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Roboto', sans-serif;
}

.btn-outline:hover {
  background: #3b82f6;
  color: white;
}`,
          type: 'css',
        },
      ],
    },
    {
      category: 'Навигация',
      icon: <FiLayout />,
      items: [
        {
          title: 'Хлебные крошки',
          prompt: 'Создай стиль для хлебных крошек с сепараторами и hover эффектами',
          description: 'Навигационные хлебные крошки для сайта',
          preview: `.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  font-family: 'Roboto', sans-serif;
}

.breadcrumb-item {
  text-decoration: none;
  color: #666;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: #3b82f6;
}

.breadcrumb-item.active {
  color: #000;
  font-weight: bold;
}

.breadcrumb-separator {
  color: #999;
}`,
          type: 'css',
        },
        {
          title: 'Бургер меню',
          prompt: 'Создай анимированное бургер меню для мобильной навигации',
          description: 'Иконка бургер меню с анимацией',
          preview: `.burger-menu {
  width: 30px;
  height: 24px;
  position: relative;
  cursor: pointer;
}

.burger-line {
  width: 100%;
  height: 3px;
  background: #000;
  position: absolute;
  left: 0;
  transition: all 0.3s;
}

.burger-line:nth-child(1) { top: 0; }
.burger-line:nth-child(2) { top: 50%; transform: translateY(-50%); }
.burger-line:nth-child(3) { bottom: 0; }

.burger-menu.active .burger-line:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.burger-menu.active .burger-line:nth-child(2) {
  opacity: 0;
}

.burger-menu.active .burger-line:nth-child(3) {
  bottom: 50%;
  transform: translateY(50%) rotate(-45deg);
}`,
          type: 'css',
        },
        {
          title: 'Вертикальное меню',
          prompt: 'Создай вертикальное навигационное меню с hover эффектами',
          description: 'Вертикальное меню для боковой панели',
          preview: `.vertical-menu {
  width: 200px;
  font-family: 'Roboto', sans-serif;
}

.vertical-menu a {
  display: block;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  border-left: 4px solid transparent;
  transition: all 0.3s;
}

.vertical-menu a:hover {
  border-left: 4px solid #3b82f6;
  background: #f0f0f0;
  color: #3b82f6;
}`,
          type: 'css',
        },
        {
          title: 'Табы навигации',
          prompt: 'Создай стили для табов навигации с активным состоянием',
          description: 'Табы с анимацией переключения',
          preview: `.nav-tabs {
  display: flex;
  gap: 8px;
  font-family: 'Roboto', sans-serif;
}

.nav-tab {
  padding: 10px 20px;
  background: #f0f0f0;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-tab.active {
  background: #3b82f6;
  color: white;
}

.nav-tab:hover {
  background: #e0e0ff;
}`,
          type: 'css',
        },
      ],
    },
    {
      category: 'Формы',
      icon: <FiStar />,
      items: [
        {
          title: 'Input с валидацией',
          prompt: 'Создай стиль для input поля с валидацией ошибок и успехом',
          description: 'Поле ввода с индикацией валидации',
          preview: `.input-validation {
  width: 100%;
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  font-family: 'Roboto', sans-serif;
}

.input-validation:focus {
  outline: none;
  border-color: #2196F3;
}

.input-validation.valid {
  border-color: #4CAF50;
}

.input-validation.invalid {
  border-color: #f44336;
}`,
          type: 'css',
        },
        {
          title: 'Кнопка submit',
          prompt: 'Создай анимированную кнопку submit для формы',
          description: 'Кнопка отправки формы с hover эффектом',
          preview: `.submit-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  font-family: 'Roboto', sans-serif;
}

.submit-btn:hover {
  background: #1976D2;
  transform: scale(1.05);
}`,
          type: 'css',
        },
        {
          title: 'Чекбокс',
          prompt: 'Создай кастомный стиль для чекбокса с анимацией',
          description: 'Чекбокс с плавной анимацией выбора',
          preview: `.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
}

.custom-checkbox input {
  display: none;
}

.custom-checkbox span {
  width: 20px;
  height: 20px;
  border: 2px solid #3b82f6;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s;
}

.custom-checkbox input:checked + span {
  background: #3b82f6;
}

.custom-checkbox input:checked + span::after {
  content: '✔';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}`,
          type: 'css',
        },
        {
          title: 'Селект',
          prompt: 'Создай стиль для выпадающего списка с hover эффектом',
          description: 'Кастомный выпадающий список',
          preview: `.custom-select {
  position: relative;
  width: 200px;
  font-family: 'Roboto', sans-serif;
}

.custom-select select {
  width: 100%;
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background: white;
  appearance: none;
  cursor: pointer;
}

.custom-select::after {
  content: '▼';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.custom-select select:focus {
  border-color: #3b82f6;
  outline: none;
}`,
          type: 'css',
        },
      ],
    },
    {
      category: 'Карточки',
      icon: <FiGrid />,
      items: [
        {
          title: 'Карточка продукта',
          prompt: 'Создай стиль для карточки продукта с hover эффектом и тенью',
          description: 'Карточка для интернет-магазина',
          preview: `.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: all 0.3s;
  font-family: 'Roboto', sans-serif;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}`,
          type: 'css',
        },
        {
          title: 'Карточка с изображением',
          prompt: 'Создай карточку с масштабируемым изображением при наведении',
          description: 'Карточка с анимацией изображения',
          preview: `.image-card {
  width: 300px;
  overflow: hidden;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
}

.image-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-card:hover img {
  transform: scale(1.1);
}

.image-card-content {
  padding: 16px;
}`,
          type: 'css',
        },
        {
          title: 'Карточка профиля',
          prompt: 'Создай карточку профиля пользователя с аватаром и кнопкой',
          description: 'Карточка для профиля пользователя',
          preview: `.profile-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

.profile-card img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.profile-card button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}`,
          type: 'css',
        },
      ],
    },
    {
      category: 'Модальные окна',
      icon: <FiMenu />,
      items: [
        {
          title: 'Простое модальное окно',
          prompt: 'Создай стиль для модального окна с анимацией появления',
          description: 'Модальное окно с плавным появлением',
          preview: `.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  animation: modalAppear 0.3s forwards;
  font-family: 'Roboto', sans-serif;
}

@keyframes modalAppear {
  to { transform: translate(-50%, -50%) scale(1); }
}`,
          type: 'css',
        },
        {
          title: 'Модальное окно с затемнением',
          prompt: 'Создай модальное окно с затемнением фона',
          description: 'Модальное окно с эффектом затемнения',
          preview: `.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  font-family: 'Roboto', sans-serif;
}`,
          type: 'css',
        },
      ],
    },
  ];

  const copyToClipboard = async (prompt, templateName) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(templateName);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Не удалось скопировать промпт');
    }
  };

  const useTemplate = (prompt) => {
    navigate('/chat', { state: { presetPrompt: prompt } });
  };

  const showPreview = (template) => {
    setPreviewData(template);
  };

  const closePreview = () => {
    setPreviewData(null);
  };

  const renderPreview = (template) => {
    if (!template || !template.preview) return null;

    const getPreviewHTML = (template) => {
      switch (template.title) {
        case 'Неоновая кнопка':
          return `
            <div class="preview-container">
              <button class="btn-neon">Неоновая</button>
            </div>
          `;
        case 'Градиентная кнопка':
          return `
            <div class="preview-container">
              <button class="btn-gradient">Градиент</button>
            </div>
          `;
        case '3D кнопка':
          return `
            <div class="preview-container">
              <button class="btn-3d">3D Кнопка</button>
            </div>
          `;
        case 'Кнопка с загрузкой':
          return `
            <div class="preview-container">
              <button class="btn-loading">Загрузка</button>
            </div>
          `;
        case 'Кнопка с пульсацией':
          return `
            <div class="preview-container">
              <button class="btn-pulse">Пульсация</button>
            </div>
          `;
        case 'Кнопка с обводкой':
          return `
            <div class="preview-container">
              <button class="btn-outline">Обводка</button>
            </div>
          `;
        case 'Хлебные крошки':
          return `
            <div class="preview-container">
              <div class="breadcrumbs">
                <a class="breadcrumb-item" href="javascript:void(0)">Главная</a>
                <span class="breadcrumb-separator">/</span>
                <a class="breadcrumb-item" href="javascript:void(0)">Категория</a>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-item active">Страница</span>
              </div>
            </div>
          `;
        case 'Бургер меню':
          return `
            <div class="preview-container">
              <div class="burger-menu">
                <div class="burger-line"></div>
                <div class="burger-line"></div>
                <div class="burger-line"></div>
              </div>
            </div>
          `;
        case 'Вертикальное меню':
          return `
            <div class="preview-container">
              <div class="vertical-menu">
                <a href="javascript:void(0)">Главная</a>
                <a href="javascript:void(0)">О нас</a>
                <a href="javascript:void(0)">Контакты</a>
              </div>
            </div>
          `;
        case 'Табы навигации':
          return `
            <div class="preview-container">
              <div class="nav-tabs">
                <div class="nav-tab active">Таб 1</div>
                <div class="nav-tab">Таб 2</div>
                <div class="nav-tab">Таб 3</div>
              </div>
            </div>
          `;
        case 'Input с валидацией':
          return `
            <div class="preview-container">
              <input class="input-validation valid" type="text" placeholder="Введите текст" />
            </div>
          `;
        case 'Кнопка submit':
          return `
            <div class="preview-container">
              <button class="submit-btn">Отправить</button>
            </div>
          `;
        case 'Чекбокс':
          return `
            <div class="preview-container">
              <label class="custom-checkbox">
                <input type="checkbox" checked />
                <span></span>
                Чекбокс
              </label>
            </div>
          `;
        case 'Селект':
          return `
            <div class="preview-container">
              <div class="custom-select">
                <select>
                  <option>Опция 1</option>
                  <option>Опция 2</option>
                  <option>Опция 3</option>
                </select>
              </div>
            </div>
          `;
        case 'Карточка продукта':
          return `
            <div class="preview-container">
              <div class="product-card">
                <h3>Продукт</h3>
                <p>Описание продукта</p>
              </div>
            </div>
          `;
        case 'Карточка с изображением':
          return `
            <div class="preview-container">
              <div class="image-card">
                <img src="https://via.placeholder.com/300x200" alt="Placeholder" />
                <div class="image-card-content">
                  <h3>Карточка</h3>
                  <p>Описание</p>
                </div>
              </div>
            </div>
          `;
        case 'Карточка профиля':
          return `
            <div class="preview-container">
              <div class="profile-card">
                <img src="https://via.placeholder.com/80" alt="Avatar" />
                <h3>Пользователь</h3>
                <button>Подписаться</button>
              </div>
            </div>
          `;
        case 'Простое модальное окно':
          return `
            <div class="preview-container">
              <div class="modal">
                <h3>Модальное окно</h3>
                <p>Содержимое модального окна</p>
              </div>
            </div>
          `;
        case 'Модальное окно с затемнением':
          return `
            <div class="preview-container">
              <div class="modal-overlay">
                <div class="modal-content">
                  <h3>Модальное окно</h3>
                  <p>Содержимое</p>
                </div>
              </div>
            </div>
          `;
        default:
          return '<div class="preview-container">Предпросмотр недоступен</div>';
      }
    };

    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
              font-family: 'Roboto', sans-serif;
            }
            body { 
              margin: 0; 
              padding: 20px; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: calc(100vh - 40px);
              background: linear-gradient(135deg, #e0e7ff 0%, #c3e8fa 100%);
            }
            .preview-container {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              justify-content: center;
              align-items: center;
              width: 100%;
              max-width: 400px;
              background: white;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
            a, button, input, select, label, .product-card, .image-card, .profile-card, .modal, .modal-overlay {
              cursor: pointer;
              transition: all 0.3s;
            }
            a:hover, button:hover, input:hover, select:hover, label:hover, .product-card:hover, .image-card:hover, .profile-card:hover {
              opacity: 0.85;
            }
            a {
              text-decoration: none;
            }
            ${template.preview}
          </style>
        </head>
        <body>
          ${getPreviewHTML(template)}
          <script>
            // Prevent default navigation for links
            document.querySelectorAll('a').forEach(link => {
              link.setAttribute('href', 'javascript:void(0)');
              link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
              });
            });

            // Burger menu toggle
            document.querySelectorAll('.burger-menu').forEach(menu => {
              menu.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
              });
            });

            // Loading button animation
            document.querySelectorAll('.btn-loading').forEach(btn => {
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.add('loading');
                setTimeout(() => this.classList.remove('loading'), 2000);
              });
            });

            // 3D button animation
            document.querySelectorAll('.btn-3d').forEach(btn => {
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.add('active');
                setTimeout(() => this.classList.remove('active'), 200);
              });
            });

            // Navigation tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
              tab.addEventListener('click', function(e) {
                e.stopPropagation();
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
              });
            });

            // Checkboxes
            document.querySelectorAll('.custom-checkbox input').forEach(checkbox => {
              checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
              });
            });

            // Select dropdowns
            document.querySelectorAll('select').forEach(select => {
              select.addEventListener('change', function(e) {
                e.stopPropagation();
              });
            });

            // Input validation simulation
            document.querySelectorAll('.input-validation').forEach(input => {
              input.addEventListener('input', function(e) {
                e.stopPropagation();
                const value = this.value;
                this.classList.remove('valid', 'invalid');
                if (value.length > 0) {
                  this.classList.add(value.length > 3 ? 'valid' : 'invalid');
                }
              });
            });

            // Profile card button
            document.querySelectorAll('.profile-card button').forEach(btn => {
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.textContent = this.textContent === 'Подписаться' ? 'Отписаться' : 'Подписаться';
              });
            });

            // Simulate hover effects for cards
            document.querySelectorAll('.product-card, .image-card, .profile-card').forEach(card => {
              card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
              });
              card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              });
            });

            // Simulate modal animation
            document.querySelectorAll('.modal').forEach(modal => {
              setTimeout(() => {
                modal.style.transform = 'translate(-50%, -50%) scale(1)';
              }, 100);
            });
          </script>
        </body>
      </html>
    `;

    return (
      <iframe
        srcDoc={iframeContent}
        style={{
          width: '100%',
          height: '350px',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          background: 'white',
        }}
        title="Preview"
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-pointer-lock"
      />
    );
  };

  return (
    <div className="main">
      <div className="templates-container">
        <div className="templates-header">
          <h1>Генератор промптов</h1>
          <p>Готовые шаблоны промптов для быстрого старта</p>
        </div>

        <div className="templates-grid">
          {templates.map((category, categoryIndex) => (
            <div key={categoryIndex} className="template-category">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h2 className="category-title">{category.category}</h2>
              </div>
              <div className="templates-list">
                {category.items.map((template, templateIndex) => (
                  <div key={templateIndex} className="template-card">
                    <div className="template-header">
                      <FiCode className="template-icon" />
                      <h3>{template.title}</h3>
                    </div>
                    <p className="template-description">{template.description}</p>

                    <button
                      className="template-preview-btn"
                      onClick={() => showPreview(template)}
                      title="Предпросмотр">
                      <FiEye size={14} />
                      Предпросмотр
                    </button>

                    <div className="template-actions">
                      <button
                        className="template-use-btn"
                        onClick={() => useTemplate(template.prompt)}>
                        Использовать
                      </button>
                      <button
                        className={`template-copy-btn ${
                          copiedPrompt === template.title ? 'copied' : ''
                        }`}
                        onClick={() => copyToClipboard(template.prompt, template.title)}
                        title="Копировать промпт">
                        <FiCopy size={14} />
                        {copiedPrompt === template.title ? 'Скопировано!' : 'Копировать'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewData && (
        <div className="preview-modal" onClick={closePreview}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>{previewData.title}</h3>
              <button className="preview-close-btn" onClick={closePreview}>
                <FiX size={20} />
              </button>
            </div>
            <div className="preview-modal-body">
              <div className="preview-code">
                <h4>CSS код:</h4>
                <pre>{previewData.preview}</pre>
              </div>
              <div className="preview-render">
                <h4>Предпросмотр:</h4>
                {renderPreview(previewData)}
              </div>
            </div>
            <div className="preview-modal-footer">
              <button
                className="preview-use-btn"
                onClick={() => {
                  useTemplate(previewData.prompt);
                  closePreview();
                }}>
                Использовать этот промпт
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromptTemplates;
