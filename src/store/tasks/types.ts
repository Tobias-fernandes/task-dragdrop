import { ITask, ITasks } from "@/shared/types/tasks";
import { DropResult } from "@hello-pangea/dnd";
interface ITaskState {
  state: {
    tasks: ITasks;
  };
  actions: {
    addTask: (columnId: string, task: ITask) => void;
    removeTask: (columnId: string, taskId: string) => void;
    clearTasks: () => void;
    reorderColumns: (result: DropResult) => void;
    createColumn: (title: string, id?: string) => void;
  };
}

export type { ITaskState };
