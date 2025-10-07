const { sendEmail } = require('./mailer');

// Send alert email to consumer
const sendAlertEmail = async (userEmail, userName, alertType, message, deliveryId) => {
  const subject = `Package Alert: ${alertType}`;
  const emailBody = `
    <h2>Package Alert Notification</h2>
    <p>Dear ${userName},</p>
    <p><strong>Alert Type:</strong> ${alertType}</p>
    <p><strong>Message:</strong> ${message}</p>
    <p><strong>Delivery ID:</strong> ${deliveryId}</p>
    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    <br>
    <p>Best regards,<br>Supply Chain Team</p>
  `;
  
  try {
    await sendEmail(userEmail, subject, emailBody);
    console.log(`Alert email sent to ${userEmail}`);
  } catch (error) {
    console.error('Failed to send alert email:', error);
  }
};

// Send checkpoint arrival email to consumer
const sendCheckpointEmail = async (userEmail, userName, checkpointName, driverName, estimatedArrival, deliveryId) => {
  const subject = `Driver Arriving Soon - ${checkpointName}`;
  const emailBody = `
    <h2>Driver Arrival Notification</h2>
    <p>Dear ${userName},</p>
    <p>Your driver <strong>${driverName}</strong> is approaching the checkpoint:</p>
    <p><strong>Location:</strong> ${checkpointName}</p>
    <p><strong>Estimated Arrival:</strong> ${new Date(estimatedArrival).toLocaleString()}</p>
    <p><strong>Delivery ID:</strong> ${deliveryId}</p>
    <br>
    <p>Please be ready to receive your package.</p>
    <p>Best regards,<br>Supply Chain Team</p>
  `;
  
  try {
    await sendEmail(userEmail, subject, emailBody);
    console.log(`Checkpoint email sent to ${userEmail}`);
  } catch (error) {
    console.error('Failed to send checkpoint email:', error);
  }
};

module.exports = {
  sendAlertEmail,
  sendCheckpointEmail
};