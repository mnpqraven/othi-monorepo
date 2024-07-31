"use client";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "ui/primitive";
import { useAtomValue } from "jotai";
import { categoriesAtom } from "@planning/store/configs";
import { useCreateTaskDialog } from "./useCreateTaskDialog";
import { TaskForm } from "./TaskForm";

export function CreateTaskSheet() {
  const { open, setOpen, preInfo } = useCreateTaskDialog();
  const categories = useAtomValue(categoriesAtom);
  const currentCategory = categories.find((e) => e.id === preInfo?.uuid);

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{JSON.stringify(preInfo)}</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>

        {currentCategory ? <TaskForm category={currentCategory} /> : null}

        <DrawerFooter className="flex flex-row gap-4">
          <Button className="flex-1">Submit</Button>
          <DrawerClose asChild className="flex-1">
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
