export interface GameStore {
  name: string;
  tasks: Task[];
}
export interface Task {
  name: string;
  type: "daily" | "weekly";
}
