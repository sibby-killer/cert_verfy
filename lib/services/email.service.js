import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export const emailService = {
  /**
   * Sends a certificate notification email to a student
   */
  async sendCertificateEmail(studentEmail, data) {
    const {
      studentName,
      courseName,
      level,
      graduationYear,
      securityNumber,
      qrCodeBase64,
      verifyUrl
    } = data;

    const mailOptions = {
      from: `"Bungoma National Polytechnic" <${GMAIL_USER}>`,
      to: studentEmail,
      subject: 'Your Bungoma National Polytechnic Certificate is Ready',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1B3A6B; padding: 20px; text-align: center;">
            <h1 style="color: #C9A84C; margin: 0;">Bungoma National Polytechnic</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #1B3A6B;">Congratulations, ${studentName}!</h2>
            <p style="font-size: 16px; color: #4a5568; line-height: 1.5;">
              Your official certificate for the <strong>${level} in ${courseName}</strong> (${graduationYear}) has been officially issued.
            </p>
            
            <div style="margin: 30px 0; padding: 20px; border: 2px dashed #C9A84C; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #718096; text-transform: uppercase; letter-spacing: 1px;">Security Number</p>
              <p style="margin: 10px 0 0; font-family: monospace; font-size: 20px; font-weight: bold; color: #1B3A6B;">${securityNumber}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <img src="cid:qrcode" alt="Certificate QR Code" style="width: 200px; height: 200px;" />
              <p style="font-size: 14px; color: #718096;">Scan this QR code to verify authenticity</p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="${verifyUrl}" style="background-color: #1B3A6B; color: #C9A84C; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify My Certificate</a>
            </div>

            <p style="margin-top: 40px; font-size: 14px; color: #718096;">
              Please share your security number with employers to allow them to verify your certificate on our official portal.
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #e2e8f0;">
            <p>Official BNP Certificate Verification Portal</p>
            <p>Bungoma, Kenya | registrar@bungomapoly.ac.ke</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrCodeBase64,
          encoding: 'base64',
          cid: 'qrcode'
        }
      ]
    };

    return await transporter.sendMail(mailOptions);
  }
};
