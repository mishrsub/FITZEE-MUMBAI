import { transporter } from "../services/mailer.js";
import fs from "fs/promises";

export const sendingMail = async (user, purpose,URI="") => {
  try {
    if (purpose === "CONTACT_US") {
    //     // Read the HTML content from the file
    //   htmlContent = await fs.readFile('sendEmail.html', 'utf-8');
      
    //   // Replace placeholders in the HTML with actual user data
    //   htmlContent = htmlContent.replace('[User]', user.name);

    console.log('====================================');
    console.log(user.email);
    console.log('====================================');
      await transporter.sendMail({
        from: process.env.USER, // sender address
        to: user.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<h4>Hello world?</h4>", // html body
      });
    }
    if(purpose === "FORGOT_PASS") {
      await transporter.sendMail({
        from: process.env.USER, // sender address
        to: user.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<h4>TOKEN: ${URI}</h4>`, // html body
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
