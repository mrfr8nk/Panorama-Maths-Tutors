declare module 'paynow' {
  export class Paynow {
    constructor(integrationId: string, integrationKey: string);
    resultUrl: string;
    returnUrl: string;
    createPayment(reference: string, authEmail: string): Payment;
    sendMobile(payment: Payment, phone: string, method: string): Promise<InitResponse>;
    pollTransaction(pollUrl: string): Promise<StatusResponse>;
  }

  export class Payment {
    add(title: string, amount: number): void;
  }

  export interface InitResponse {
    success: boolean;
    pollUrl: string;
    reference: string;
    instructions: string;
  }

  export interface StatusResponse {
    paid: boolean;
    status: string;
    amount: number;
    reference: string;
  }
}
