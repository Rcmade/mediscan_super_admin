import { OTP_EXPIRES_TIME } from "@/constant";
import { format, isToday, parseISO } from "date-fns";

export const formateTime = (date: string) => {
  return format(date, "hh:mm a");
};

export const getExpireTime = () => {
  return new Date(Date.now() + OTP_EXPIRES_TIME);
};

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "MMM d, yyyy"); // Example format: "Aug 30, 2024"
  } catch (error) {
    console.log(error);
    console.error("Invalid date string:", dateString);
    return "Invalid date";
  }
}

export const isValidDate = (value: unknown): boolean =>
  !isNaN(new Date(value as string).getTime());

export const formatDateTime = (date: Date | string): string => {
  // Combine both date and time in one string
  const formattedDateTime = format(date, "yyyy-MM-dd HH:mm");

  return formattedDateTime;
};

export const formateReadableDateTime = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "PPP 'at' p"); // e.g., "April 29, 2023 at 3:30 PM"
};

export const calendarDateFormat = (date: string | Date) => format(date, "PPP");

export function formatSearchDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "MMM d, yyyy"); // Example format: "Aug 30, 2024"
  } catch (error) {
    console.log(error);
    console.error("Invalid date string:", dateString);
    return "Invalid date";
  }
}
