import { Types } from "mongoose";

export const EMAIL = {
  SENDER_EMAIL: "kishore@brownbutton.io",
  SENDER_NAME: "Brownbutton",
  CONFIRM_EMAIL_SUBJECT: "Livyana | Confirm Your Account",
};

export const EMAIL_TEMPLATES = {
  forgotPassword: (id: Types.ObjectId) => {
    return `<h4>Please click here to reset your password</h4>
    <a href="${process.env.DOMAIN}/reset_password/${id}">Reset Password</a>;`;
  },
  sendOtp: (name: string, otp: string) => {
    return `<p>Hi ${name}</p><p>We are verifying your account for secure login. Please use the following OTP code to complete the verification process:.</p></p></p><p><p>OTP: ${otp}</p></p></p>`;
  },
  welcomeEmail: async (name: string) => {
    let html = `
        <p>Hi ${name},</p>
        <p>All done! Your Livyana setup is done now.</p>
      `;
    return html;
  },

  confirmEmail: (name: string, id: Types.ObjectId) => {
    let html = `
      Hi ${name},
      <br/>
      <br/>
      You’re almost ready to start using Livyana.
      <br/>
      <br/>
      Simply click the link below to verify your email address.
      <br/>
      <br/>
      <a href="${process.env.DOMAIN}/confirm_email/${id}">Confirm Account</a>
      <br/>
      <br/>
      <br/>
      Thanks,
      <br/>
      Livyana Team
      `;
    return html;
  },
};
