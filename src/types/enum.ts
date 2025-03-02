export enum LoginVerificationStage {
  Initial = "INITIAL",
  OTPSent = "OTP_SENT",
  OTPVerify = "OTP_VERIFY",
  OTPVerified = "OTP_VERIFIED",
  OTPExpired = "OTP_EXPIRED",
}
