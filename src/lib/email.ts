// You'll need to install a package like nodemailer
// npm install nodemailer
import nodemailer from 'nodemailer';

// Configure your email transport
const transporter = nodemailer.createTransport({
  host: import.meta.env.VITE_EMAIL_HOST || 'smtp.example.com',  
  port: parseInt(import.meta.env.VITE_EMAIL_PORT || '465'),  
  secure: import.meta.env.VITE_EMAIL_SECURE === 'true',    
  auth: {
    user: import.meta.env.VITE_EMAIL_USER,
    pass: import.meta.env.VITE_EMAIL_PASSWORD
  }
});

/**
 * Sends a password reset email to the user
 */
export async function sendResetEmail(email: string, token: string): Promise<void> {
  try {
    console.log('Sending password reset email to:', email);

    const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
    // const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;
    const resetUrl = `${baseUrl}/auth/reset-password/reset?token=${token}`;
    
    const mailOptions = {
      from: import.meta.env.VITE_EMAIL_FROM || '"Cineclub Casa Vieja" <noreply@sebastiangonzalez.co>',
      to: email,
      subject: 'Restablece tu contraseña - Cineclub Casa Vieja',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Restablece tu contraseña</h2>
          <p>Has solicitado restablecer tu contraseña para tu cuenta en Cineclub Casa Vieja.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <p>
            <a 
              href="${resetUrl}" 
              style="display: inline-block; padding: 10px 20px; background-color: #4A5568; color: white; text-decoration: none; border-radius: 5px;"
            >
              Restablecer contraseña
            </a>
          </p>
          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
          <p>Saludos,<br>Equipo de Cineclub Casa Vieja</p>
        </div>
      `
    };
    console.log('Email options:', mailOptions);

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}