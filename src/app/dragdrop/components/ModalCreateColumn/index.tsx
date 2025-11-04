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
import { IModalCreateColumn } from "./types";
import { useModalCreateColumn } from "./hooks/useModalCreateColumn";

const ModalCreateColumn: React.FC<IModalCreateColumn> = ({
  title,
  buttonClassname,
  newNameColumn,
  setNewNameColumn,
  createColumnWs,
  ...props
}) => {
  const {
    dialog,
    // newColumnName,

    setDialog,
    handleCreateColumn,
    // setNewColumnName,
  } = useModalCreateColumn();

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
                value={newNameColumn}
                onChange={(e) => setNewNameColumn(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={() => handleCreateColumn(createColumnWs)}>
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
