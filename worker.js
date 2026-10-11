// Diamond Royalty Cleaning — site + booking API in one Worker.
// Static assets (index.html, artwork, payment mark) are imported as modules;
// everything that is not a static asset (POST /api/booking) is handled here.
// Deployed as the `diamond-site` Worker; diamondroyaltycleaningco.com and
// www.diamondroyaltycleaningco.com are attached as custom domains.

import html from './index.html';
import applePayMark from './Apple_Pay_Mark_RGB_041619.svg';
import heroImage from './webp-candidates/c1-original-q85.webp';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };
const FROM = 'Diamond Royalty Cleaning <bookings@diamondroyaltycleaningco.com>';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: JSON_HEADERS });
}

function field(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

async function sendEmail(env, to, subject, text) {
  if (!to) return false;
  // BOOKING_NOTIFY_EMAIL may list several recipients, comma-separated.
  const toList = String(to).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  if (!toList.length) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: toList, subject: subject, text: text }),
  });
  return res.ok;
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

async function handleBooking(request, env) {
  if (!env || !env.DB || !env.RESEND_API_KEY) {
    return json({ error: 'Booking service is not configured.' }, 500);
  }
  const lenHeader = request.headers.get('content-length');
  if (lenHeader && Number(lenHeader) > 10000) {
    return json({ error: 'Request too large.' }, 413);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }
  if (typeof body !== 'object' || body === null) {
    return json({ error: 'Invalid request body.' }, 400);
  }
  if (typeof body.company_website === 'string' && body.company_website.trim() !== '') {
    return json({ ok: true }, 201);
  }
  if (body.ack !== true) {
    return json({ error: 'Acknowledgement is required.' }, 400);
  }
  const rec = {
    name: field(body.name, 100),
    email: field(body.email, 254),
    phone: field(body.phone, 20),
    zip: field(body.zip, 5),
    service: field(body.service, 40),
    bedrooms: field(body.bedrooms, 10),
    bathrooms: field(body.bathrooms, 10),
    frequency: field(body.frequency, 20) || 'One time',
    preferred_date: field(body.date, 10) || null,
    notes: field(body.notes, 2000) || null,
  };
  if (!rec.name) return json({ error: 'Name is required.' }, 400);
  if (!EMAIL_RE.test(rec.email)) return json({ error: 'A valid email is required.' }, 400);
  if (!rec.phone) return json({ error: 'Phone number is required.' }, 400);
  if (!/^[0-9]{5}$/.test(rec.zip)) return json({ error: 'A 5-digit ZIP code is required.' }, 400);
  if (!rec.service) return json({ error: 'Please choose a service.' }, 400);
  if (!rec.bedrooms) return json({ error: 'Bedrooms are required.' }, 400);
  if (!rec.bathrooms) return json({ error: 'Bathrooms are required.' }, 400);
  if (rec.preferred_date && rec.preferred_date < todayUTC()) {
    return json({ error: 'Preferred date must be today or later.' }, 400);
  }
  const userAgent = request.headers.get('User-Agent') || '';
  const row = await env.DB
    .prepare('INSERT INTO bookings (name, email, phone, zip, service, bedrooms, bathrooms, frequency, preferred_date, notes, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(rec.name, rec.email, rec.phone, rec.zip, rec.service, rec.bedrooms, rec.bathrooms, rec.frequency, rec.preferred_date, rec.notes, userAgent)
    .run();
  const id = row && row.meta ? row.meta.last_row_id : null;
  const lines = [
    'Name: ' + rec.name,
    'Email: ' + rec.email,
    'Phone: ' + rec.phone,
    'ZIP: ' + rec.zip,
    'Service: ' + rec.service,
    'Bedrooms: ' + rec.bedrooms,
    'Bathrooms: ' + rec.bathrooms,
    'Frequency: ' + rec.frequency,
    'Preferred date: ' + (rec.preferred_date || 'Flexible / not specified'),
    'Notes: ' + (rec.notes || 'None provided'),
  ];
  const recap = lines.join('\n');
  const ownerText = 'New booking request #' + id + '\n\n' + recap + '\n\nCall or reply to confirm details and pricing.';
  const customerText = 'Hi ' + rec.name + ',\n\nThank you for choosing Diamond Royalty Cleaning Company. Your request has been forwarded to our team and is being reviewed. We will contact you at ' + rec.phone + ' or ' + rec.email + ' to confirm details and pricing. No appointment is confirmed yet.\n\nDiamond Royalty Cleaning Company\n(917) 270-3611';
  let ownerEmailed = false;
  let customerEmailed = false;
  try {
    ownerEmailed = await sendEmail(env, env.BOOKING_NOTIFY_EMAIL, 'New booking request — ' + rec.service + ' — ZIP ' + rec.zip, ownerText);
  } catch {
    ownerEmailed = false;
  }
  try {
    customerEmailed = await sendEmail(env, rec.email, 'We received your cleaning request — Diamond Royalty Cleaning', customerText);
  } catch {
    customerEmailed = false;
  }
  return json({ ok: true, id: id, summary: recap, owner_emailed: ownerEmailed, customer_emailed: customerEmailed }, 201);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/booking') {
      if (request.method === 'POST') return handleBooking(request, env);
      return json({ error: 'Method not allowed.' }, 405);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return json({ error: 'Method not allowed.' }, 405);
    }
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
    }
    if (url.pathname === '/Apple_Pay_Mark_RGB_041619.svg') {
      return new Response(applePayMark, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' } });
    }
    if (url.pathname === '/webp-candidates/c1-original-q85.webp') {
      return new Response(heroImage, { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=86400' } });
    }
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  },
};
