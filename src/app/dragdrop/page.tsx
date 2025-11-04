"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ITask, ITasks } from "@/shared/types/tasks";
import { X } from "lucide-react";
import ModalCreateColumn from "./components/ModalCreateColumn";
import { useDragDrop } from "./hooks/useDragdrop";
import { useTaskStore } from "@/store/tasks";

// tests
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useModalCreateColumn } from "./components/ModalCreateColumn/hooks/useModalCreateColumn";
//

const DraggableColumns: React.FC = () => {
  const { newColumnName } = useModalCreateColumn();

  const [newNameColumn, setNewNameColumn] = useState<string>("");
  console.log("New Column Name:", newColumnName);

  const {
    search,
    newTaskContent,

    formatText,
    handleSearch,
    handleNewTaskContentChange,
    handleCreate,
    handleDragEnd,
  } = useDragDrop();

  const {
    state: { tasks },
    actions: { clearTasks, removeTask, setTasks },
  } = useTaskStore();

  const wsRef = useRef<WebSocket | null>(null);
  const isUpdatingFromServer = useRef(false);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:${process.env.WS_SERVER_PORT || 8080}`
    );

    socket.onopen = () => console.log("WebSocket connection established");

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        isUpdatingFromServer.current = true; // <-- marca que veio do servidor
        setTasks(parsed as ITasks);
      } catch (err) {
        toast.error(`Failed to parse WebSocket message: ${err}`);
      } finally {
        setTimeout(() => {
          isUpdatingFromServer.current = false; // <-- limpa após 100ms
        }, 100);
      }
    };

    socket.onclose = () => console.log("WebSocket connection closed");

    wsRef.current = socket;
    return () => socket.close();
  }, [setTasks]);

  const createColumnWs = () => {
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        event: "newColumn",
        data: {
          title: newNameColumn,
        },
      };

      socket.send(JSON.stringify(message));
    }
  };
  const sendMessage = useCallback(() => {
    const socket = wsRef.current;
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      tasks &&
      !isUpdatingFromServer.current // ✅ só envia se não veio do servidor
    ) {
      socket.send(JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    sendMessage();
  }, [sendMessage]);

  return (
    <section className="flex flex-col gap-6 p-8 bg-background min-h-screen mt-48">
      <h1 className="text-white">{newColumnName ?? "aqui"}</h1>
      <div className="w-full max-w-lg mx-auto flex flex-col gap-3">
        <Input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search tasks..."
          className="text-sm"
        />
        <Button onClick={createColumnWs}>Send Tasks to Server</Button>
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
            newNameColumn={newNameColumn}
            setNewNameColumn={setNewNameColumn}
            createColumnWs={createColumnWs}
          />
          <Button onClick={clearTasks}>Clear All</Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-8 justify-center flex-wrap">{/* ? */}</div>
      </DragDropContext>
    </section>
  );
};

export default DraggableColumns;
