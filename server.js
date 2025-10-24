const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3001;

// Настройка подключения к PostgreSQL
const pool = new Pool({
  user: 'your_username', // Замени на своё имя пользователя PostgreSQL
  host: 'localhost',
  database: 'chatbot_db',
  password: 'your_password', // Замени на свой пароль
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Эндпоинт для сохранения истории и предпросмотров
app.post('/save', async (req, res) => {
  const { messages, previews } = req.body;
  try {
    // Очистка старых данных
    await pool.query('DELETE FROM messages');
    await pool.query('DELETE FROM previews');

    // Сохранение сообщений
    for (const msg of messages) {
      await pool.query('INSERT INTO messages (role, content) VALUES ($1, $2)', [
        msg.role,
        msg.content,
      ]);
    }

    // Сохранение предпросмотров
    for (const type of ['css', 'html']) {
      for (const preview of previews[type]) {
        await pool.query('INSERT INTO previews (type, content) VALUES ($1, $2)', [
          type,
          preview.content,
        ]);
      }
    }

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Эндпоинт для получения истории и предпросмотров
app.get('/get', async (req, res) => {
  try {
    const messagesResult = await pool.query('SELECT role, content FROM messages ORDER BY id');
    const previewsResult = await pool.query('SELECT type, content FROM previews');

    const messages = messagesResult.rows;
    const previews = { css: [], html: [] };
    previewsResult.rows.forEach((row) => {
      previews[row.type].push({ content: row.content });
    });

    res.status(200).json({ messages, previews });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
