export type Payment = {
  id: number;
  method: PaymentMethod;
};

export type PaymentMethod = 'BLIK' | 'Transfer' | 'Visa/Mastercard';
