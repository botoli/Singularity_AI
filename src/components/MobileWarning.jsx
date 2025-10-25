import React from 'react';
import '../styles/App.scss';
import { FiMonitor, FiSmartphone, FiArrowRight } from 'react-icons/fi';

function MobileWarning() {
  return (
    <div className="mobile-warning">
      <div className="mobile-warning-container">
        <div className="warning-icon">
          <FiMonitor size={64} className="desktop-icon" />
          <FiArrowRight size={32} className="arrow-icon" />
          <FiSmartphone size={48} className="mobile-icon" />
        </div>

        <h1 className="warning-title">Десктопное приложение</h1>

        <div className="warning-content">
          <p className="warning-message">
            Это приложение оптимизировано для работы на компьютерах и ноутбуках с большим экраном.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-badge">🚀</span>
              <span>Полнофункциональный редактор кода</span>
            </div>
            <div className="feature-item">
              <span className="feature-badge">🎨</span>
              <span>Продвинутый предпросмотр с ресайзом</span>
            </div>
            <div className="feature-item">
              <span className="feature-badge">⚡</span>
              <span>Быстрые горячие клавиши</span>
            </div>
            <div className="feature-item">
              <span className="feature-badge">💾</span>
              <span>Удобное управление проектами</span>
            </div>
          </div>

          <div className="action-section">
            <p className="action-text">
              <strong>Пожалуйста, откройте это приложение на компьютере</strong>
              <br />
              для получения полного опыта работы.
            </p>

            <div className="device-tips">
              <div className="tip">
                <span className="tip-icon">💻</span>
                <span>Ноутбук или компьютер</span>
              </div>
              <div className="tip">
                <span className="tip-icon">🖥️</span>
                <span>Рекомендуемое разрешение: 1280px+</span>
              </div>
              <div className="tip">
                <span className="tip-icon">⌨️</span>
                <span>Клавиатура и мышь</span>
              </div>
            </div>
          </div>
        </div>

        <div className="warning-footer">
          <p className="footer-note">
            Мобильная версия находится в разработке и будет доступна в ближайшее время.
          </p>
          <button
            className="continue-button"
            onClick={() => {
              // Принудительное продолжение на свой страх и риск
              localStorage.setItem('mobileWarningDismissed', 'true');
              window.location.reload();
            }}>
            Продолжить на свой страх и риск
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileWarning;
