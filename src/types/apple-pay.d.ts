// Apple Pay Web API Type Declarations

declare global {
  interface Window {
    ApplePaySession?: typeof ApplePaySession;
  }
}

declare class ApplePaySession {
  static readonly STATUS_SUCCESS: number;
  static readonly STATUS_FAILURE: number;
  static readonly STATUS_INVALID_BILLING_POSTAL_ADDRESS: number;
  static readonly STATUS_INVALID_SHIPPING_POSTAL_ADDRESS: number;
  static readonly STATUS_INVALID_SHIPPING_CONTACT: number;
  static readonly STATUS_PIN_REQUIRED: number;
  static readonly STATUS_PIN_INCORRECT: number;
  static readonly STATUS_PIN_LOCKOUT: number;

  static canMakePayments(): boolean;
  static canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean>;
  static openPaymentSetup(merchantIdentifier: string): Promise<boolean>;
  static supportsVersion(version: number): boolean;

  constructor(version: number, paymentRequest: ApplePayJS.ApplePayPaymentRequest);

  onvalidatemerchant: (event: ApplePayJS.ApplePayValidateMerchantEvent) => void;
  onpaymentmethodselected: (event: ApplePayJS.ApplePayPaymentMethodSelectedEvent) => void;
  onshippingmethodselected: (event: ApplePayJS.ApplePayShippingMethodSelectedEvent) => void;
  onshippingcontactselected: (event: ApplePayJS.ApplePayShippingContactSelectedEvent) => void;
  onpaymentauthorized: (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => void;
  oncancel: (event: Event) => void;

  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: any): void;
  completePayment(status: number): void;
  completePaymentMethodSelection(update: ApplePayJS.ApplePayPaymentMethodUpdate): void;
  completeShippingMethodSelection(update: ApplePayJS.ApplePayShippingMethodUpdate): void;
  completeShippingContactSelection(update: ApplePayJS.ApplePayShippingContactUpdate): void;
}

declare namespace ApplePayJS {
  interface ApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    supportedNetworks: string[];
    merchantCapabilities: string[];
    total: ApplePayLineItem;
    lineItems?: ApplePayLineItem[];
    shippingType?: string;
    shippingMethods?: ApplePayShippingMethod[];
    shippingContact?: ApplePayPaymentContact;
    billingContact?: ApplePayPaymentContact;
    applicationData?: string;
    supportedCountries?: string[];
  }

  interface ApplePayLineItem {
    label: string;
    amount: string;
    type?: string;
  }

  interface ApplePayShippingMethod {
    label: string;
    detail?: string;
    amount: string;
    identifier: string;
  }

  interface ApplePayPaymentContact {
    phoneNumber?: string;
    emailAddress?: string;
    givenName?: string;
    familyName?: string;
    phoneticGivenName?: string;
    phoneticFamilyName?: string;
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
    countryCode?: string;
  }

  interface ApplePayValidateMerchantEvent extends Event {
    validationURL: string;
  }

  interface ApplePayPaymentMethodSelectedEvent extends Event {
    paymentMethod: ApplePayPaymentMethod;
  }

  interface ApplePayShippingMethodSelectedEvent extends Event {
    shippingMethod: ApplePayShippingMethod;
  }

  interface ApplePayShippingContactSelectedEvent extends Event {
    shippingContact: ApplePayPaymentContact;
  }

  interface ApplePayPaymentAuthorizedEvent extends Event {
    payment: ApplePayPayment;
  }

  interface ApplePayPayment {
    token: ApplePayPaymentToken;
    billingContact?: ApplePayPaymentContact;
    shippingContact?: ApplePayPaymentContact;
  }

  interface ApplePayPaymentToken {
    paymentMethod: ApplePayPaymentMethod;
    transactionIdentifier: string;
    paymentData: any;
  }

  interface ApplePayPaymentMethod {
    displayName: string;
    network: string;
    type: string;
  }

  interface ApplePayPaymentMethodUpdate {
    newTotal: ApplePayLineItem;
    newLineItems?: ApplePayLineItem[];
  }

  interface ApplePayShippingMethodUpdate {
    newTotal: ApplePayLineItem;
    newLineItems?: ApplePayLineItem[];
    newShippingMethods?: ApplePayShippingMethod[];
  }

  interface ApplePayShippingContactUpdate {
    newTotal: ApplePayLineItem;
    newLineItems?: ApplePayLineItem[];
    newShippingMethods?: ApplePayShippingMethod[];
    errors?: ApplePayError[];
  }

  interface ApplePayError {
    code: string;
    contactField?: string;
    message: string;
  }
}

export {};
