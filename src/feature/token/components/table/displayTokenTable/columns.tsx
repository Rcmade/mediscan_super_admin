// "use client";

// import { ColumnDef } from "@tanstack/react-table";

// export type Appointment = {
//   tokenNumber: string;
//   patientName: string;
//   appointmentStatus: string;
// };

// export const columns: ColumnDef<Appointment>[] = [
//   {
//     accessorKey: "tokenNumber",
//     header: "Token Number",
//   },
//   {
//     accessorKey: "patientName",
//     header: "Name",
//   },
//   {
//     accessorKey: "appointmentStatus",
//     header: "Status",
//   },
// ];

"use client";

import { UseGetDisplayTokenResponseT } from "@/feature/token/hook/useGetDisplayToken";
import { ColumnDef } from "@tanstack/react-table";

export type Appointment = UseGetDisplayTokenResponseT["data"][number];

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "index",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "tokenNumber",
    header: "Token Number",
  },
  {
    accessorKey: "patientName",
    header: "Name",
  },
];
