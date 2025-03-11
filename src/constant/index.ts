export const appointmentsReasons = ["Check_UP", "Revisit", "To_Meet"] as const;
export const OTP_EXPIRES_TIME = 3_600_000; // 1 HOURS

export const webName = process.env.NEXT_PUBLIC_WEB_NAME || "Mediscan";

export const OTP_HASH_NAME = "PS1";

export const appointmentStatusArr = [
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
export const userRoleArr = [...userRoleLimitedAccess, SUPER_ADMIN, "USER"] as const;
