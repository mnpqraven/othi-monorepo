"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "ui/primitive";
import { useAtomValue } from "jotai";
import { categoriesAtom, toTimeSchema } from "@planning/store/configs";
import { useCreateTaskDialog } from "./useCreateTaskDialog";
import { TaskForm } from "./TaskForm";

export function CreateTaskSheet() {
  // preinfo's uuid is category uuid
  const { open, setOpen, preInfo } = useCreateTaskDialog();
  const categories = useAtomValue(categoriesAtom);
  const currentCategory = categories.find((e) => e.id === preInfo?.uuid);
  const startTime = preInfo ? toTimeSchema.parse(preInfo.startTime) : undefined;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{JSON.stringify(preInfo)}</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        {currentCategory && startTime ? (
          <TaskForm category={currentCategory} startTime={startTime} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
