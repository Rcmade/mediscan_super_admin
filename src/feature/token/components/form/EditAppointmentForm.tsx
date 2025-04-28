import React, { useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseGetAppointmentResponseT } from "../../hook/useGetAppointment";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditAppointment } from "../../hook/useEditAppointment";
import { appointmentStatusArr } from "@/constant";
import { getCloudinaryId } from "@/lib/utils/cloudinaryUtils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { calendarDateFormat } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import useViewAppointmentReasonType from "@/feature/appointmentReasonType/hooks/useViewAppointmentReasonType";

interface Props {
  data: UseGetAppointmentResponseT & { tokenNumber: string };
  setEditAppointmentId: (value: React.SetStateAction<string>) => void;
}
const EditAppointmentForm = ({
  data: {
    appointmentStatus,
    //   createdAt,
    id,
    phone,
    image,
    patientName,
    reasonForVisitTypeId,
    revisitTime,
  },
  setEditAppointmentId,
}: Props) => {
  const fileInpRef = useRef<HTMLInputElement>(null);
  const [openPopovers, setOpenPopovers] = useState({
    revisit: false,
  });

  const { data } = useViewAppointmentReasonType();

  const { onSubmit, isLoading, form } = useEditAppointment({
    patientName: patientName || "",
    appointmentStatus: appointmentStatus || "Scheduled",
    image: image || "",
    phone: phone || "",
    reasonForVisitTypeId: reasonForVisitTypeId || "",
    revisitTime: revisitTime ? new Date(revisitTime) : undefined,
    appointmentId: id,
    onSuccessFn: () => {
      setEditAppointmentId("");
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <div className="relative flex size-[72px] items-center gap-x-4 overflow-hidden rounded-md">
                {field?.value ? (
                  <Image
                    src={
                      field.value instanceof File
                        ? URL.createObjectURL(field.value)
                        : field.value
                    }
                    className="object-cover"
                    fill
                    alt="Project image"
                  />
                ) : (
                  <Avatar className="flex size-[72px] items-center justify-center rounded-full bg-muted">
                    <AvatarFallback>
                      <ImageIcon className="size-[36px] text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm">Add Prescription Image</p>
                {/* <p className="text-sm text-muted-foreground">
                  JPEG , PNG, SVG, or JPG, Max 1mb
                </p> */}
                <input
                  type="file"
                  accept=".jpg, .png, .jpeg, .svg"
                  ref={fileInpRef}
                  hidden
                  disabled={isLoading}
                  onChange={handleImageChange}
                />
                {field.value ? (
                  <Button
                    type="button"
                    disabled={isLoading}
                    variant="destructive"
                    className="w-fit"
                    onClick={() => {
                      field.onChange("");
                      if (fileInpRef.current) {
                        fileInpRef.current.value = "";
                      }

                      if (typeof field.value === "string") {
                        const uploadedId = getCloudinaryId(field.value);
                        if (uploadedId) {
                          form.setValue("deletedImage", uploadedId);
                        }
                      }
                    }}
                  >
                    Remove Image
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={isLoading}
                    variant="secondary"
                    className="w-fit"
                    onClick={() => fileInpRef.current?.click()}
                  >
                    Upload Image
                  </Button>
                )}
              </div>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="reasonForVisitTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Visit</FormLabel>
              <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
               
                  {(data?.appointmentReasons || []).map((reason) => (
                    <SelectItem
                      value={reason.reasonId}
                      key={reason.reasonId}
                      className="capitalize"
                    >
                      {reason.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="appointmentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {appointmentStatusArr.map((status) => (
                    <SelectItem value={status} key={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="revisitTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Patient Revisit</FormLabel>
              <Popover
                onOpenChange={(o) =>
                  setOpenPopovers((pre) => ({ ...pre, revisit: o }))
                }
                open={openPopovers.revisit}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "border-input pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        calendarDateFormat(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setOpenPopovers((pre) => ({ ...pre, revisit: false }));
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Reset time to start of day
                      return date < today || date < new Date("1900-01-01");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <Button spinner type="button" className="w-full" disabled={isLoading}>
          Save and Add Payment
        </Button> */}

        {/* <div className="relative flex w-full justify-center border-b border-input">
          <span className="absolute -top-3 bg-background px-4">OR</span>
        </div> */}
        <Button spinner type="submit" className="w-full" disabled={isLoading}>
          Confirm
        </Button>
      </form>
    </Form>
  );
};

export default EditAppointmentForm;
