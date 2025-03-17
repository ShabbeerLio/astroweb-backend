const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // or any other email provider
  auth: {
    user: "digitaldizire25@gmail.com",
    pass: "Hello@143aqw", // Use App Password if Gmail
  },
});

const sendSubscriptionAlert = (email, name, plan, daysLeft) => {
  const mailOptions = {
    from: '"Your Company" digitaldizire25@gmail.com',
    to: email,
    subject: "Subscription Ending Soon!",
    html: `<p>Hi ${name},</p>
           <p>Your <b>${plan}</b> subscription is ending in <b>${daysLeft} day(s)</b>.</p>
           <p>Please renew to continue enjoying our services!</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Error sending to ${email}:`, error);
    } else {
      console.log(`Email sent to ${email}:`, info.response);
    }
  });
};

module.exports = sendSubscriptionAlert;