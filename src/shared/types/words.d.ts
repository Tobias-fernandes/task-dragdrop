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

type Words = Columns & {
  todo: Column;
  doing: Column;
};

// Backwards-compatible aliases (some files use the I-prefixed names)
type ITask = Task;
type IColumn = Column;
type IWords = Words;

export type { Task, Column, Columns, Words, ITask, IColumn, IWords };
