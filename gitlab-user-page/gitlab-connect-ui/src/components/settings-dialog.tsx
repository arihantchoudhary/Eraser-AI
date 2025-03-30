"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { GitLabConnect } from "@/components/gitlab-connect";

interface SettingsDialogProps {
  defaultOpen?: boolean;
}

export function SettingsDialog({ defaultOpen = false }: SettingsDialogProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl p-0 max-h-[90vh] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-3 border-b flex flex-row justify-between items-center border-gray-200 bg-white">
          <DialogTitle className="text-xl font-medium">Settings</DialogTitle>
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            className="text-gray-700 hover:bg-transparent hover:text-gray-900"
          >
            Close <span className="ml-2 text-xs text-gray-400">Esc</span>
          </Button>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            <GitLabConnect />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
