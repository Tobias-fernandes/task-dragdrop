interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

type Columns = Record<string, Column>;

type Tasks = Columns & {
  todo: Column;
  doing: Column;
};

type ITask = Task;
type IColumn = Column;
type ITasks = Tasks;

export type { ITask, IColumn, ITasks };
