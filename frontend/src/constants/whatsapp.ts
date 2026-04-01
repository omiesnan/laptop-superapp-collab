// WhatsApp number for orders (replace with actual number)
export const WHATSAPP_NUMBER = '6281234567890';

export const getWhatsAppUrl = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};
