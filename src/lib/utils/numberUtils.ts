import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Preprocess phone number to handle leading zeros and ensure correct country code.
 * @param {string} phoneNumber - The raw phone number input.
 * @param {string} countryCode - The country code (e.g., '+91' for India).
 * @returns {string} - The preprocessed phone number or an empty string if invalid.
 */
const preprocessPhoneNumber = (
  phoneNumber: string,
  countryCode: string,
): string => {
  if (!phoneNumber.startsWith("+")) {
    const sanitizedNumber = phoneNumber.replace(/^0+/, ""); // Remove leading zeros
    if (sanitizedNumber.length === 10) {
      return `${countryCode}${sanitizedNumber}`;
    }
    return ""; // Invalid local number
  }
  return phoneNumber; // Return as-is if already in E.164 format
};

/**
 * Normalize a phone number to E.164 format.
 * @param {string} phoneNumber - The phone number input.
 * @param {CountryCode} defaultCountry - The default country for parsing (e.g., 'IN' for India).
 * @returns {string | null} - The normalized phone number in E.164 format, or null if invalid.
 */
export const normalizePhoneNumber = (
  phoneNumber: string,
  defaultCountry: CountryCode = "IN",
): string | null => {
  try {
    const countryCode = "+91"; // Customize this based on the country
    const preprocessedNumber = preprocessPhoneNumber(phoneNumber, countryCode);

    if (!preprocessedNumber) {
      return null;
    }

    const phone = parsePhoneNumberFromString(
      preprocessedNumber,
      defaultCountry,
    );

    if (phone && phone.isValid() && phone.country === defaultCountry) {
      return phone.number; // Returns in E.164 format
    }

    return null; // Invalid phone number
  } catch (error) {
    console.error("Error normalizing phone number:", error);
    return null;
  }
};
