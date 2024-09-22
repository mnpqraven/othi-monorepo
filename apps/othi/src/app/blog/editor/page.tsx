import { EditorProvider } from "@othi/components/editor/EditorProvider";
import { EditorCreateButton } from "./EditorCreateButton";

export default function Page() {
  return (
    <EditorProvider>
      <EditorCreateButton />
    </EditorProvider>
  );
}
