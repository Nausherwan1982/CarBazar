import axios from "axios";

export async function sendWhatsAppOtp(toPhone: string, code: string) {
  const API = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
  return axios.post(API, {
    messaging_product: "whatsapp",
    to: toPhone,
    type: "template",
    template: {
      name: "otp_verification",
      language: { code: "en" },
      components: [{ type: "body", parameters: [{ type: "text", text: code }] }],
    },
  }, { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } });
}

export function businessWhatsappLink(text = "Hi CarBazar") {
  return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
