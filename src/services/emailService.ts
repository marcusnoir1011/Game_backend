// Core
import crypto from "crypto";
import nodemailer from "nodemailer";
import Mailgun from "mailgun.js";
import FormData from "form-data";

// Custom
import { setVerificationToken } from "../models/user.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
});

export const sendVerificationEmail = async (userId: number, email: string) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await setVerificationToken(userId, token, expiresAt.toISOString());

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${userId}`;

    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
        from: `Game <no-reply@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: "Verify your email",
        html: `
            <p>Hello,</p>
            <p>Please verify your email by clicking the link below: </p>
            <a href="${verificationLink}">Verify Email</a>
            <p>This link expires in 24 hours.</p>
        `,
    });
};
