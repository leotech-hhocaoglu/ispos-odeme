import { apiRequest } from './api';
import type { PaymentRequest, PaymentResponse } from '../types/payment';

export const paymentService = {
  createPayment(request: PaymentRequest) {
    return apiRequest<PaymentResponse>('/payments', {
      method: 'POST',
      body: request,
    });
  },

  getPayment(paymentId: string) {
    return apiRequest<PaymentResponse>(`/payments/${paymentId}`);
  },
};
