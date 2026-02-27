/**
 * Email Service
 *
 * - Central place for all email types
 * - Each function = one email use-case
 */

const { sendMail } = require('../utils/mailer'); // import sendMail from mailer utility

/**
 * Generic Email Sender
 */
const sendEmail = async ({ to, subject, html, text }) => {
  return sendMail({ to, subject, html, text });
};


/**
 * Welcome Email – E-commerce Account Creation
 */
/**
 * Welcome Email – JAYS Online Store
 */
const sendWelcomeEmail = async ({ email, fullname }) => {
  const year = new Date().getFullYear();

  return sendEmail({
    to: email,
    subject: 'Welcome to JAYS Online Store 🛍️',
    text: `Hi ${fullname}, your JAYS Online Store account has been created successfully. Start shopping now!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Welcome to JAYS</title>
</head>
<body style="margin:0; padding:0; background-color:#d5d7d7; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 10px;">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding:20px 0;">
              <img src="https://jaysltd.mtgapps.in/assets/images/logo/logo-png3.png"
                   alt="JAYS Online Store"
                   width="150"
                   style="display:block; border:0;" />
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background:#1d799b; padding:15px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">
                Welcome to JAYS
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:25px; color:#333333;">
              <h2 style="margin-top:0;">Hi <strong>${fullname}!</strong></h2>

              <p style="font-size:15px; line-height:1.6;">
                Welcome to JAYS Online Store — your one-stop shop for quality products and great deals.
                Your account has been successfully created, and we’re excited to have you with us!
              </p>

              <p style="font-size:14px;">
                <strong>Email:</strong> ${email}
              </p>

              <!-- CTA -->
              <div style="text-align:center; margin:30px 0;">
                <a href="https://jaysltd.mtgapps.in"
                   style="background:#1d799b; color:#ffffff; text-decoration:none;
                          padding:12px 28px; border-radius:6px;
                          font-size:18px; display:inline-block;">
                  Shop Now
                </a>
              </div>

              <p style="font-size:14px; margin:0;">
                Enjoy your shopping experience! 😊<br/>
                <strong>Team JAYS</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#c3efff; padding:15px; text-align:center;
                       font-size:12px; color:#0f0e0e;">
              © ${year} JAYS Online Store · All rights reserved
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  });
};


/**
 * Order Confirmation Email
 */
const sendOrderEmail = async ({
  email,
  fullname,
  order_id,
  order_date,
  payment_mode
}) => {
  const year = new Date().getFullYear();

  return sendEmail({
    to: email,
    subject: `Order Confirmation #${order_id} – JAYS Online Store`,
    text: `Hi ${fullname}, your order ${order_id} has been placed successfully.`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmation - JAYS Online Store</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body style="margin:0; padding:0; background-color:#dfdfdf; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 12px;">

        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:22px 0;">
              <img src="https://jaysltd.mtgapps.in/assets/images/logo/logo-png3.png"
                   alt="JAYS Online Store"
                   width="150"
                   style="display:block; border:0;" />
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="background:#1d799b; padding:16px;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">
                Order Confirmed 🎉
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:26px 24px; color:#333333;">

              <h2 style="margin:0 0 10px 0; font-size:20px;">
                Hi ${fullname},
              </h2>

              <p style="margin:0 0 18px 0; font-size:15px; line-height:1.6;">
                Thank you for shopping with <strong>JAYS Online Store</strong>!
                Your order has been successfully placed. Here are your order details:
              </p>

              <!-- Order Details -->
              <h3 style="font-size:16px; margin-bottom:8px;">Order Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; margin-bottom:16px;">
                <tr>
                  <td><strong>Order ID:</strong></td>
                  <td align="right">#${order_id}</td>
                </tr>
                <tr>
                  <td><strong>Order Date:</strong></td>
                  <td align="right">${order_date}</td>
                </tr>
                <tr>
                  <td><strong>Payment Mode:</strong></td>
                  <td align="right">${payment_mode}</td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center; margin:30px 0;">
                <a href="https://jaysltd.mtgapps.in/order/${order_id}"
                   style="background:#1d799b;
                          color:#ffffff;
                          text-decoration:none;
                          padding:14px 30px;
                          border-radius:6px;
                          font-size:18px;
                          display:inline-block;">
                  View Your Order
                </a>
              </div>

              <p style="font-size:14px; margin:0;">
                We’ll notify you once your order is shipped 🚚<br/>
                <strong>Team JAYS</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
                style="background:#c3efff; padding:14px; font-size:12px; color:#0f0e0e;">
              © ${year} JAYS Online Store · All rights reserved
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `
  });
};

/**
 * OTP Email
 */
const sendOtpEmail = async ({ email, otp }) => {
  return sendEmail({
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
    html: `<h2>Your OTP: ${otp}</h2>`
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderEmail,
  sendOtpEmail
};
