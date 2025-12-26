import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing in .env");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail({ to, subject, html }) {
  try {
    if (!to) {
      throw new Error("Recipient email is required");
    }

    if (!process.env.MAIL_FROM) {
      throw new Error("MAIL_FROM is not set in environment variables");
    }

    const FROM_EMAIL = `Saginaw Auto Specialists <${process.env.MAIL_FROM}>`;

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}:`, response);
    return response;

  } catch (err) {
    console.error("❌ Resend email failed:", err);
    return { error: err.message };
  }
}

// Optional helper to send customer + owner notifications
export async function sendBookingEmails({ customerEmail, subject, html }) {
  const results = {};

  if (customerEmail) {
    results.customer = await sendMail({ to: customerEmail, subject, html });
  } else {
    console.warn("⚠️ Customer email not provided. Skipping customer email.");
  }

  if (process.env.OWNER_EMAIL) {
    const ownerHtml = `
      <h2>New Appointment Booking</h2>
      <p><strong>Customer Email:</strong> ${customerEmail || "-"}</p>
      <hr />
      <h3>Message Sent to Customer</h3>
      ${html}
    `;
    results.owner = await sendMail({
      to: process.env.OWNER_EMAIL,
      subject: `📩 New Appointment Booking`,
      html: ownerHtml,
    });
  } else {
    console.warn("⚠️ OWNER_EMAIL not set. Skipping owner notification.");
  }

  return results;
}
