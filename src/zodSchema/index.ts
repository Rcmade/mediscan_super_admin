import { normalizePhoneNumber } from "@/lib/utils/numberUtils";
import { z } from "zod";
import { isValidDate } from "@/lib/utils/dateUtils";
import { startOfDay, endOfDay as endOfDayFn, parseISO } from "date-fns";
export const phoneSchema = z
  .string()
  .min(8)
  .max(15)
  .refine(
    (value) => {
      const normalizedNumber = normalizePhoneNumber(value);
      return normalizedNumber !== null; // Ensure the number is valid
    },
    {
      message:
        "Please enter a valid phone number with the correct country code.",
    },
  )
  .transform((value) => {
    const normalizedNumber = normalizePhoneNumber(value);
    if (normalizedNumber) {
      return normalizedNumber; // Transform to E.164 format
    }
    throw new Error("Invalid phone number format.");
  });

// Base schema for date fields with common validations
const dateFieldSchema = z
  .union([z.string(), z.date(), z.null(), z.undefined()])
  .refine((val) => !val || isValidDate(val), {
    message: "Invalid date",
  });

// Define the base shape type
export const dateRangeBaseSchema = z.object({
  startDate: dateFieldSchema.optional(),
  endDate: dateFieldSchema.optional(),
});

// Define the type for the transformed data
type DateRangeTransformed = {
  startDate: Date;
  endDate: Date;
};

// Function to add date range validations and transformations with proper typing
export const withDateRangeValidation = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends z.ZodType<any, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U extends z.infer<T> & Partial<Record<keyof DateRangeTransformed, any>>,
>(
  schema: T,
) => {
  return (
    schema
      // .superRefine((data, ctx) => {
      //   // if (data.startDate && data.endDate) {
      //   //   const startDate = new Date(data.startDate);
      //   //   const endDate = new Date(data.endDate);

      //   //   if (endDate <= startDate) {
      //   //     ctx.addIssue({
      //   //       path: ["endDate"],
      //   //       message: "End date must be greater than start date",
      //   //       code: z.ZodIssueCode.custom,
      //   //     });
      //   //   }
      //   // }
      // })
      .transform(
        (data): Omit<U, keyof DateRangeTransformed> & DateRangeTransformed => {
          return {
            ...data,
            startDate: data.startDate
              ? startOfDay(
                  typeof data.startDate === "string"
                    ? parseISO(data.startDate)
                    : new Date(data.startDate),
                )
              : startOfDay(new Date()),
            endDate: data.endDate
              ? endOfDayFn(
                  typeof data.endDate === "string"
                    ? parseISO(data.endDate)
                    : new Date(data.endDate),
                )
              : endOfDayFn(new Date()),
          }; // Cast needed due to TypeScript limitation with spread types
        },
      )
  );
};

export const validateDateRange = (input: DateRangeTransformed) => {
  const schema = dateRangeBaseSchema
    .superRefine((data, ctx) => {
      if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (endDate <= startDate) {
          ctx.addIssue({
            path: ["endDate"],
            message: "End date must be greater than start date",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    })
    .transform((data): DateRangeTransformed => {
      return {
        startDate: data.startDate
          ? startOfDay(new Date(data.startDate))
          : startOfDay(new Date()),
        endDate: data.endDate
          ? endOfDayFn(new Date(data.endDate))
          : endOfDayFn(new Date()),
      };
    });

  return schema.safeParse(input);
};
