"use client";

import { SearchForm } from "@/feature/token/components/form/SearchForm";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { startOfDay } from "date-fns";
import { Pagination } from "@/feature/token/components/search/Pagination";
import { useViewOrg } from "../../hooks/useViewOrg";
import EditableOrgCard from "../cards/EditableOrgCard";
import OrgCardSkeleton from "../skeleton/OrgCardSkeleton";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { useAddEditOrgDialog } from "@/feature/admin/dashboard/hooks/useAddEditOrgDialog";
import { useGetOrgByWebName } from "../../hooks/useGetOrgByWebName";
import dynamic from "next/dynamic";
const AddEditOrgDialog = dynamic(
  () => import("@/feature/admin/dashboard/components/dialog/AddEditOrgDialog"),
  { ssr: false },
);

const SearchAndViewOrg = () => {
  const searchParams = useSearchParams();
  const startTime = searchParams.get("startTime");
  const endOfDay = searchParams.get("endOfDay");
  const { data, isLoading, error } = useViewOrg({
    endOfDay: endOfDay || undefined,
    limit: searchParams.get("limit") || "10",
    page: searchParams.get("page") || "1",
    search: searchParams.get("search") || undefined,
    startTime: startTime
      ? startOfDay(startTime).toISOString()
      : startOfDay(new Date()).toISOString(),
  });
  const onEditOpen = useAddEditOrgDialog((s) => s.onOpen);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { mutateAsync } = useGetOrgByWebName();

  const handleEdit = async (orgName: string) => {
    const orgInfo = await mutateAsync(orgName);
    if (orgInfo) {
      onEditOpen({ type: "edit", orgInfo, webName: orgInfo.doctorWebName });
    }
  };

  return (
    <div className="space-y-4">
      <SearchForm
        placeholder={"Search for an organization by name..."}
        isGlobalSearch={true}
        showAdd={false}
        showStartEnd={false}
      />
      <AddEditOrgDialog />
      {error && (
        <p className="text-red-500">Error: {getReadableErrorMessage(error)}</p>
      )}
      <Card className="mx-auto w-full">
        <CardContent className="p-2 pt-4 md:p-6">
          {!isLoading &&
            !!!data?.data.length &&
            !endOfDay &&
            !endOfDay &&
            !startTime && <p> No Org found</p>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <OrgCardSkeleton key={index} />
                ))
              : (data?.data || [])?.map((org) => (
                  <EditableOrgCard key={org.id} org={org} onEdit={handleEdit} />
                ))}
          </div>
        </CardContent>
      </Card>
      {!isLoading && !error && (
        <>
          <Pagination
            page={currentPage}
            limit={limit}
            total={data?.pagination.total}
          />
        </>
      )}
    </div>
  );
};

export default SearchAndViewOrg;
