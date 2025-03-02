import { Loader } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader className="size-8 animate-spin" />
    </div>
  );
};

export default loading;
