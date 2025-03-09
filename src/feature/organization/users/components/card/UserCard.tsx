import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Edit, Trash2 } from "lucide-react";
import { useGetUsersResponseT } from "../../hooks/useGetUsers";

interface UserCardProps {
  user: useGetUsersResponseT["users"][number];
  usersCount: number;
  onEdit: (user: useGetUsersResponseT["users"][number]) => void;
  onDelete: (user: useGetUsersResponseT["users"][number]) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  usersCount,
  onEdit,
  onDelete,
}) => {
  return (
    <Card key={user.userId} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <Badge variant={user.role}>{user.role}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Phone className="mr-2 h-4 w-4" />
          {user.phone}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        {usersCount >= 2 && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(user)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserCard;
