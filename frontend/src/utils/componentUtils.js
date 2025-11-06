export const processPaymentResponse = (response) => {
  if (!response) return null;
  return response.application || response;
};

export const filterPendingPayments = (applications) => {
  if (!applications || !Array.isArray(applications)) return [];
  return applications.filter(app => app.status === 'pending');
};

export const getTopPayments = (payments, limit = 5) => {
  if (!payments || !Array.isArray(payments)) return [];
  return payments.slice(0, limit);
};

export const validatePaymentId = (paymentId) => {
  if (!paymentId) return false;
  return paymentId.trim().length > 0;
};

export const formatPaymentDisplay = (payment) => {
  if (!payment) return 'N/A';
  const currency = payment.currency || 'USD';
  const amount = payment.amount || 0;
  const recipientName = payment.recipientName || 'N/A';
  return `${currency} ${amount} from ${recipientName}`;
};

