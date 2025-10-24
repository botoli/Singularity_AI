export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const apiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ API KEY missing on server' });
    }

    // Читаем endpoint, который фронт прислал
    // пример: body = { endpoint: "/chat/completions", payload: {...} }
    const { endpoint, payload } = req.body;

    if (!endpoint) {
      return res.status(400).json({ error: 'endpoint is required' });
    }

    const url = `https://api.groq.com/openai/v1${endpoint}`;

    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
}
