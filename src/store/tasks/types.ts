import { ITask, ITasks } from "@/shared/types/tasks";
import { DropResult } from "@hello-pangea/dnd";
interface ITaskState {
  state: {
    tasks: ITasks;
  };
  actions: {
    setTasks: (tasks: ITasks) => void;
    addTask: (columnId: string, task: ITask) => void;
    reorderTasks: (result: DropResult) => void;
    removeTask: (columnId: string, taskId: string) => void;
    clearTasks: () => void;
    createColumn: (title: string, id?: string) => void;
    reorderColumns: (startIndex: number, endIndex: number) => void;
    removeColumn: (columnId: string) => void;
  };
}

export type { ITaskState };
