const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendResetPasswordEmail = async (to, token) => {
  const resetUrl = `${process.env.BASE_URL || "http://localhost:3000"}/#/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Restablecer contraseña",
    html: `
      <h2>Solicitud de restablecimiento de contraseña</h2>
      <p>Haz clic en el siguiente botón para restablecer tu contraseña. Este enlace expira en 1 hora.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">
        Restablecer contraseña
      </a>
      <p>Si no solicitaste este cambio, ignorá este correo.</p>
      <p><small>Token: ${token}</small></p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };
