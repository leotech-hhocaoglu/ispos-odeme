export type PaymentStatus =
  | 'APPROVED'
  | 'DECLINED'
  | 'REDIRECT_REQUIRED'
  | 'PENDING'
  | 'FAILED'
  | 'UNKNOWN';

export type PaymentRequest = {
  orderReference: string;
  amount: string;
  currency: 'TRY' | 'USD' | 'EUR';
  card: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
};

export type PaymentRedirect = {
  method: 'GET' | 'POST';
  url: string;
  fields?: Record<string, string>;
};

export type PaymentResponse = {
  paymentId: string;
  orderReference: string;
  status: PaymentStatus;
  provider: 'ISPOS';
  providerTransactionId?: string;
  message?: string;
  redirect?: PaymentRedirect;
};
