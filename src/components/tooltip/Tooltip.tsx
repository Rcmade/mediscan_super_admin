import React from "react";
import {
  Tooltip as TooltipWrapper,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Children } from "@/types";

const Tooltip = ({ children, content }: Children & { content: string }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <TooltipWrapper>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </TooltipWrapper>
    </TooltipProvider>
  );
};

export default Tooltip;
