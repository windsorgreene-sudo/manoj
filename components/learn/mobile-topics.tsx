"use client";

import { ListTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TopicTree } from "@/components/learn/topic-tree";
import type { TreeCategory } from "@/lib/queries/articles";

export function MobileTopics({ tree, current }: { tree: TreeCategory[]; current: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl lg:hidden">
          <ListTree /> Topics
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto p-4" data-lenis-prevent>
        <SheetHeader className="px-0">
          <SheetTitle>All tutorials</SheetTitle>
        </SheetHeader>
        <TopicTree tree={tree} current={current} />
      </SheetContent>
    </Sheet>
  );
}
