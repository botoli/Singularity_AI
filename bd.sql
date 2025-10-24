-- Создание базы данных
CREATE DATABASE chatbot_db;

-- Подключение к базе
\c chatbot_db

-- Создание таблицы для сообщений
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL
);

-- Создание таблицы для предпросмотров
CREATE TABLE previews (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL,
  content TEXT NOT NULL
);