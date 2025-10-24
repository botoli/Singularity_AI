import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './styles/App.scss';
import Home from './components/Home';
import MainChat from './components/mainchat';
import History from './components/History';
import PromptTemplates from './components/PromptTemplates';

const getApiConfig = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const apiKey = window.APP_CONFIG?.GROQ_API_KEY || import.meta.env.VITE_GROQ_API_KEY;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

      // Для мобильных используем proxy, для десктопа - прямое подключение
      const useProxy = isMobile;
      const baseURL = useProxy
        ? `${window.location.origin}/api/proxy`
        : 'https://api.groq.com/openai/v1';

      console.log('🔧 Mobile API Config:', {
        userAgent: navigator.userAgent,
        isMobile,
        useProxy,
        apiKey: apiKey ? '***' + apiKey.slice(-4) : 'MISSING',
        baseURL,
        currentOrigin: window.location.origin,
      });

      if (!apiKey) {
        alert(
          '❌ КРИТИЧЕСКАЯ ОШИБКА: API ключ не загружен. Проверьте переменную VITE_GROQ_API_KEY в .env',
        );
      }

      resolve({
        baseURL: baseURL,
        endpoint: useProxy ? '' : '/chat/completions',
        model: 'llama-3.3-70b-versatile',
        apiKey: apiKey,
        useProxy: useProxy,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }, 500);
  });
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState(null);

  useEffect(() => {
    getApiConfig().then((config) => {
      setApiConfig(config);
    });
  }, []);

  // Конфиг для серверного API
  const serverConfig = {
    baseURL: import.meta.env.VITE_SERVER_URL || 'https://your-server.com/api',
    endpoints: {
      saveChat: '/chats/save',
      getChats: '/chats',
      getChat: '/chats/:id',
      deleteChat: '/chats/:id',
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL не поддерживается');
      return;
    }

    const vsSource = `
        attribute vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

    const fsSource = `
        precision mediump float;
        uniform float t;
        uniform vec2 r;
  
        vec2 myTanh(vec2 x) {
          vec2 ex = exp(x);
          vec2 emx = exp(-x);
          return (ex - emx) / (ex + emx);
        }
  
        void main() {
          vec4 o_bg = vec4(0.0);
          vec4 o_anim = vec4(0.0);
  
          // Background Layer
          {
            vec2 p_img = (gl_FragCoord.xy * 2.0 - r) / r.y * mat2(1.0, -1.0, 1.0, 1.0);
            vec2 l_val = myTanh(p_img * 5.0 + 2.0);
            l_val = min(l_val, l_val * 3.0);
            vec2 clamped = clamp(l_val, -2.0, 0.0);
            float diff_y = clamped.y - l_val.y;
            float safe_px = abs(p_img.x) < 0.001 ? 0.001 : p_img.x;
            float term = (0.1 - max(0.01 - dot(p_img, p_img) / 200.0, 0.0) * (diff_y / safe_px))
                         / abs(length(p_img) - 0.7);
            o_bg += vec4(term);
            o_bg *= max(o_bg, vec4(0.0));
            o_bg.rgb *= vec3(0.1, 0.2, 0.4);
          }
  
          // Animation Layer
          {
            vec2 p_anim = (gl_FragCoord.xy * 2.0 - r) / r.y / 0.7;
            vec2 d = vec2(-1.0, 1.0);
            float denom = 0.1 + 5.0 / dot(5.0 * p_anim - d, 5.0 * p_anim - d);
            vec2 c = p_anim * mat2(1.0, 1.0, d.x / denom, d.y / denom);
            vec2 v = c;
            v *= mat2(cos(log(length(v)) + t * 0.2 + vec4(0.0, 33.0, 11.0, 0.0))) * 5.0;
            vec4 animAccum = vec4(0.0);
            for (int i = 1; i <= 9; i++) {
              float fi = float(i);
              animAccum += sin(vec4(v.x, v.y, v.y, v.x)) + vec4(1.0);
              v += 0.7 * sin(vec2(v.y, v.x) * fi + t) / fi + 0.5;
            }
            vec4 animTerm = 1.0 - exp(-exp(c.x * vec4(0.6, -0.4, -1.0, 0.0))
                              / animAccum
                              / (0.1 + 0.1 * pow(length(sin(v / 0.3) * 0.2 + c * vec2(1.0, 2.0)) - 1.0, 2.0))
                              / (1.0 + 7.0 * exp(0.3 * c.y - dot(c, c)))
                              / (0.03 + abs(length(p_anim) - 0.7)) * 0.2);
            o_anim += animTerm;
            o_anim.rgb *= vec3(0.3, 0.5, 1.0);
          }
  
          vec4 finalColor = mix(o_bg, o_anim, 0.5) * 1.5;
          finalColor = clamp(finalColor, 0.0, 1.0);
          gl_FragColor = finalColor;
        }
      `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Ошибка компиляции шейдера: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl, vsSource, fsSource) {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Ошибка линковки программы: ' + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    const program = createProgram(gl, vsSource, fsSource);
    if (!program) return;
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 't');
    const resolutionLocation = gl.getUniformLocation(program, 'r');

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    window.addEventListener('resize', resize);
    resize();

    let startTime = performance.now();
    function render() {
      let currentTime = performance.now();
      let delta = (currentTime - startTime) / 1000;
      gl.uniform1f(timeLocation, delta);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, []);

  const canvasRef = useRef(null);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <Router>
      <div className="body">
        <canvas id="glcanvas" ref={canvasRef}></canvas>
        <div className="round"></div>
        <header className="header">
          <div className="header-logo">
            <Link to="/">Singularity AI</Link>
          </div>
          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Главная
            </Link>
            <Link to="/chat" onClick={() => setMobileMenuOpen(false)}>
              Чат
            </Link>
            <Link to="/templates" onClick={() => setMobileMenuOpen(false)}>
              Генератор промптов
            </Link>
            <Link to="/history" onClick={() => setMobileMenuOpen(false)}>
              История
            </Link>
          </nav>
          <button className="mobile-toggle" onClick={toggleMobileMenu}>
            ☰
          </button>
        </header>
        <Routes>
          <Route
            path="/"
            element={<Home apiConfig={apiConfig} serverConfig={serverConfig} />}
            key="home"
          />
          <Route
            path="/chat"
            element={<MainChat apiConfig={apiConfig} serverConfig={serverConfig} />}
            key="chat"
          />
          <Route path="/templates" element={<PromptTemplates />} key="templates" />
          <Route path="/history" element={<History serverConfig={serverConfig} />} key="history" />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
