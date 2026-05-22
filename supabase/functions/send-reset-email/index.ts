import nodemailer from 'npm:nodemailer';
import { buildEmailHtml } from './email-template.ts';

const SMTP_HOST = Deno.env.get('SMTP_HOST') || '';
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587', 10);
const SMTP_USER = Deno.env.get('SMTP_USER') || '';
const SMTP_PASS = Deno.env.get('SMTP_PASS') || '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@clinicax.com';
const FROM_NAME = Deno.env.get('FROM_NAME') || 'Clínica X';
const INTERNAL_SECRET = Deno.env.get('INTERNAL_EMAIL_SECRET') || '';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface SendResetEmailPayload {
  email: string;
  nombre: string;
  token: string;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const secret = req.headers.get('x-internal-secret');
  if (secret !== INTERNAL_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload: SendResetEmailPayload = await req.json();
    const { email, nombre, token: resetLink } = payload;

    if (!email || !nombre || !resetLink) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const html = buildEmailHtml(nombre, resetLink);

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Recupera tu contraseña - Clínica X',
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
