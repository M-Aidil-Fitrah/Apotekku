import Midtrans from 'midtrans-client';
import crypto from 'crypto';

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
const clientKey = process.env.MIDTRANS_CLIENT_KEY || '';

export const snap = new Midtrans.Snap({ isProduction, serverKey, clientKey });
export const core = new Midtrans.CoreApi({ isProduction, serverKey, clientKey });

export const createSnapTransaction = async (payload: any) => {
  return snap.createTransaction(payload);
};

export const verifyMidtransSignature = (
  orderId: string,
  statusCode: string,
  grossAmount: string | number,
  signatureKey: string
) => {
  const data = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const expected = crypto.createHash('sha512').update(data).digest('hex');
  return expected === signatureKey;
};

export default { snap, core, createSnapTransaction, verifyMidtransSignature };
