"use client";

import { useState } from "react";

import { LIBRARY_CATEGORIES } from "@/constants";

const Page = () => {
  const [] = useState(LIBRARY_CATEGORIES[0].value);

  return (
    <div className="grid h-screen place-items-center">
      <h1 className="text-9xl font-bold">e-Library</h1>
    </div>
  );
};

export default Page;
