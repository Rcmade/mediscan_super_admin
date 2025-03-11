import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import useAddEditOrgUserForm from "../../hooks/useAddEditOrgUserForm";
import { useAddEditOrgUserDialog } from "../../hooks/useAddEditOrgUserDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userRoleLimitedAccess } from "@/constant";
// import { OrgUserValues } from "@/zodSchema/orgUser";

// interface AddEditOrgUserFormProps {
//   orgUserInfo: Partial<OrgUserValues> & { webName: string };
// }
const AddEditOrgUserForm = () => {
  const { form, handleSubmit, isLoading } = useAddEditOrgUserForm();
  const orgUserInfoDialog = useAddEditOrgUserDialog((s) => s.orgUserInfo);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="Enter your name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="tel"
                  placeholder="+1234567890"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userRoleLimitedAccess.map((role) => (
                    <SelectItem value={role} key={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {orgUserInfoDialog?.type === "create" ? "Create" : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default AddEditOrgUserForm;
