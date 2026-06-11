import QRCode from 'qrcode';

const generateQrBase64 = async (payload: any): Promise<string> => {
  const content = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return QRCode.toDataURL(content, {
    errorCorrectionLevel: 'H',
    margin: 4,
    width: 512,
  });
};

export default generateQrBase64;
