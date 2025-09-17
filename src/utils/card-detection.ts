// Card detection utility
export interface CardDetectionResult {
  type: string | null;
  logoPath: string | null;
}

export const detectCardType = (cardNumber: string): CardDetectionResult => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (cleanNumber.startsWith('4')) {
    return { type: 'visa', logoPath: '/assets/logos/visa.svg' };
  }
  if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) {
    return { type: 'mastercard', logoPath: '/assets/logos/mastercard.svg' };
  }
  if (cleanNumber.startsWith('3')) {
    return { type: 'amex', logoPath: '/assets/logos/amex.svg' };
  }
  if (cleanNumber.startsWith('6')) {
    return { type: 'discover', logoPath: '/assets/logos/discover.svg' };
  }
  
  return { type: null, logoPath: null };
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