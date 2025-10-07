const nodemailer = require("nodemailer");

// ⚠️ Replace with your Gmail + App Password (not normal Gmail password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

async function sendEmail(to, subject, body) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: subject || "Notification",
    html: body || subject
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

// Legacy OTP function
async function sendOTPEmail(to, otp) {
  await sendEmail(to, "Your OTP Code", `Your OTP is: ${otp}`);
}

module.exports = { sendEmail, sendOTPEmail };
