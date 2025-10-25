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
  FiGlobe,
  FiUser,
  FiMail,
  FiShoppingCart,
  FiCreditCard,
} from 'react-icons/fi';

function PromptTemplates() {
  const navigate = useNavigate();
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const templates = [
    {
      category: 'Лендинги',
      icon: <FiGlobe />,
      items: [
        {
          title: 'Лендинг SaaS продукта',
          prompt: `Создай современный лендинг для SaaS продукта с:
- Герой-секцией с заголовком и CTA
- Секцией преимуществ с иконками
- Секцией цен с 3 тарифами
- FAQ секцией
- Футером с контактами

Используй современный дизайн с градиентами, анимациями при скролле и адаптивную верстку.`,
          description: 'Полноценный лендинг для SaaS продукта',
          preview: `.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  padding: 80px 20px;
}

.pricing-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}`,
          type: 'html',
        },
        {
          title: 'Лендинг мероприятия',
          prompt: `Создай продающий лендинг для онлайн-мероприятия с:
- Таймером обратного отсчета
- Формой регистрации
- Спикером и программой
- Секцией отзывов
- Призывом к действию

Сделай энергичный дизайн с акцентами и анимациями.`,
          description: 'Лендинг для конференции или вебинара',
          preview: `.countdown-timer {
  display: flex;
  gap: 20px;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.speaker-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}`,
          type: 'html',
        },
        {
          title: 'Портфолио фрилансера',
          prompt: `Создай минималистичное портфолио для фрилансера с полным HTML и CSS кодом. Включи:

HTML СТРУКТУРА:
- Шапку с навигацией по разделам
- Секцию "О себе" с навыками
- Галерею проектов в сетке
- Процесс работы по шагам
- Отзывы клиентов
- Контактную форму
- Футер

CSS СТИЛИ (минималистичные):
- Чистый дизайн с акцентом на контент
- Современная типографика
- Плавные анимации и переходы
- Адаптивную верстку
- Цветовую схему с акцентами
- Сетку для проектов
- Стили для формы

ТРЕБОВАНИЯ:
- Верни ПОЛНЫЙ HTML и CSS в одном ответе
- CSS должен быть современным и чистым
- Используй CSS Grid/Flexbox для layout
- Добавь hover эффекты для интерактивности
- Сделай адаптивным для мобильных`,
          description: 'Минималистичное портфолио с полным кодом',
          preview: `/* Пример CSS стилей */
.portfolio {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}`,
          type: 'html',
        },
      ],
    },
    {
      category: 'Веб-приложения',
      icon: <FiLayout />,
      items: [
        {
          title: 'Дашборд аналитики',
          prompt: `Создай дашборд для аналитики с:
- Статистическими карточками
- Графиками и диаграммами
- Таблицей данных
- Фильтрами и поиском
- Боковым меню навигации

Используй темную тему с акцентными цветами для данных.`,
          description: 'Админ-панель с аналитикой и графиками',
          preview: `.dashboard-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.chart-container {
  background: #1e1e2d;
  border-radius: 12px;
  padding: 24px;
}`,
          type: 'html',
        },
        {
          title: 'Интернет-магазин',
          prompt: `Создай главную страницу интернет-магазина с:
- Каталогом товаров сеткой
- Фильтрами по категориям
- Корзиной покупок
- Слайдером промо-акций
- Блоком популярных товаров

Сделай удобный UI для покупок.`,
          description: 'E-commerce платформа с каталогом',
          preview: `.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.cart-sidebar {
  position: fixed;
  right: -400px;
  top: 0;
  width: 400px;
  height: 100vh;
  background: white;
  transition: right 0.3s ease;
}`,
          type: 'html',
        },
        {
          title: 'Трекер задач',
          prompt: `Создай приложение для управления задачами с:
- Досками (To Do, In Progress, Done)
- Drag & drop функциональностью
- Формой создания задач
- Фильтрами и метками
- Статистикой продуктивности

Реализуй Kanban-доску с возможностью перетаскивания.`,
          description: 'Trello-like доска задач',
          preview: `.kanban-board {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 20px;
}

.task-column {
  min-width: 300px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.task-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}`,
          type: 'html',
        },
      ],
    },
    {
      category: 'Формы и авторизация',
      icon: <FiUser />,
      items: [
        {
          title: 'Форма регистрации',
          prompt: `Создай современную форму регистрации с:
- Полями: имя, email, пароль
- Валидацией в реальном времени
- Кнопкой социальных сетей
- Ссылкой на логин
- Анимацией загрузки

Сделай UX-friendly форму с подсказками.`,
          description: 'Форма регистрации с валидацией',
          preview: `.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}

.social-buttons {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}`,
          type: 'html',
        },
        {
          title: 'Форма обратной связи',
          prompt: `Создай форму обратной связи с:
- Полями: имя, email, тема, сообщение
- Валидацией email
- Индикатором отправки
- Подтверждением успешной отправки
- Адаптивным дизайном

Добавь микро-анимации для улучшения UX.`,
          description: 'Контактная форма с валидацией',
          preview: `.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}`,
          type: 'html',
        },
        {
          title: 'Форма оплаты',
          prompt: `Создай безопасную форму оплаты с:
- Полями для данных карты
- Маской ввода номера карты
- Выбором способа оплаты
- Иконками платежных систем
- Подтверждением платежа

Сделай форму похожей на реальные платежные системы.`,
          description: 'Форма для приема платежей',
          preview: `.payment-form {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.card-input {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
}`,
          type: 'html',
        },
        {
          title: 'Форма входа',
          prompt: `Создай минималистичную форму входа с:
- Полями email и пароль
- Чекбоксом "Запомнить меня"
- Ссылкой восстановления пароля
- Кнопками социальных сетей
- Анимацией появления ошибок

Используй чистый дизайн с акцентом на usability.`,
          description: 'Логин форма с социальными кнопками',
          preview: `.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}`,
          type: 'html',
        },
      ],
    },
    {
      category: 'Компоненты UI',
      icon: <FiGrid />,
      items: [
        {
          title: 'Навигационная панель',
          prompt: `Создай современную навигационную панель с:
- Логотипом и меню
- Выпадающими списками
- Кнопкой CTA
- Адаптивным бургер-меню
- Sticky позиционированием

Сделай плавные анимации для ховеров.`,
          description: 'Responsive навбар с выпадающими меню',
          preview: `.navbar {
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  padding: 0 40px;
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}`,
          type: 'html',
        },
        {
          title: 'Карточка товара',
          prompt: `Создай карточку товара для интернет-магазина с:
- Изображением товара
- Названием и ценой
- Рейтингом звездами
- Кнопкой "В корзину"
- Ховер-эффектами

Добавь микро-интеракции при наведении.`,
          description: 'E-commerce карточка продукта',
          preview: `.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}`,
          type: 'html',
        },
        {
          title: 'Футер сайта',
          prompt: `Создай комплексный футер с:
- Логотипом и описанием
- Ссылками по категориям
- Социальными иконками
- Формой подписки на рассылку
- Копирайтом

Сделай его информативным и стильным.`,
          description: 'Многосекционный футер',
          preview: `.footer {
  background: #1a1a2e;
  color: white;
  padding: 60px 0 30px;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}`,
          type: 'html',
        },
        {
          title: 'Галерея изображений',
          prompt: `Создай адаптивную галерею изображений с:
- Сеткой фотографий
- Лайтбоксом при клике
- Фильтрами по категориям
- Ленивой загрузкой
- Анимацией появления

Реализуй masonry layout для фотографий.`,
          description: 'Responsive галерея с лайтбоксом',
          preview: `.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  display: none;
}`,
          type: 'html',
        },
      ],
    },
    {
      category: 'Специальные страницы',
      icon: <FiStar />,
      items: [
        {
          title: 'Страница 404',
          prompt: `Создай креативную страницу 404 с:
- Забавной иллюстрацией
- Сообщением об ошибке
- Поиском по сайту
- Ссылками на главные разделы
- Анимацией

Сделай ее полезной, а не просто сообщением об ошибке.`,
          description: 'Креативная страница ошибки 404',
          preview: `.error-page {
  text-align: center;
  padding: 100px 20px;
}

.error-illustration {
  max-width: 400px;
  margin: 0 auto 40px;
}`,
          type: 'html',
        },
        {
          title: 'Страница благодарности',
          prompt: `Создай страницу благодарности после отправки формы с:
- Сообщением успеха
- Информацией о следующих шагах
- Кнопкой возврата
- Социальными шарингами
- Анимацией подтверждения

Сделай ее теплой и мотивирующей.`,
          description: 'Страница после успешной отправки формы',
          preview: `.success-page {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}`,
          type: 'html',
        },
        {
          title: 'Политика конфиденциальности',
          prompt: `Создай страницу политики конфиденциальности с:
- Структурированными разделами
- Легко читаемым текстом
- Навигацией по странице
- Responsive дизайном
- Профессиональным видом

Сделай сложный контент легко усваиваемым.`,
          description: 'Юридическая страница с навигацией',
          preview: `.policy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-nav {
  position: sticky;
  top: 100px;
}`,
          type: 'html',
        },
      ],
    },
    {
      category: 'Бизнес-шаблоны',
      icon: <FiTrendingUp />,
      items: [
        {
          title: 'Корпоративный сайт',
          prompt: `Создай корпоративный сайт компании с:
- О компании и миссией
- Секцией услуг
- Портфолио работ
- Командой специалистов
- Контактной информацией

Используй профессиональный дизайн с фирменными цветами.`,
          description: 'Сайт для бизнеса с услугами',
          preview: `.corporate-hero {
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('office.jpg');
  background-size: cover;
  color: white;
  padding: 150px 20px;
}`,
          type: 'html',
        },
        {
          title: 'Сайт ресторана',
          prompt: `Создай сайт для ресторана с:
- Меню с категориями
- Галереей блюд
- Онлайн-бронированием
- Отзывами клиентов
- Контактной картой

Сделай аппетитный дизайн с акцентами на еде.`,
          description: 'Сайт ресторана с меню и бронированием',
          preview: `.menu-category {
  margin-bottom: 60px;
}

.dish-card {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}`,
          type: 'html',
        },
        {
          title: 'Образовательная платформа',
          prompt: `Создай лендинг для онлайн-курсов с:
- Каталогом курсов
- Преподавателями
- Отзывами студентов
- FAQ по обучению
- Формой заявки

Сделай образовательный и доверительный дизайн.`,
          description: 'Платформа для онлайн-обучения',
          preview: `.course-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}`,
          type: 'html',
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
        case 'Лендинг SaaS продукта':
          return `
            <div class="preview-container">
              <div class="hero-section">
                <h1>Инновационный SaaS продукт</h1>
                <p>Решаем ваши бизнес-задачи с помощью AI</p>
                <button>Начать бесплатно</button>
              </div>
              <div class="features-grid">
                <div class="feature-card">
                  <h3>🚀 Быстрая интеграция</h3>
                  <p>Подключение за 5 минут</p>
                </div>
                <div class="feature-card">
                  <h3>💡 Умный AI</h3>
                  <p>Автоматизация процессов</p>
                </div>
              </div>
            </div>
          `;
        case 'Дашборд аналитики':
          return `
            <div class="preview-container">
              <div class="dashboard-grid">
                <nav class="sidebar">Навигация</nav>
                <main class="content">
                  <div class="stat-cards">
                    <div class="stat-card">Пользователи: 1,234</div>
                    <div class="stat-card">Доход: $45,678</div>
                  </div>
                  <div class="chart-container">График аналитики</div>
                </main>
              </div>
            </div>
          `;
        case 'Форма регистрации':
          return `
            <div class="preview-container">
              <div class="auth-form">
                <h2>Создать аккаунт</h2>
                <input type="text" placeholder="Имя">
                <input type="email" placeholder="Email">
                <input type="password" placeholder="Пароль">
                <button>Зарегистрироваться</button>
                <div class="social-buttons">
                  <button>Google</button>
                  <button>Facebook</button>
                </div>
              </div>
            </div>
          `;
        case 'Интернет-магазин':
          return `
            <div class="preview-container">
              <div class="product-grid">
                <div class="product-card">
                  <img src="https://via.placeholder.com/200" alt="Товар">
                  <h3>Название товара</h3>
                  <p>$99.99</p>
                  <button>В корзину</button>
                </div>
                <div class="product-card">
                  <img src="https://via.placeholder.com/200" alt="Товар">
                  <h3>Другой товар</h3>
                  <p>$149.99</p>
                  <button>В корзину</button>
                </div>
              </div>
            </div>
          `;
        default:
          return '<div class="preview-container">Предпросмотр шаблона</div>';
      }
    };

    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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
              font-family: 'Inter', sans-serif;
            }
            body { 
              margin: 0; 
              padding: 20px; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: calc(100vh - 40px);
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .preview-container {
              display: flex;
              flex-direction: column;
              gap: 20px;
              width: 100%;
              max-width: 500px;
              background: white;
              border-radius: 20px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
              padding: 30px;
              overflow-y: auto;
              max-height: 400px;
            }
            ${template.preview}
            
            /* Стили для предпросмотра компонентов */
            .hero-section {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 60px 30px;
              border-radius: 15px;
              text-align: center;
              margin-bottom: 20px;
            }
            
            .feature-card {
              background: #f8fafc;
              padding: 20px;
              border-radius: 10px;
              border: 1px solid #e2e8f0;
            }
            
            .auth-form {
              display: flex;
              flex-direction: column;
              gap: 15px;
            }
            
            .auth-form input {
              padding: 12px 16px;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              font-size: 16px;
            }
            
            .auth-form button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px;
              border-radius: 8px;
              cursor: pointer;
            }
            
            .social-buttons {
              display: flex;
              gap: 10px;
            }
            
            .social-buttons button {
              flex: 1;
              background: #64748b;
              color: white;
              border: none;
              padding: 10px;
              border-radius: 6px;
              cursor: pointer;
            }
            
            .product-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            
            .product-card {
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 15px;
              text-align: center;
            }
            
            .product-card img {
              width: 100%;
              border-radius: 8px;
              margin-bottom: 10px;
            }
            
            .product-card button {
              background: #10b981;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              width: 100%;
            }
            
            .dashboard-grid {
              display: grid;
              grid-template-columns: 200px 1fr;
              gap: 20px;
              height: 300px;
            }
            
            .sidebar {
              background: #1e293b;
              color: white;
              border-radius: 12px;
              padding: 20px;
            }
            
            .content {
              display: flex;
              flex-direction: column;
              gap: 15px;
            }
            
            .stat-cards {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            
            .stat-card {
              background: #f1f5f9;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
            }
            
            .chart-container {
              background: #1e293b;
              color: white;
              padding: 20px;
              border-radius: 12px;
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          </style>
        </head>
        <body>
          ${getPreviewHTML(template)}
          <script>
            // Добавляем базовую интерактивность для предпросмотра
            document.querySelectorAll('button').forEach(btn => {
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.style.opacity = '0.8';
                setTimeout(() => this.style.opacity = '1', 150);
              });
            });
            
            document.querySelectorAll('input').forEach(input => {
              input.addEventListener('focus', function() {
                this.style.borderColor = '#3b82f6';
              });
              input.addEventListener('blur', function() {
                this.style.borderColor = '#e2e8f0';
              });
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
          height: '450px',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
          <p>Готовые шаблоны для быстрого создания любых веб-проектов</p>
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
                <h4>Промпт:</h4>
                <pre>{previewData.prompt}</pre>
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
