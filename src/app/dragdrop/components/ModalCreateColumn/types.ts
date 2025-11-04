import { HTMLAttributes } from "react";

interface IModalCreateColumn extends HTMLAttributes<HTMLDivElement> {
  title: string;
  buttonClassname?: string;
  newNameColumn: string;
  setNewNameColumn: (name: string) => void;
  createColumnWs: () => void;
}

export type { IModalCreateColumn };
