import { Info, TriangleAlert } from "lucide-react";
import React from "react";
import { Alert, alertVariants } from "@/components/ui/alert";
import { VariantProps } from "class-variance-authority";
type FormResultMessageProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    message?: string;
  };

const FormResultMessage = ({ message, ...rest }: FormResultMessageProps) =>
  message && (
    <Alert {...rest}>
      {rest.variant == "destructive" ? (
        <TriangleAlert className="mr-2" />
      ) : (
        <Info className="mr-2" />
      )}
      <div>
        <strong>{message || ""}</strong>
      </div>
    </Alert>
  );

export default FormResultMessage;
