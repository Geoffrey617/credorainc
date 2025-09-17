// Card detection utility
export const detectCardType = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (cleanNumber.startsWith('4')) return 'visa';
  if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
  if (cleanNumber.startsWith('3')) return 'amex';
  if (cleanNumber.startsWith('6')) return 'discover';
  
  return 'unknown';
};

export const formatCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  const match = cleanNumber.match(/.{1,4}/g);
  return match ? match.join(' ') : cleanNumber;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  return cleanNumber.length >= 13 && cleanNumber.length <= 19;
};