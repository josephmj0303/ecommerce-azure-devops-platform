/**
 * Mail Service (Nodemailer)
 *
 * Responsibilities:
 * - Configure SMTP transporter using environment variables
 * - Send transactional emails (order, OTP, password reset, etc.)
 * - Log success & failure events
 *
 * Used by:
 * - Order module
 * - Auth module
 * - Notification services
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger'); // import logger

/**
 * SMTP Transporter Configuration
 *
 * Environment variables required:
 * - MAIL_HOST
 * - MAIL_PORT
 * - MAIL_USERNAME
 * - MAIL_PASSWORD
 * - MAIL_FROM_NAME
 * - MAIL_FROM_ADDRESS
 *
 * Notes:
 * - secure: false → used for ports like 587
 * - For port 465 → set secure: true
 */
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * sendMail
 *
 * Purpose:
 * - Sends email using configured SMTP transporter
 *
 * @param {Object} params
 * @param {string|string[]} params.to - Recipient email(s)
 * @param {string} params.subject - Email subject
 * @param {string} [params.text] - Plain text body
 * @param {string} [params.html] - HTML body
 *
 * @returns {Promise<Object>} Nodemailer response info
 *
 * Logging:
 * - Logs success with messageId
 * - Logs error details on failure
 */
const sendMail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text,
      html
    });

    logger.info('📧 Mail sent successfully', {
      messageId: info.messageId,
      to,
      subject
    });

    return info;
  } catch (error) {
    logger.error('❌ Mail sending failed', {
      to,
      subject,
      error: error.message,
      stack: error.stack
    });

    throw error;
  }
};
module.exports = {
  transporter,
  sendMail
};
