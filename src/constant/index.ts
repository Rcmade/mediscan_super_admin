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
// export const paymentMethodsArr = ["ONLINE", "CASH"] as const;
export const paymentMethodsArr = ["ONLINE", "CASH"] as const;

export const paymentStatusArr = ["PENDING", "COMPLETED", "FAILED"] as const;

export const businessTypeArr = [
  "llp",
  "ngo",
  "individual",
  "partnership",
  "proprietorship",
  "public_limited",
  "private_limited",
  "trust",
  "society",
  "not_yet_registered",
  "educational_institutes",
  "other",
] as const;
export const businessTypeObj: {
  [key in (typeof businessTypeArr)[number]]: {
    name: string;
  };
} = {
  llp: {
    name: "Limited Liability Partnership",
  },
  ngo: {
    name: "Non-Governmental Organization",
  },
  individual: {
    name: "Individual",
  },
  partnership: {
    name: "Partnership",
  },
  proprietorship: {
    name: "Proprietorship",
  },
  public_limited: {
    name: "Public Limited Company",
  },
  private_limited: {
    name: "Private Limited Company",
  },
  trust: {
    name: "Trust",
  },
  society: {
    name: "Society",
  },
  not_yet_registered: {
    name: "Not Yet Registered",
  },
  educational_institutes: {
    name: "Educational Institutes",
  },
  other: {
    name: "Other",
  },
} as const;

export const orgBusinessCategoryArr = ["healthcare", "government"] as const;

export const panRegex = /^[A-Z]{3}[CHFABTJGEL]{1}[A-Z]{1}\d{4}[A-Z]{1}$/;
export const gstRegex =
  /^[0123][0-9][A-Z]{5}[0-9]{4}[A-Z][0-9][A-Z0-9][A-Z0-9]$/i;

export const countryArr = ["IN"] as const;

export const strTrueFalse = ["true", "false"] as const;