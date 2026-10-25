import { chatRequest } from './gemini.mjs';

export default async function handler(req, res) {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
    // These identity headers belong to the original host, not to Vercel.
    headers.delete('oai-authenticated-user-id');
    headers.delete('cf-connecting-ip');
    const ip = headers.get('x-vercel-forwarded-for');
    if (ip) headers.set('cf-connecting-ip', ip.split(',')[0].trim());
    const method = req.method || 'GET';
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += bytes.length;
      if (size > 96000) {
        res.statusCode = 413;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({error: 'Conversation is too long. Start a new chat.'}));
        return;
      }
      chunks.push(bytes);
    }
    const request = new Request(`https://${headers.get('host') || process.env.VERCEL_URL || 'localhost'}/api/chat`, {
      method, headers,
      ...(!['GET', 'HEAD'].includes(method) ? { body: Buffer.concat(chunks) } : {})
    });
    const response = await chatRequest(request, process.env);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(await response.text());
  } catch {
    console.error('V3school chat handler failed');
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({error: 'The chat service is unavailable. Please try again.'}));
  }
}
