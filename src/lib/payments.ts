import crypto from "crypto";
import axios from "axios";

export function easypaisaInit(amount: number, orderId: string, returnUrl: string) {
  const post: any = {
    amount: amount.toFixed(2),
    orderRefNum: orderId,
    storeId: process.env.EASYPAISA_STORE_ID!,
    autoRedirect: "1",
    paymentMethod: "MA",
    returnUrl,
  };
  const sorted = Object.keys(post).sort().map((k) => `${k}=${post[k]}`).join("&");
  const hash = crypto.createHmac("sha256", process.env.EASYPAISA_HASH_KEY!).update(sorted).digest("base64");
  return { ...post, merchantHashedReq: hash, postUrl: "https://easypay.easypaisa.com.pk/easypay/Index.jsf" };
}

export function jazzcashInit(amount: number, orderId: string, returnUrl: string) {
  const now = new Date();
  const pp_TxnDateTime = now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const pp_TxnExpiryDateTime = new Date(now.getTime() + 3600e3).toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const fields: Record<string, string> = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID!,
    pp_Password: process.env.JAZZCASH_PASSWORD!,
    pp_BankID: "TBANK",
    pp_ProductID: "RETL",
    pp_TxnRefNo: `T${Date.now()}`,
    pp_Amount: (amount * 100).toString(),
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime,
    pp_BillReference: orderId,
    pp_Description: "CarBazar Premium Ad",
    pp_TxnExpiryDateTime,
    pp_ReturnURL: returnUrl,
  };
  const sorted = Object.keys(fields).sort().map((k) => `${k}=${fields[k]}`).join("&");
  const pp_SecureHash = crypto.createHmac("sha256", process.env.JAZZCASH_INTEGRITY_SALT!).update(sorted).digest("hex").toUpperCase();
  return { ...fields, pp_SecureHash, postUrl: "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/" };
}

export async function nayapayInit(amount: number, orderId: string, returnUrl: string) {
  const res = await axios.post("https://api.nayapay.com/v1/checkout/orders", {
    amount: amount * 100,
    currency: "PKR",
    merchantId: process.env.NAYAPAY_MERCHANT_ID!,
    reference: orderId,
    returnUrl,
  }, { headers: { Authorization: `Bearer ${process.env.NAYAPAY_API_KEY}` } });
  return { postUrl: res.data.checkoutUrl, token: res.data.token };
}
