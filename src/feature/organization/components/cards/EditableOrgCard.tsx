import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UseViewOrgResponseT } from "../../hooks/useViewOrg";
import Link from "next/link";

const EditableOrgCard = ({
  org,
  onEdit,
}: {
  org: UseViewOrgResponseT["data"][number];
  onEdit: (webName: string) => void;
}) => (
  <Card className="min-w-fit shadow-md transition-shadow duration-300 hover:shadow-lg">
    <CardContent className="flex justify-between gap-2 p-2 sm:p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-primary">
          Org: <span className="text-3xl capitalize">{org.name ?? "N/A"}</span>
        </h1>
        <Link
          href={`/admin/dashboard/organization/o/${org.doctorWebName}`}
          // target="_blank"
          className="flex max-w-fit items-center gap-2 whitespace-nowrap text-lg font-medium text-blue-600 dark:text-blue-400"
        >
          <span className="max-w-16 truncate">{org.doctorWebName}</span>
          <ExternalLink className="size-4" />
        </Link>
        <p className="text-sm text-muted-foreground">ID: {org.id}</p>
        <Badge variant="outline" className="max-w-fit">
          Users Limit: {org.userLimit}
        </Badge>
      </div>
      <div className="mb-2 flex flex-col items-end gap-2">
        <Button
          onClick={() => onEdit(org.doctorWebName)}
          variant="ghost"
          size="icon"
        >
          <Edit />
        </Button>

        <p className="text-sm">
          Service: {new Date(org.serviceStartDate).toLocaleDateString()} -
          {new Date(org.serviceEndDate).toLocaleDateString()}
        </p>
        <h3 className="text-lg font-medium">{org.phone ?? "No Phone"}</h3>
      </div>
    </CardContent>
  </Card>
);

export default EditableOrgCard;
