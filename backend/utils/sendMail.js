import {createTransport} from 'nodemailer';

export const sendMail = async (email, subject, text) => {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });


  await transporter.sendMail({
    from: process.env.SMTP_USERNAME,
    to: email,
    subject,
    text,
  });

};