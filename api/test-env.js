export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const envInfo = {
    GROQ_API_KEY: {
      exists: !!process.env.GROQ_API_KEY,
      length: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
      startsWithGsk: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.startsWith('gsk_') : false,
    },
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    allEnvKeys: Object.keys(process.env).filter(
      (key) => key.includes('API') || key.includes('KEY') || key.includes('GROQ'),
    ),
  };

  console.log('Environment check:', envInfo);

  return res.status(200).json(envInfo);
}
