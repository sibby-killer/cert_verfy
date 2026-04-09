import QRCode from 'qrcode';

export const qrcodeService = {
  /**
   * Generates a QR code for a certificate security number
   * @param {string} securityNumber 
   * @returns {Promise<{base64: string, dataUrl: string}>}
   */
  async generateQR(securityNumber) {
    const url = `https://verify.bungomapoly.ac.ke/verify?cert=${securityNumber}`;
    
    const options = {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2,
      color: {
        dark: '#1B3A6B',
        light: '#FFFFFF',
      },
    };

    const dataUrl = await QRCode.toDataURL(url, options);
    const base64 = dataUrl.split(',')[1];

    // TODO Phase 2: Also save PNG to school server storage if persistence is required
    
    return {
      base64,
      dataUrl
    };
  }
};
