"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ITask } from "@/shared/types/tasks";
import { X } from "lucide-react";
import ModalCreateColumn from "./components/ModalCreateColumn";
import { DragDrop } from "./hooks/dragdrop";
import { useTaskStore } from "@/store/tasks";
import useWsTasks from "@/hooks/useWsTasks";

const DraggableColumns: React.FC = () => {
  // mount websocket sync (keeps Zustand store in sync with server)
  useWsTasks();

  const {
    search,
    newTaskContent,

    formatText,
    handleSearch,
    handleNewTaskContentChange,
    handleCreate,
    handleDragEnd,
  } = DragDrop();

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
