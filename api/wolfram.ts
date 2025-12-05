// api/wolfram.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
// No fetch import needed — Vercel provides global fetch

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow only POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query } = req.body as { query?: string };

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Missing query' });
    return;
  }

  const appId = process.env.WOLFRAM_APP_ID;
  if (!appId) {
    res.status(500).json({ error: 'WOLFRAM_APP_ID not configured' });
    return;
  }

  try {
    // Simple API example – you can switch to a more complex endpoint later.
    const url = new URL('https://api.wolframalpha.com/v1/result');
    url.searchParams.set('i', query);     // input
    url.searchParams.set('appid', appId); // your API key

    const response = await fetch(url.toString());

    if (!response.ok) {
      const text = await response.text();
      res.status(500).json({ error: 'Wolfram error', details: text });
      return;
    }

    const text = await response.text();

    // We just return the raw text for now.
    res.status(200).json({
      ok: true,
      resultText: text,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Unexpected error', details: String(err) });
  }
}
