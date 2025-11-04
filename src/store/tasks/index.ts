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
    setTasks: (tasks: ITasks) =>
      set(() => ({
        state: {
          tasks,
        },
      })),

    addTask: (columnId: keyof ITasks, task: ITask) =>
      set((state) => {
        if (!state.state.tasks[columnId]) {
          throw new Error("Column not found");
        }
        if (!task.content) {
          throw new Error("Task content cannot be empty");
        }
        return {
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
        };
      }),

    reorderTasks: (result) =>
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
          tasks: {},
        },
      })),

    createColumn: (title, id = `column-${Date.now()}`) =>
      set((state) => {
        if (!title) {
          throw new Error("Name is required to create a column");
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

    reorderColumns: (startIndex, endIndex) =>
      set((state) => {
        const columns = Object.values(state.state.tasks);
        const [removed] = columns.splice(startIndex, 1);
        columns.splice(endIndex, 0, removed);

        const newTasksOrder: ITasks = {};
        columns.forEach((col) => {
          newTasksOrder[col.id] = col;
        });

        return {
          state: {
            ...state.state,
            tasks: newTasksOrder,
          },
        };
      }),

    removeColumn: (columnId: string) =>
      set((state) => {
        const updatedTasks = { ...state.state.tasks };
        delete updatedTasks[columnId];
        return {
          state: {
            ...state.state,
            tasks: updatedTasks,
          },
        };
      }),
  },
}));

export { useTaskStore };
