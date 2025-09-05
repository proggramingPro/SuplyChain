const nodemailer = require("nodemailer");

// ⚠️ Replace with your Gmail + App Password (not normal Gmail password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ranjit.pawar2005@gmail.com",     // your Gmail
    pass: "yehp robc zlym ipju",            // your Gmail App Password
  },
});

async function sendEmail(to, otp) {
  const mailOptions = {
    from: "ranjit.pawar2005@gmail.com",    // must match auth.user
    to,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
    // ✅ If you want HTML too:
    // html: `<h2>Your OTP is: <b>${otp}</b></h2>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    throw error; // rethrow so your signup route catches it
  }
}

module.exports = sendEmail;
