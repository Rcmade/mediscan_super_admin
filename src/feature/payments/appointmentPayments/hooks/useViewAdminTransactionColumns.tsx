import { ColumnDef } from "@tanstack/react-table";
import { ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { getInitials } from "@/lib/utils/stringUtils";
import { formatDate } from "@/lib/utils/dateUtils";
//import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AppointmentPaymentResponseType } from "./useViewAppointmentPayment";
import useUserType from "@/feature/organization/hooks/useUserType";

const useViewAppointmentPaymentColumns = () => {
  // const onOpen = useAddEditTransactionDialog((s) => s.onOpen);
  // const user = useCurrentUser()
  // const onEditEmployee = useEditEmployeeDialog((s) => s.onOpen);
  const userType = useUserType();

  const columns: ColumnDef<AppointmentPaymentResponseType["data"][number]>[] = [
    {
      accessorKey: "payment.id",
      header: "Payment ID",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.payment.id?.substring(0, 8) || "N/A"}...
        </div>
      ),
    },

    {
      accessorKey: "appointment.patientName",
      header: `${userType} Name`,
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.appointment.patientName || "N/A"}
        </div>
      ),
    },

    {
      accessorKey: "appointment.amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          ₹{row.original.appointment.amount?.toLocaleString() || 0}
        </div>
      ),
    },
    {
      accessorKey: "payment.totalAmount",
      header: "Total Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          ₹{row.original.payment.totalAmount?.toLocaleString() || 0}
        </div>
      ),
    },
    {
      accessorKey: "payment.paymentStatus",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.payment.paymentStatus === "COMPLETED"
              ? "default"
              : "outline"
          }
          className="capitalize"
        >
          {row.original.payment.paymentStatus || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "payment.createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <Badge variant="outline" className="whitespace-nowrap font-mono">
          <ClockIcon className="mr-1 h-3 w-3" />
          {row.original.payment.createdAt
            ? formatDate(row.original.payment.createdAt)
            : "N/A"}
        </Badge>
      ),
    },
  ];
  return { columns };
};

export default useViewAppointmentPaymentColumns;
