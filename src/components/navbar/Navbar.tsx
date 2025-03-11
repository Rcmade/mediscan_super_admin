import React, { Suspense } from "react";
import LogoButton from "../buttons/LogoButton";
import { UserButton } from "../buttons/UserButton";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between border-b px-2 py-4 md:px-4 lg:px-6">
      <Suspense>
        <LogoButton />
      </Suspense>
      <UserButton />
    </nav>
  );
};

export default Navbar;
