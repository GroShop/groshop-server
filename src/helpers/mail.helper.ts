import nodemailer from "nodemailer";

const Mail = (from: string, to: string, subject: string, text: string, html: any) => {
  const promise = new Promise((resolve, reject) => {
    // Send Mail
    nodemailer.createTestAccount((err, account) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'emie78@ethereal.email',
            pass: '7fqTtk3w2n9R5ytsKF'
        }
    });

      // setup email data with unicode symbols
      let mailOptions = {
        from: "<donotreply@gmail.com>", // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(false);
          return;
        }
        console.log(info);
        resolve(true);
      });
    });
  });
  return promise;
};

export default Mail;
