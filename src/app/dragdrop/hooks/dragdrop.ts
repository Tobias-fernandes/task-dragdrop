import { useState, ChangeEvent } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { ITask } from "@/shared/types/tasks";
import { useTaskStore } from "@/store/tasks";
import { send as wsSend } from "@/lib/wsClient";
import { formatText } from "@/shared/utils/formatText";

const DragDrop = () => {
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
    // Optimistically update local store
    reorderColumns(result);
    // Notify server so it can update canonical state and broadcast to other clients
    if (result?.destination) {
      try {
        wsSend({ type: "reorder", payload: result });
      } catch (err) {
        // ignore send failures — the local update already happened
        console.warn("ws send failed", err);
      }
    }
  };

  return {
    search,
    newTaskContent,

    formatText,
    handleSearch,
    handleNewTaskContentChange,
    handleCreate,
    handleDragEnd,
  };
};

export { DragDrop };
