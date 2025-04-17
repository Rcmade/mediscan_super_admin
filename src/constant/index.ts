export const appointmentsReasons = ["Check_UP", "Revisit", "To_Meet"] as const;
export const OTP_EXPIRES_TIME = 3_600_000; // 1 HOURS

export const webName = process.env.NEXT_PUBLIC_WEB_NAME || "Mediscan";

export const OTP_HASH_NAME = "PS1";

export const APPOINTMENT_ID_HASH_NAME = "PS2";

export const appointmentStatusArr = [
  "Pending",
  "Scheduled",
  "Completed",
  "Cancelled",
] as const;

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

export const CLOUDINARY_REGEX =
  /^.+\.cloudinary\.com\/(?:[^\/]+\/)(?:(image|video|raw)\/)?(?:(upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)\/)?(?:(?:[^_/]+_[^,/]+,?)*\/)?(?:v(\d+|\w{1,2})\/)?([^\.^\s]+)(?:\.(.+))?$/;

export const revisitScheduleHeaderName = "x-revisit-schedule";

export const userRoleLimitedAccess = ["RECEPTIONIST", "ADMIN"] as const;
export const SUPER_ADMIN = "SUPER_ADMIN" as const;
export const userRoleArr = [
  ...userRoleLimitedAccess,
  SUPER_ADMIN,
  "USER",
] as const;

// Do not change the order of this array, and do not change it will also change the database schema
export const paymentMethodsArr = ["ONLINE", "CASH"] as const;

export const paymentStatusArr = ["PENDING", "COMPLETED", "FAILED"] as const;
