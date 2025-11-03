import { ITask, IWords } from "@/shared/types/words";
import { create } from "zustand";
import { IWordState } from "./types";
import { initialWordsData } from "./constants";

const initialWords = initialWordsData;

export const useWordStore = create<IWordState>((set) => ({
  state: {
    words: initialWords,
  },
  actions: {
    addTask: (columnId: keyof IWords, task: ITask) =>
      set((state) => ({
        state: {
          ...state.state,
          words: {
            ...state.state.words,
            [columnId]: {
              ...state.state.words[columnId],
              tasks: [...state.state.words[columnId].tasks, task],
            },
          },
        },
      })),

    removeTask: (columnId: keyof IWords, taskId: string) =>
      set((state) => ({
        state: {
          ...state.state,
          words: {
            ...state.state.words,
            [columnId]: {
              ...state.state.words[columnId],
              tasks: state.state.words[columnId].tasks.filter(
                (t: ITask) => t.id !== taskId
              ),
            },
          },
        },
      })),

    clearWords: () =>
      set(() => ({
        state: {
          words: {
            todo: {
              id: "todo",
              title: "To Do",
              tasks: [],
            },
            doing: {
              id: "doing",
              title: "Doing",
              tasks: [],
            },
          },
        },
      })),

    reorderColumns: (result) =>
      set((state) => {
        const { source, destination } = result;
        if (!destination) return state;

        const sourceCol = state.state.words[source.droppableId];
        const destCol = state.state.words[destination.droppableId];
        const sourceTasks = Array.from(sourceCol.tasks);
        const destTasks = Array.from(destCol.tasks);
        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
          sourceTasks.splice(destination.index, 0, movedTask);
          return {
            state: {
              ...state.state,
              words: {
                ...state.state.words,
                [source.droppableId]: {
                  ...sourceCol,
                  tasks: sourceTasks,
                },
              },
            },
          };
        }
        if (source.droppableId !== destination.droppableId) {
          destTasks.splice(destination.index, 0, movedTask);
          return {
            state: {
              ...state.state,
              words: {
                ...state.state.words,
                [source.droppableId]: {
                  ...sourceCol,
                  tasks: sourceTasks,
                },
                [destination.droppableId]: {
                  ...destCol,
                  tasks: destTasks,
                },
              },
            },
          };
        }

        return state;
      }),

    createColumn: (title, id = `column-${Date.now()}`) =>
      set((state) => {
        if (!title || !id) {
          throw new Error("Title and ID are required to create a column");
        }
        return {
          state: {
            ...state.state,
            words: {
              ...state.state.words,
              [id]: {
                id,
                title,
                tasks: [],
              },
            },
          },
        };
      }),
  },
}));
