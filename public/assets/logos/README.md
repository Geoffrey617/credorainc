# Credit Card Provider Logos

This folder contains the credit card provider logos used in payment forms.

## Required Logo Files

Please save the following logo files in PNG format:

1. **visa.png** - Visa card logo
2. **mastercard.png** - Mastercard logo  
3. **amex.png** - American Express logo
4. **discover.png** - Discover card logo

## Logo Specifications

- **Format:** PNG with transparent background
- **Dimensions:** Recommended width 60-100px, height will auto-scale
- **Quality:** High resolution for crisp display
- **Background:** Transparent for better integration

## Usage

These logos are automatically displayed in the payment forms when users enter their card numbers:

- `/apply/submit` - Guarantor application fee payment
- `/apartment-finder/payment` - Apartment finder service payment  
- `/landlords/settings` - Landlord subscription payment modal

The logos appear in the card number input field on the right side and update in real-time as users type their card numbers.

## Card Detection

The system detects card types based on the following patterns:

- **Visa:** Starts with 4
- **Mastercard:** Starts with 5 (51-55) or 2 (22-27)
- **American Express:** Starts with 34 or 37
- **Discover:** Starts with 6011 or 65

## Fallback

If a logo file is missing or fails to load, the image will be hidden gracefully without affecting the payment form functionality.
