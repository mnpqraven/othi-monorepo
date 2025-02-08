import { useAtom } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "ui/primitive";
import { editorHelpDialogOpen } from "./store";

const commands = [
  { press: "Ctrl + h", label: "Headers" },
  { press: "Ctrl + b", label: "Bold" },
  { press: "Ctrl + i", label: "Italic" },
  { press: "Ctrl + u", label: "Underline" },
];
export function EditorHelpDialog() {
  const [open, setOpen] = useAtom(editorHelpDialogOpen);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Help & Commands</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid grid-flow-col grid-cols-3">
          {commands.map(({ press, label }) => (
            <span key={press}>
              {press}: {label}
            </span>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
