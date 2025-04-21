"use client";
import useGetUsers, {
  useGetUsersResponseT,
} from "@/feature/organization/users/hooks/useGetUsers";
import { Card, CardContent } from "@/components/ui/card";
import UsersViewSkeleton from "@/feature/organization/users/components/UsersViewSkeleton";
import UserCard from "@/feature/organization/users/components/card/UserCard";
import dynamic from "next/dynamic";
import { useAddEditOrgUserDialog } from "@/feature/organization/users/hooks/useAddEditOrgUserDialog";
import useWebName from "@/hooks/useWebName";
import { userRoleLimitedAccess } from "@/constant";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import useDeleteOrgUser from "@/feature/organization/users/hooks/useDeleteOrgUser";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const AddEditOrgUserDialog = dynamic(
  () =>
    import(
      "@/feature/organization/users/components/dialog/AddEditOrgUserDialog"
    ),
  {
    ssr: false,
  },
);

type User = useGetUsersResponseT["users"][number];

const ViewUsers = () => {
  const { data, isLoading } = useGetUsers();

  const { webName } = useWebName();
  const onOpen = useAddEditOrgUserDialog((s) => s.onOpen);

  const currentUser = useCurrentUser();
  const { showAlertDialog, setAlertDialogLoading, closeAlertDialog } =
    useAlertDialog();
  const { mutateAsync: deleteMutateAsync } = useDeleteOrgUser();

  const handleDelete = async (user: User) => {
    const confirmed = await showAlertDialog({
      title: "Are you sure?",
      description: (
        <span>
          This action cannot be undone. This will permanently delete the user
          <strong className="mx-2 text-2xl font-bold capitalize">
            {user.name}
          </strong>
          .
        </span>
      ),
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });

    if (confirmed) {
      setAlertDialogLoading(true);
      await deleteMutateAsync({
        param: {
          doctorWebName: webName,
          userId: user.userId,
        },
      });
      setAlertDialogLoading(false);
      setTimeout(() => {
        closeAlertDialog();
      }, 0);
    }
  };

  if (isLoading) {
    return <UsersViewSkeleton />;
  }

  const users = data?.users || [];

  return (
    <>
      {users.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No users found
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.userId}
              user={user}
              usersCount={users?.length}
              onDelete={() => handleDelete(user)}
              onEdit={() => {
                onOpen({
                  type: "edit",
                  orgUserInfo: {
                    webName: webName,
                    userId: user.userId,
                    name: user.name,
                    phoneNumber: user.phone,
                    role: user.role as (typeof userRoleLimitedAccess)[number],
                  },
                });
              }}
              showEdit={
                !!(
                  currentUser?.role === "ADMIN" ||
                  currentUser?.role === "SUPER_ADMIN"
                )
              }
              showDelete={
                !!(
                  currentUser?.role === "ADMIN" ||
                  currentUser?.role === "SUPER_ADMIN"
                )
              }
            />
          ))}
        </div>
      )}
      {/* Add/Edit Dialog */}
      <AddEditOrgUserDialog />
    </>
  );
};

// const RoleBadge = ({ role }: { role: string }) => {
//   const getColorByRole = () => {
//     switch (role) {
//       case "ADMIN":
//         return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
//       case "DOCTOR":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
//       case "STAFF":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
//     }
//   };

//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getColorByRole()}`}
//     >
//       {role}
//     </span>
//   );
// };

export default ViewUsers;
