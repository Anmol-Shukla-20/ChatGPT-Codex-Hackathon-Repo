"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;

export function SheetContent({ className, side = "right", children, ...props }: React.ComponentPropsWithoutRef<typeof Dialog.Content> & { side?: "left" | "right" }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Dialog.Content className={cn("fixed z-50 h-full w-80 bg-background p-6 shadow-lg outline-none", side === "left" ? "left-0" : "right-0", className)} {...props}>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
