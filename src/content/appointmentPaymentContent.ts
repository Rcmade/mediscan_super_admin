export const appointmentPaymentSortByArr = [
  "createdAt",
  "updatedAt",
  "totalAmount",
] as const;
export type AppointmentPaymentSortBy =
  (typeof appointmentPaymentSortByArr)[number];

export const appointmentPaymentSortOrderArr = ["asc", "desc"] as const;
export type AppointmentPaymentSortOrder =
  (typeof appointmentPaymentSortOrderArr)[number];
