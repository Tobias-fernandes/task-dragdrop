import { useState } from "react";
import { useTaskStore } from "@/store/tasks";
import { toast } from "sonner";
const useModalCreateColumn = () => {
  const {
    actions: { createColumn },
  } = useTaskStore();

  const [newColumnName, setNewColumnName] = useState<string>("");
  const [dialog, setDialog] = useState<boolean>(false);

  const handleCreateColumn = (createColumnWs: () => void) => {
    try {
      setNewColumnName("");
      setDialog(false);
      createColumnWs();
      toast.success("Column has been created");
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
