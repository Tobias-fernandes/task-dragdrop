import { ITasks } from "@/shared/types/tasks";

const initialTasksData: ITasks = {
  todo: {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "task-1", content: "Learn Next.js" },
      { id: "task-2", content: "Create dashboard layout" },
      { id: "task-3", content: "Test API" },
    ],
  },
  doing: {
    id: "doing",
    title: "Doing",
    tasks: [
      { id: "task-4", content: "Develop login system" },
      { id: "task-5", content: "Adjust mobile design" },
    ],
  },
};

export { initialTasksData };
