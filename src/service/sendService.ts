// import { OTP_EXPIRES_TIME_IN_MIN } from "@/constants";
// import registerUserVerificationTemplate from "@/email/registerUserVerification";
// import resetPasswordEmail from "@/email/resetPasswordEmail";
// import twoFAVerification from "@/email/twoFAVerification";
// import { sendMail } from "@/lib/nodemailer";
import { normalizePhoneNumber } from "@/lib/utils/numberUtils";
import twilio from "twilio";

class SendService {
  public static async sendSMS(to: string, message: string): Promise<boolean> {
    if (process.env.OTP_SERVICE_AVAILABLE !== "true") {
      return true;
    }
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );

      const phone = normalizePhoneNumber(to);
      if (!phone) return false;
      const formateData = {
        from: process.env.TWILIO_FROM_NUMBER,
        body: message,
        to: phone,
      };

      return client.messages
        .create(formateData)
        .then(() => {
          // console.log({message});
          return true; // SMS sent successfully
        })
        .catch((error) => {
          console.error("Error sending SMS:", error);
          return false; // SMS not sent
        });
      return true; // SMS sent successfully
    } catch (error) {
      console.error("Error sending SMS:", error);
      return false; // SMS not sent
    }
  }
}

export default SendService;
