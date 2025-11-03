import { ITask, IWords } from "@/shared/types/words";
import { DropResult } from "@hello-pangea/dnd";
interface IWordState {
  state: {
    words: IWords;
  };
  actions: {
    addTask: (columnId: string, task: ITask) => void;
    removeTask: (columnId: string, taskId: string) => void;
    clearWords: () => void;
    reorderColumns: (result: DropResult) => void;
    createColumn: (title: string, id?: string) => void;
  };
}

export type { IWordState };
