const { Resend } = require("resend");

let resend;

const isEmailConfigured = () =>
  Boolean(
    process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY.startsWith("re_") &&
    process.env.EMAIL_FROM &&
    process.env.EMAIL_FROM.includes("@")
  );

const getClient = () => {
  if (!isEmailConfigured()) {
    throw new Error("Resend is not configured. Add RESEND_API_KEY and EMAIL_FROM.");
  }
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
};

const sendMail = async ({ to, subject, html, text, replyTo }) => {
  const { data, error } = await getClient().emails.send({
    from: process.env.EMAIL_FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    replyTo,
  });
  if (error) {
    throw new Error(error.message || "Resend rejected the email");
  }
  console.log(`Resend email accepted: ${data.id}`);
  return data;
};

module.exports = sendMail;
module.exports.isEmailConfigured = isEmailConfigured;
