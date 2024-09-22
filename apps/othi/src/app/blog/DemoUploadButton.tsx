"use client";

import { UploadButton } from "@othi/lib/uploadthing";
import { buttonVariants } from "ui/primitive";

export function DemoUploadButton() {
  // TODO: cva on button + generic
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        alert("Upload Completed");
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
