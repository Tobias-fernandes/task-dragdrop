import { ITasks } from "../types/tasks";

const getFirstColumn = (tasks: ITasks) => {
  const firstColumnId = Object.keys(tasks)[0] as keyof typeof tasks;

  return firstColumnId;
};
export { getFirstColumn };
