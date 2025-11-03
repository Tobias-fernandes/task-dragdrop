"use client";

import { useState, HTMLAttributes } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWordStore } from "@/store/words";
import { toast } from "sonner";

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
  } = useWordStore();

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

export default ModalCreateColumn;
