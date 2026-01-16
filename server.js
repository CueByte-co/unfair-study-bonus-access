/**
 * Optional Express server to verify Gumroad license keys.
 * Deploy this separately (Vercel, Railway, Heroku).
 *
 * Endpoint: POST /api/verify
 *  body: { licenseKey: "XXXX-XXXX-XXXX-XXXX" }
 *
 * IMPORTANT: Do NOT embed any secret/access token in client-side code.
 */
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GUMROAD_PRODUCT_PERMA = process.env.GUMROAD_PRODUCT_PERMA || '';
const GUMROAD_ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN || '';

app.post('/api/verify', async (req, res) => {
  const { licenseKey } = req.body || {};
  if (!licenseKey) return res.status(400).json({ valid: false, message: 'licenseKey required' });

  const pattern = /^[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}$/;
  if (!pattern.test((licenseKey || '').trim().toUpperCase())) {
    return res.status(400).json({ valid: false, message: 'Invalid license format' });
  }

  if (!GUMROAD_PRODUCT_PERMA) {
    return res.status(500).json({ valid: false, message: 'Server not configured' });
  }

  try {
    const form = new URLSearchParams();
    form.append('product_permalink', GUMROAD_PRODUCT_PERMA);
    form.append('license_key', licenseKey.trim());
    if (GUMROAD_ACCESS_TOKEN) form.append('access_token', GUMROAD_ACCESS_TOKEN);

    const gumroadRes = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });

    const gumroadJson = await gumroadRes.json();
    if (gumroadJson && gumroadJson.success) {
      return res.json({ valid: true, message: 'License valid', license: gumroadJson });
    } else {
      const message = gumroadJson && gumroadJson.error ? gumroadJson.error : 'License invalid';
      return res.status(400).json({ valid: false, message });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ valid: false, message: 'Verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Verify server listening on ${PORT}`);
});
