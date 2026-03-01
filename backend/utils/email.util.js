import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `Cypher Cloud ${process.env.MAIL_USERNAME}`,
    to: to,
    subject: subject,
    html: html,
  });
};
