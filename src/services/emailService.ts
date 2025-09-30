// Core
import crypto from "crypto";
import nodemailer from "nodemailer";
import Mailgun from "mailgun.js";
import FormData from "form-data";

// Custom

// const mailgun = new Mailgun(FormData);
// const mg = mailgun.client({
//     username: "api",
//     key: process.env.MAILGUN_API_KEY!,
// });

// temporarty will replace with production code
export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
    console.log(`Password reset email to: ${to}`);
    console.log(`Reset link: ${resetLink}`);
};
