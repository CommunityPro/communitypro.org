"use client";

import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LIBRARY_CATEGORIES } from "@/constants";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks";

const Page = () => {
  const [category, setCategory] = useState(LIBRARY_CATEGORIES[0].value);
  const [search, setSearch] = useState("");

  useDebounce(search, 500);

  return (
    <div className="w-screen">
      <section className="w-full sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center gap-x-4">
            <Input
              className="max-w-125"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books"
              value={search}
            />
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-75">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIBRARY_CATEGORIES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      <hr />
      <section className="py-5 sm:py-10">
        <div className="mx-auto min-h-150 max-w-7xl"></div>
      </section>
    </div>
  );
};

export default Page;
