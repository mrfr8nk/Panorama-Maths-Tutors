import { Paynow } from 'paynow';

const PAYNOW_INTEGRATION_ID = process.env.PAYNOW_INTEGRATION_ID || '';
const PAYNOW_INTEGRATION_KEY = process.env.PAYNOW_INTEGRATION_KEY || '';
const RESULT_URL = process.env.PAYNOW_RESULT_URL || 'http://localhost:5000/api/paynow/result';
const RETURN_URL = process.env.PAYNOW_RETURN_URL || 'http://localhost:5000/payments/return';

export function getPaynowInstance() {
  const paynow = new Paynow(PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY);
  paynow.resultUrl = RESULT_URL;
  paynow.returnUrl = RETURN_URL;
  return paynow;
}

export async function initiateMobilePayment(
  email: string,
  phone: string,
  courseName: string,
  amount: number
) {
  if (!PAYNOW_INTEGRATION_ID || !PAYNOW_INTEGRATION_KEY) {
    throw new Error('Paynow credentials not configured');
  }

  const paynow = getPaynowInstance();
  const payment = paynow.createPayment(`Course: ${courseName}`, email);
  payment.add(courseName, amount);

  const response = await paynow.sendMobile(payment, phone, 'ecocash');
  
  return {
    success: response.success,
    pollUrl: response.pollUrl,
    reference: response.reference,
    instructions: response.instructions
  };
}

export async function checkPaymentStatus(pollUrl: string) {
  const paynow = getPaynowInstance();
  const status = await paynow.pollTransaction(pollUrl);
  
  return {
    paid: status.paid,
    status: status.status,
    amount: status.amount,
    reference: status.reference
  };
}
