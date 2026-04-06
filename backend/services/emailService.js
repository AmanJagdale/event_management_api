const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'dummy_user@ethereal.email',
    pass: 'dummy_pass'
  }
});

const sendConfirmationEmail = async (userEmail, eventTitle) => {
  try {
    /* 
      // actual sending code, commented out for dummy test:
      await transporter.sendMail({
        from: '"Event Manager" <noreply@eventmanager.com>',
        to: userEmail,
        subject: "Event Registration Confirmation",
        text: \`You have successfully registered for \${eventTitle}\`,
      });
    */
    
    // Logging the dummy email sent message
    console.log(`Confirmation Email Sent to ${userEmail} for event: ${eventTitle}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendConfirmationEmail
};
