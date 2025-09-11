/**
 * Credit Card Type Detection and Validation Utility
 * Detects card provider based on card number patterns and validates card details
 */

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | null;

export interface CardDetectionResult {
  type: CardType;
  logoPath: string | null;
  expectedCVCLength?: number;
  expectedLength?: number;
}

export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

/**
 * Detects the credit card type based on the card number
 * @param cardNumber - The credit card number (can include spaces/dashes)
 * @returns CardDetectionResult with type, logo path, and expected format details
 */
export function detectCardType(cardNumber: string): CardDetectionResult {
  // Remove all non-digit characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Return null for empty or very short numbers
  if (cleanNumber.length < 4) {
    return { type: null, logoPath: null };
  }

  // Card type detection patterns with their specific properties
  const cardTypes = {
    visa: {
      pattern: /^4/,                      // Visa: starts with 4
      expectedLength: 16,
      expectedCVCLength: 3
    },
    mastercard: {
      pattern: /^5[1-5]|^2[2-7]/,        // Mastercard: 51-55 or 22-27
      expectedLength: 16,
      expectedCVCLength: 3
    },
    amex: {
      pattern: /^3[47]/,                 // American Express: 34 or 37
      expectedLength: 15,
      expectedCVCLength: 4
    },
    discover: {
      pattern: /^6(?:011|5)/,            // Discover: 6011 or 65
      expectedLength: 16,
      expectedCVCLength: 3
    }
  };

  // Check each pattern
  for (const [cardType, details] of Object.entries(cardTypes)) {
    if (details.pattern.test(cleanNumber)) {
      return {
        type: cardType as CardType,
        logoPath: `/assets/logos/${cardType}.png`,
        expectedCVCLength: details.expectedCVCLength,
        expectedLength: details.expectedLength
      };
    }
  }

  // No match found
  return { type: null, logoPath: null };
}

/**
 * Formats card number with spaces for better readability
 * @param cardNumber - Raw card number
 * @returns Formatted card number with spaces
 */
export function formatCardNumber(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // American Express: XXXX XXXXXX XXXXX (4-6-5 format)
  if (cleanNumber.match(/^3[47]/)) {
    // Handle partial Amex numbers during typing
    if (cleanNumber.length <= 4) {
      return cleanNumber;
    } else if (cleanNumber.length <= 10) {
      return `${cleanNumber.substring(0, 4)} ${cleanNumber.substring(4)}`;
    } else {
      return `${cleanNumber.substring(0, 4)} ${cleanNumber.substring(4, 10)} ${cleanNumber.substring(10, 15)}`;
    }
  }
  
  // Other cards: XXXX XXXX XXXX XXXX (4-4-4-4 format)
  return cleanNumber.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Validates card number using Luhn algorithm
 * @param cardNumber - The credit card number
 * @returns boolean indicating if the card number is valid
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Validates expiry date format and checks if the card is expired
 * @param expiryDate - The expiry date in MM/YY format
 * @returns boolean indicating if the expiry date is valid and not expired
 */
export function validateExpiryDate(expiryDate: string): boolean {
  // Check format
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return false;
  }
  
  const [monthStr, yearStr] = expiryDate.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10) + 2000; // Convert YY to 20YY
  
  // Check month range
  if (month < 1 || month > 12) {
    return false;
  }
  
  // Check if expired
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
  const currentYear = today.getFullYear();
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
}

/**
 * Validates CVV/CVC code based on card type
 * @param cvv - The CVV/CVC code
 * @param cardType - The detected card type
 * @returns boolean indicating if the CVV/CVC is valid
 */
export function validateCVV(cvv: string, cardType: CardType): boolean {
  if (!cvv || !/^\d+$/.test(cvv)) {
    return false;
  }
  
  // American Express requires 4-digit CVC
  if (cardType === 'amex') {
    return cvv.length === 4;
  }
  
  // Other cards use 3-digit CVV
  return cvv.length === 3;
}

/**
 * Validates all card details
 * @param card - The card details to validate
 * @returns CardValidationResult with validation status and error messages
 */
export function validateCardDetails(card: CardDetails): CardValidationResult {
  const result: CardValidationResult = {
    isValid: true,
    errors: []
  };
  
  // Clean card number
  const cleanCardNumber = card.cardNumber.replace(/\D/g, '');
  
  // Detect card type
  const cardDetection = detectCardType(cleanCardNumber);
  
  // Validate card number
  if (!validateCardNumber(cleanCardNumber)) {
    result.isValid = false;
    result.errors.push('Invalid card number');
  }
  
  // Validate card number length based on card type
  if (cardDetection.type && cardDetection.expectedLength) {
    if (cleanCardNumber.length !== cardDetection.expectedLength) {
      result.isValid = false;
      result.errors.push(`${cardDetection.type.charAt(0).toUpperCase() + cardDetection.type.slice(1)} card should have ${cardDetection.expectedLength} digits`);
    }
  }
  
  // Validate expiry date
  if (!validateExpiryDate(card.expiryDate)) {
    result.isValid = false;
    result.errors.push('Invalid or expired card date');
  }
  
  // Validate CVV
  if (!validateCVV(card.cvv, cardDetection.type)) {
    result.isValid = false;
    if (cardDetection.type === 'amex') {
      result.errors.push('American Express cards require a 4-digit CVC');
    } else {
      result.errors.push('Invalid CVV/CVC code');
    }
  }
  
  // Validate cardholder name
  if (!card.cardholderName || card.cardholderName.trim().length < 3) {
    result.isValid = false;
    result.errors.push('Please enter the cardholder name');
  }
  
  return result;
}
