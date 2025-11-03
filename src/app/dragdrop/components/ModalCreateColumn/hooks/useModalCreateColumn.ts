import { useState } from "react";
import { useTaskStore } from "@/store/tasks";
import { toast } from "sonner";
const useModalCreateColumn = () => {
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

  return {
    dialog,
    newColumnName,

    setDialog,
    setNewColumnName,
    handleCreateColumn,
  };
};

export { useModalCreateColumn };
