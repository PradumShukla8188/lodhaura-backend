const nodemailer = require('nodemailer');
const { config } = require('../config');

let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;
    if (!config.smtp.auth.user || !config.smtp.auth.pass) {
        console.warn('SMTP credentials not configured. Email sending is disabled.');
        return null;
    }
    transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        tls: config.smtp.tls,
        auth: config.smtp.auth,
    });
    return transporter;
};

module.exports = {
    sendMail: async ({ to, subject, html, text }) => {
        const transport = getTransporter();
        if (!transport) {
            console.log('Mail stub - would send to:', to, subject);
            return { accepted: [to], stub: true };
        }
        return transport.sendMail({
            from: `"${config.env.projectName}" <${config.smtp.auth.user}>`,
            to,
            subject,
            html,
            text: text || html?.replace(/<[^>]+>/g, ''),
        });
    },

    sendPasswordResetEmail: async (to, resetToken) => {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        return module.exports.sendMail({
            to,
            subject: 'Password Reset - Lodhaura Village Portal',
            html: `<p>You requested a password reset.</p><p>Use this link: <a href="${resetUrl}">${resetUrl}</a></p><p>Token: ${resetToken}</p>`,
        });
    },
};
