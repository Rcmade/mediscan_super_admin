import { ColumnDef, Row } from "@tanstack/react-table";
import { ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils/stringUtils";
import { formatDate } from "@/lib/utils/dateUtils";
import { TransactionResponseType } from "./useViewTransaction";
import useAddEditTransactionDialog from "./useAddEditTransactionDialog";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const useViewAdminTransactionColumns = () => {
  const onOpen = useAddEditTransactionDialog((s) => s.onOpen);
  const user = useCurrentUser();
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
    //       <>
    //         { (
    //           <Button
    //             onClick={() => {
    //               onOpen({
    //                 type: "edit",
    //                 webName: row.original.organization.doctorWebName,
    //                 transactionInfo: {
    //                   id: row.original.transaction.id,
    //                   total: row.original.transaction.total,
    //                   paid: row.original.transaction.paid,
    //                   due: row.original.transaction.due,
    //                   createdAt: row.original.transaction.createdAt,
    //                   updatedAt: row.original.transaction.updatedAt,
    //                   organizationId: row.original.organization.id,
    //                 },
    //               });
    //             }}
    //           >
    //             Edit
    //           </Button>
    //         )}
    //       </>
    //     );
    //   },
    // },
    ...(user?.role === "SUPER_ADMIN"
      ? [
          {
            id: "actions",
            header: "Action",
            cell: (info: {
              row: Row<TransactionResponseType["data"][number]>;
            }) => (
              <Button
                onClick={() => {
                  onOpen({
                    type: "edit",
                    webName: info.row.original.organization.doctorWebName,
                    transactionInfo: {
                      id: info.row.original.transaction.id,
                      total: info.row.original.transaction.total,
                      paid: info.row.original.transaction.paid,
                      due: info.row.original.transaction.due,
                      createdAt: info.row.original.transaction.createdAt,
                      updatedAt: info.row.original.transaction.updatedAt,
                      organizationId: info.row.original.organization.id,
                    },
                  });
                }}
              >
                Edit
              </Button>
            ),
          },
        ]
      : []),
  ];
  return { columns };
};

export default useViewAdminTransactionColumns;
