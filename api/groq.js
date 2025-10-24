export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обрабатываем preflight запросы
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  try {
    console.log('🔄 Proxying request to Groq API...');

    // API ключ из Environment Variables Vercel
    const API_KEY = process.env.GROQ_API_KEY;

    console.log('🔑 API Key check:', {
      exists: !!API_KEY,
      length: API_KEY ? API_KEY.length : 0,
    });

    if (!API_KEY) {
      console.error('❌ GROQ_API_KEY is not set in Vercel environment variables');
      return res.status(500).json({
        error:
          'Server configuration error: GROQ_API_KEY is not set. Please add it in Vercel project settings.',
      });
    }

    const requestBody = req.body;

    // Делаем запрос к Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Groq API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Groq API error: ${response.status}`,
      });
    }

    const data = await response.json();
    console.log('✅ Groq request successful');

    return res.status(200).json(data);
  } catch (error) {
    console.error('💥 Proxy error:', error);
    return res.status(500).json({
      error: `Internal server error: ${error.message}`,
    });
  }
}
