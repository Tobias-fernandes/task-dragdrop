import { ITask, ITasks } from "@/shared/types/tasks";
import { create } from "zustand";
import { ITaskState } from "./types";
import { initialTasksData } from "./constants";

const initialTasks = initialTasksData;

const useTaskStore = create<ITaskState>((set) => ({
  state: {
    tasks: initialTasks,
  },
  actions: {
    addTask: (columnId: keyof ITasks, task: ITask) =>
      set((state) => ({
        state: {
          ...state.state,
          tasks: {
            ...state.state.tasks,
            [columnId]: {
              ...state.state.tasks[columnId],
              tasks: [...state.state.tasks[columnId].tasks, task],
            },
          },
        },
      })),

    removeTask: (columnId: keyof ITasks, taskId: string) =>
      set((state) => ({
        state: {
          ...state.state,
          tasks: {
            ...state.state.tasks,
            [columnId]: {
              ...state.state.tasks[columnId],
              tasks: state.state.tasks[columnId].tasks.filter(
                (t: ITask) => t.id !== taskId
              ),
            },
          },
        },
      })),

    clearTasks: () =>
      set(() => ({
        state: {
          tasks: {
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

        const sourceCol = state.state.tasks[source.droppableId];
        const destCol = state.state.tasks[destination.droppableId];
        const sourceTasks = Array.from(sourceCol.tasks);
        const destTasks = Array.from(destCol.tasks);
        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
          sourceTasks.splice(destination.index, 0, movedTask);
          return {
            state: {
              ...state.state,
              tasks: {
                ...state.state.tasks,
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
              tasks: {
                ...state.state.tasks,
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
            tasks: {
              ...state.state.tasks,
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

export { useTaskStore };
