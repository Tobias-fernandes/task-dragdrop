"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ITask } from "@/shared/types/tasks";
import { X, GripVertical, Search, PlusCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { formatText } from "@/shared/utils/formatText";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { HTMLAttributes } from "react";
import { useTaskStore } from "@/store/tasks";
import { Input } from "@/components/ui/input";
import { getFirstColumn } from "@/shared/utils/getFirstColumn";

interface IModalCreateColumn extends HTMLAttributes<HTMLDivElement> {
  title: string;
  buttonClassname?: string;
}

const ModalCreateColumn: React.FC<IModalCreateColumn> = ({
  title,
  buttonClassname,
  ...props
}) => {
  const {
    actions: { createColumn },
  } = useTaskStore();

  const [newColumnName, setNewColumnName] = useState<string>("");
  const [dialog, setDialog] = useState<boolean>(false);

  const handleCreateColumn = () => {
    try {
      createColumn(newColumnName);
      setNewColumnName("");
      setDialog(false);
      toast.success("Task has been created");
    } catch (err) {
      toast.error(`Something went wrong: ${err}`);
    }
  };
  return (
    <div {...props}>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <form>
          <DialogTrigger asChild>
            <Button
              className={buttonClassname}
              variant="outline"
              onClick={() => setDialog(true)}
            >
              {title}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                Insert below the name of the new column to be created.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="newColumn">Column name</Label>
              <Input
                id="newColumn"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleCreateColumn}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

const DraggableColumns: React.FC = () => {
  const {
    state: { tasks },
    actions: { addTask, reorderTasks, clearTasks, removeTask, removeColumn },
  } = useTaskStore();

  const [search, setSearch] = useState<string>("");
  const [newTaskContent, setNewTaskContent] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value.toLowerCase());

  const handleNewTaskContentChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewTaskContent(e.target.value);

  const handleCreate = () => {
    try {
      if (!newTaskContent.trim())
        throw new Error("Task content cannot be empty");

      const newTask: ITask = {
        id: `task-${Date.now()}`,
        content: newTaskContent.trim(),
      };

      const firstColumnId = getFirstColumn(tasks);
      addTask(firstColumnId, newTask);

      setNewTaskContent("");
    } catch (err) {
      toast.error(`Something went wrong: ${err}`);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    reorderTasks(result);
  };

  const columns = Object.values(tasks);

  return (
    <section className="flex flex-col items-center justify-center gap-6 p-4 bg-background sm:min-h-screen max-sm:mt-20">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-3">
        <div className="relative">
          <Input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search tasks..."
            className="text-sm pl-8"
            disabled={!columns.length}
          />
          <Search className="absolute h-4 w-4 text-muted-foreground right-5 left-2 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTaskContent}
            onChange={handleNewTaskContentChange}
            placeholder="Add new task..."
            className="text-sm flex-2/3"
          />
          <Button onClick={handleCreate} className="relative">
            <span className="flex-1/3 pl-4">Add</span>
            <PlusCircle className="absolute text-secondary h-4 w-4 right-5 left-2 top-1/2 -translate-y-1/2" />
          </Button>
        </div>
        <ModalCreateColumn
          title="Create New Column"
          className="flex-1"
          buttonClassname="w-full"
        />
        <Button onClick={clearTasks}>Clear All</Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex w-full gap-8 justify-center max-sm:flex-col">
          {Object.values(tasks).map((column) => {
            const filteredTasks = column.tasks.filter((task: ITask) =>
              task.content.toLowerCase().includes(search)
            );

            return (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-full sm:w-72 md:w-80 lg:w-96"
                  >
                    <CardHeader className="relative group/column">
                      <CardTitle>{column.title}</CardTitle>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeColumn(column.id)}
                            className="absolute md:group-hover:flex right-2 -top-2 p-0 max-md:text-red-500 md:hover:text-red-500"
                          >
                            <X />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete column</TooltipContent>
                      </Tooltip>
                    </CardHeader>
                    <CardContent>
                      {!filteredTasks.length && (
                        <p className="text-sm text-muted-foreground italic">
                          No tasks found.
                        </p>
                      )}

                      {filteredTasks.map((task: ITask, index: number) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`group relative p-3 mb-2 rounded-md text-sm border transition-colors ${
                                snapshot.isDragging
                                  ? "bg-primary/20 border-primary"
                                  : "bg-muted"
                              }`}
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical
                                  className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing border rounded"
                                  size={20}
                                  color="gray"
                                />
                              </div>

                              <span className="font-medium pl-5">
                                {formatText(task.content)}
                              </span>

                              <Button
                                variant="ghost"
                                onClick={() => removeTask(column.id, task.id)}
                                className="absolute md:hidden md:group-hover:flex right-0 -translate-y-1/2 top-1/2 p-0 max-md:text-red-500 md:hover:text-red-500"
                              >
                                <X />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </CardContent>
                  </Card>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </section>
  );
};

export default DraggableColumns;
