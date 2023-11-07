"use client"; // Error components must be Client Components

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "ui/primitive";

interface ErrorProps {
  error: Error;
  reset: () => void;
}
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button onClick={reset}>Try again</Button>
      <Button
        onClick={() => {
          router.back();
        }}
      >
        go back
      </Button>
    </div>
  );
}
