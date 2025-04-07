import { ColumnDef } from "@tanstack/react-table";
import { ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils/stringUtils";
import { formatDate } from "@/lib/utils/dateUtils";
import { TransactionResponseType } from "./useViewTransaction";

const useViewAdminTransactionColumns = () => {
  // const onOpen = useDeleteEmployee((s) => s.onOpen);
  // const onEditEmployee = useEditEmployeeDialog((s) => s.onOpen);

  /* 
    transaction: {
        id: string;
        createdAt: string;
        updatedAt: string;
        organizationId: string;
        total: string;
        paid: string;
        due: string;
    };
    organization: {
        id: string;
        createdAt: string;
        updatedAt: string;
        doctorWebName: string;
        serviceStartDate: string;
        serviceEndDate: string;
        userLimit: number;
    };
   */
  const columns: ColumnDef<TransactionResponseType["data"][number]>[] = [
    {
      accessorKey: "organization.doctorWebName",
      header: "Doctor Web Name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-medium text-primary">
              {getInitials(row.original.organization.doctorWebName)}
            </span>
          </div>
          <span className="font-medium">
            {row.original.organization.doctorWebName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "transaction.total",
      header: "Total",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{row.original.transaction.total}</span>
        </div>
      ),
    },
    {
      accessorKey: "transaction.paid",
      header: "Paid Amount",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{row.original.transaction.paid}</span>
        </div>
      ),
    },
    {
      accessorKey: "transaction.due",
      header: "Due Amount",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{row.original.transaction.due}</span>
        </div>
      ),
    },

    {
      accessorKey: "transaction.createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <Badge variant="outline" className="whitespace-nowrap font-mono">
          <ClockIcon className="mr-1 h-3 w-3" />
          {row.original.transaction.createdAt
            ? formatDate(row.original.transaction.createdAt)
            : "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "transaction.updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <Badge variant="outline" className="whitespace-nowrap font-mono">
          <ClockIcon className="mr-1 h-3 w-3" />
          {row.original.transaction.updatedAt
            ? formatDate(row.original.transaction.updatedAt)
            : "N/A"}
        </Badge>
      ),
    },
    // {
    //   id: "actions",
    //   header: "Action",
    //   cell: ({ row }) => {
    //     return (
    //       <ViewEditDeleteButton
    //         // onDelete={() => onOpen(row.original)}
    //         // onEdit={() => onEditEmployee(row.original)}
    //         onDelete={() => {}}
    //         onEdit={() => {}}
    //         viewLink={`/dashboard/employee/${row.original.id}`}
    //       />
    //     );
    //   },
    // },
  ];
  return { columns };
};

export default useViewAdminTransactionColumns;
