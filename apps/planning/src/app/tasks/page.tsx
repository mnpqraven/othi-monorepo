import { TaskForm } from "./TaskForm";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <TaskForm />

      <span>listing</span>
    </div>
  );
}
