import nodemailer from "nodemailer";

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const escapeHtml = (value) => {
  return String(value).replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char];
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    if (process.env.NODE_ENV !== "test") {
      console.log(`\nEMAIL (dev) to: ${to}\nSubject: ${subject}\n${text}\n`);
    }

    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "AL-HASAD GATE <no-reply@alhasad.app>",
    to,
    subject,
    text,
    html,
  });
};

export const sendVerificationEmail = async ({ to, name, token }) => {
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")[0]
    .trim()
    .replace(/\/$/, "");

  const link = `${clientUrl}/verify-email?token=${token}`;

  await sendEmail({
    to,
    subject: "Verify your AL-HASAD GATE account",
    text: `Hi ${name}, verify your email by opening this link (valid for 24 hours): ${link}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#2e7d32">Welcome to AL-HASAD GATE, ${escapeHtml(name)}!</h2>
        <p>Please confirm your email address to activate your account.</p>
        <p>
          <a href="${link}"
             style="display:inline-block;padding:12px 24px;background:#2e7d32;color:#fff;text-decoration:none;border-radius:6px">
            Verify my email
          </a>
        </p>
        <p style="color:#666;font-size:13px">This link expires in 24 hours.</p>
      </div>
    `,
  });
};
