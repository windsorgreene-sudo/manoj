"use client";

import { useState } from "react";
import type { SearchDoc } from "@/content";
import { SearchDialog } from "./SearchDialog";
import { SearchIcon } from "./icons";

export function HomeSearch({ index }: { index: SearchDoc[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-md border border-border-strong bg-surface px-4 py-3 text-left text-text-faint shadow-sm transition-colors hover:border-primary"
      >
        <SearchIcon className="h-5 w-5" />
        <span className="flex-1 text-[15px]">
          Search tutorials, topics, notes, assignments...
        </span>
      </button>
      <SearchDialog index={index} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
