// import nodeMailer from "nodemailer";
// import path from "path";
// import dotenv from "dotenv";
// import hbs from "nodemailer-express-handlebars";
// import { fileURLToPath } from "node:url";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const sendEmail = async (
//   subject,
//   send_to,
//   send_from,
//   reply_to,
//   template,
//   name,
//   link
// ) => {
//   const transporter = nodeMailer.createTransport({
//     service: "Gmail",
//     // host: "smtp.office365.com",
//     // port: 587,
//     secure: false,
//     auth: {
//       user: process.env.USER_EMAIL, //Your Outlook email
//       pass: process.env.EMAIL_PASS, //Your Outlook password
//     },
//   });

//   const handlebarsOptions = {
//     viewEngine: {
//       extName: ".handlebars",
//       partialsDir: path.resolve(__dirname, "../views"),
//       defaultLayout: false,
//     },
//     viewPath: path.resolve(__dirname, "../views"),
//     extName: ".handlebars",
//   };

//   transporter.use("compile", hbs(handlebarsOptions));

//   const mailOptions = {
//     from: send_from,
//     to: send_to,
//     replyTo: reply_to,
//     subject: subject,
//     template: template,
//     context: {
//       name: name,
//       link: link,
//     },
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Message sent: %s", info.messageId);
//     return info;
//   } catch (error) {
//     console.log("Error sending email: ", error);
//     throw error;
//   }
// };

// export default sendEmail;





import nodeMailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async (
  subject,
  send_to,
  send_from,
  reply_to,
  template,
  name,
  link
) => {
  // Create a transporter for Gmail
  const transporter = nodeMailer.createTransport({
    service: "Gmail", // Using Gmail as the email service
    auth: {
      user: process.env.USER_EMAIL, // Your Gmail email
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  // Configure handlebars for email templates
  const handlebarsOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve(__dirname, "../views"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "../views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarsOptions));

  // Configure mail options
  const mailOptions = {
    from: send_from, // Sender email
    to: send_to, // Recipient email
    replyTo: reply_to, // Reply-to email
    subject: subject, // Email subject
    template: template, // Handlebars template name
    context: {
      name: name, // Variables for handlebars template
      link: link,
    },
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

export default sendEmail;
