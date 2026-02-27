/**
 * Mailer Utility
 *
 * - Handles SMTP configuration
 * - Sends raw emails
 * - Reusable across entire application
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger'); // import logger

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendMail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text,
      html
    });

    logger.info('📧 Mail sent', {
      to,
      subject,
      messageId: info.messageId
    });

    return info;
  } catch (error) {
    logger.error('❌ Mail send failed', {
      to,
      subject,
      error: error.message
    });
    throw error;
  }
};
module.exports = {
  sendMail
};
