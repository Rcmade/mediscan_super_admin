import { z } from "zod";
import { startOfDay, endOfDay as endOfDayFn } from "date-fns";
import { isValidDate } from "@/lib/utils/dateUtils";

export const paginationSchema = z
  .object({
    limit: z.coerce.number().int().positive().default(20),
    page: z.coerce.number().int().positive().default(1),
    search: z.string().optional(),
    startTime: z
      .union([z.string(), z.date(), z.null(), z.undefined()])
      .refine((val) => !val || isValidDate(val), {
        message: "Invalid startTime",
      })
      .optional(),
    endOfDay: z
      .union([z.string(), z.date(), z.null(), z.undefined()])
      .refine((val) => !val || isValidDate(val), {
        message: "Invalid endOfDay",
      })
      .optional(),
  })
  .transform((data) => {
    const result: {
      limit: number;
      page: number;
      search: string;
      startTime: Date | undefined;
      endOfDay: Date | undefined;
      isGlobalSearch: boolean;
    } = {
      limit: data.limit,
      page: data.page,
      search: data.search || "", // Default to empty string if search is not provided
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endOfDay: data.endOfDay ? new Date(data.endOfDay) : undefined,
      isGlobalSearch: false,
    };

    // Case 1: If search is not provided, and startTime and endOfDay are both invalid
    if (!data.search && !data.startTime && !data.endOfDay) {
      result.startTime = startOfDay(new Date()); // default to start of the day
      result.endOfDay = endOfDayFn(new Date()); // default to end of the day
      result.isGlobalSearch = false;
      return result;
    }

    // TODO: Review this code
    // Case 2: Both search and valid startTime and endOfDay are provided
    if (
      data.search &&
      data.startTime &&
      data.endOfDay &&
      isValidDate(data.startTime) &&
      isValidDate(data.endOfDay)
    ) {
      result.startTime = startOfDay(new Date(data.startTime)); // convert startTime to start of the day
      result.endOfDay = endOfDayFn(new Date(data.endOfDay)); // convert endOfDay to end of the day
      result.isGlobalSearch = false;
      return result;
    }

    // TODO: Review this code
    // Case 3: search, startTime, and endOfDay are all valid
    if (
      data.search &&
      data.startTime &&
      data.endOfDay &&
      isValidDate(data.startTime) &&
      isValidDate(data.endOfDay)
    ) {
      result.startTime = new Date(data.startTime);
      result.endOfDay = new Date(data.endOfDay);
      result.isGlobalSearch = false;
      return result;
    }

    // Case 4: Both search and startTime are provided, but endOfDay is not
    if (data.search && data.startTime && !data.endOfDay) {
      result.startTime = new Date(data.startTime); // retain startTime
      result.endOfDay = undefined;
      result.isGlobalSearch = false;
      return result;
    }

    // Case 5: Both search and startTime are provided, with endOfDay missing or invalid
    if (
      data.search &&
      data.startTime &&
      (!data.endOfDay || data.endOfDay === "" || data.endOfDay === null)
    ) {
      result.startTime = new Date(data.startTime); // retain startTime
      result.endOfDay = undefined;
      result.isGlobalSearch = false;
      return result;
    }

    // Case 6: Only startTime is provided, no search and endOfDay
    if (data.startTime && !data.search && !data.endOfDay) {
      result.startTime = startOfDay(new Date(data.startTime)); // start of the day
      result.endOfDay = undefined;
      result.isGlobalSearch = false;
      return result;
    }

    // Case 7: endOfDay is provided without startTime and search
    if (data.endOfDay && !data.startTime && !data.search) {
      result.startTime = undefined;
      result.endOfDay = new Date(data.endOfDay); // retain endOfDay
      result.isGlobalSearch = false;
      return result;
    }

    // Case 8: search is provided, but startTime and endOfDay are invalid
    if (
      data.search &&
      (!data.startTime ||
        !data.endOfDay ||
        data.startTime === "" ||
        data.endOfDay === "" ||
        data.startTime === null ||
        data.endOfDay === null)
    ) {
      result.startTime = undefined;
      result.endOfDay = undefined;
      result.isGlobalSearch = true;
      return result;
    }

    return result;
  });

export type PaginationSchemaT = z.infer<typeof paginationSchema>;

// const testData = [
//   {
//     input: {
//       limit: 20,
//       page: 1,
//       // search: "test",
//       // startTime: "2024-12-28T00:00:00",
//     },
//     expectedResult: {
//       limit: 20,
//       page: 1,
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: undefined,
//       isGlobalSearch: false,
//     },
//   },
//   {
//     input: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: null,
//       endOfDay: null,
//     },
//     expectedResult: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: undefined,
//       endOfDay: undefined,
//       isGlobalSearch: true,
//     },
//   },
//   {
//     input: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: "2024-12-28T23:59:59",
//     },
//     expectedResult: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: "2024-12-28T23:59:59",
//       isGlobalSearch: false,
//     },
//   },
//   {
//     input: {
//       limit: 20,
//       page: 1,
//       startTime: "2024-12-28T00:00:00",
//     },
//     expectedResult: {
//       limit: 20,
//       page: 1,
//       search: "",
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: undefined,
//       isGlobalSearch: false,
//     },
//   },
//   {
//     input: {
//       limit: 20,
//       page: 1,
//       endOfDay: "2024-12-28T23:59:59",
//     },
//     expectedResult: {
//       limit: 20,
//       page: 1,
//       search: "",
//       startTime: undefined,
//       endOfDay: "2024-12-28T23:59:59",
//       isGlobalSearch: false,
//     },
//   },
//   {
//     input: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: null,
//     },
//     expectedResult: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: undefined,
//       isGlobalSearch: false,
//     },
//   },
//   {
//     input: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: "2024-12-28T23:59:59",
//     },
//     expectedResult: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: "2024-12-28T23:59:59",
//       isGlobalSearch: false,
//     },
//   },
//   {
//     input: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: "2024-12-28T23:59:59",
//     },
//     expectedResult: {
//       limit: 20,
//       page: 1,
//       search: "test",
//       startTime: "2024-12-28T00:00:00",
//       endOfDay: "2024-12-28T23:59:59",
//       isGlobalSearch: false,
//     },
//   },
// ];

// testData.forEach(({ input, expectedResult }) => {
//   const result = paginationSchema.parse(input);
//   console.log({ result, expectedResult });
// });
