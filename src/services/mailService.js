import { createTransport } from "nodemailer";

class MailService {

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: `"LawyerHub" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Активация аккаунта на LawyerHub',
      text: `Для активации аккаунта перейдите по ссылке: ${link}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50;">Добро пожаловать на LawyerHub!</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
          <p style="margin-bottom: 20px;">Для завершения регистрации подтвердите ваш email:</p>
          <a href="${link}" 
            style="display: inline-block; padding: 12px 24px; background-color: #3498db; 
                    color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Активировать аккаунт
          </a>
        </div>
        
        <div style="text-align: center; color: #7f8c8d; font-size: 14px;">
          <p>Если вы не регистрировались на нашем сервисе, проигнорируйте это письмо.</p>
          <p>© ${new Date().getFullYear()} LawyerHub</p>
        </div>
      </div>
    `
    });
  }

  async sendPasswordResetEmail(to, resetLink) {
    const mailOptions = {
      from: `"LawyerHub" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Сброс пароля в LawyerHub',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 10px;">Сброс пароля</h1>
          <p style="color: #7f8c8d; font-size: 16px;">Вы запросили восстановление доступа к LawyerHub</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 5px; margin-bottom: 30px; text-align: center;">
          <p style="margin-bottom: 20px; font-size: 16px; color: #34495e;">
            Для установки нового пароля нажмите на кнопку ниже:
          </p>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 12px 30px; background-color: #3498db; 
                    color: white; text-decoration: none; border-radius: 4px; font-weight: bold;
                    font-size: 16px; margin: 15px 0;">
            Сбросить пароль
          </a>
          <p style="font-size: 14px; color: #7f8c8d; margin-top: 20px;">
            Ссылка действительна в течение 1 часа.
          </p>
        </div>
        
        <div style="text-align: center; color: #7f8c8d; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
          <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
          <p style="margin-top: 20px;">© ${new Date().getFullYear()} LawyerHub. Все права защищены.</p>
        </div>
      </div>
    `
    };
    await this.transporter.sendMail(mailOptions);
  }
}

export default new MailService();