/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
"use client";

import { Button } from "ui/primitive";

export default function NotificationPage() {
  async function onClick() {
    if (Notification) {
      const permission = await Notification.requestPermission();
      console.log("requesting");
      switch (permission) {
        case "granted": {
          const text = `HEY! Your task abcd is now overdue.`;
          console.log("should see");
          const notification = new Notification("To do list", {
            body: text,
          });
          break;
        }
        case "denied": {
          console.log("denied");
          break;
        }
        default: {
          console.log("default");
          break;
        }
      }
    } else console.log("should not see");
  }
  return (
    <div>
      <Button onClick={onClick}>send notification</Button>
    </div>
  );
}
