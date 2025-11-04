"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ITask, ITasks } from "@/shared/types/tasks";
import { X } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { HTMLAttributes } from "react";
import { useTaskStore } from "@/store/tasks";
import { Input } from "@/components/ui/input";

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
    actions: { addTask, reorderColumns },
  } = useTaskStore();

  const [search, setSearch] = useState<string>("");
  const [newTaskContent, setNewTaskContent] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value.toLowerCase());

  const handleNewTaskContentChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewTaskContent(e.target.value);

  const handleCreate = () => {
    if (!newTaskContent.trim()) return;

    const newTask: ITask = {
      id: `task-${Date.now()}`,
      content: newTaskContent.trim(),
    };
    addTask("todo", newTask);

    setNewTaskContent("");
  };

  const handleDragEnd = (result: DropResult) => {
    reorderColumns(result);
  };

  const {
    state: { tasks },
    actions: { clearTasks, removeTask },
  } = useTaskStore();

  return (
    <section className="flex flex-col gap-6 p-8 bg-background min-h-screen mt-20">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-3">
        <Input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search tasks..."
          className="text-sm"
        />

        <div className="flex gap-2">
          <Input
            type="text"
            value={newTaskContent}
            onChange={handleNewTaskContentChange}
            placeholder="Add new task..."
            className="text-sm"
          />
          <Button onClick={handleCreate} className="whitespace-nowrap">
            Add
          </Button>
        </div>
        <div className="flex gap-2">
          <ModalCreateColumn
            title="Create New Column"
            className="flex-1"
            buttonClassname="w-full"
          />
          <Button onClick={clearTasks} className="">
            Clear All
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-8 justify-center flex-wrap">
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
                    className="w-64"
                  >
                    <CardHeader>
                      <CardTitle>{column.title}</CardTitle>
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
                              {...provided.dragHandleProps}
                              className={`group relative p-3 pr-10 mb-2 rounded-md text-sm border transition-colors ${
                                snapshot.isDragging
                                  ? "bg-primary/20 border-primary"
                                  : "bg-muted"
                              }`}
                            >
                              {formatText(task.content)}
                              <Button
                                variant="ghost"
                                onClick={() => removeTask(column.id, task.id)}
                                className="absolute md:hidden md:group-hover:flex right-2 -translate-y-1/2 top-1/2 p-0 max-sm:text-red-500 hover:text-red-500"
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
