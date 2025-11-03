import { HTMLAttributes } from "react";

interface IModalCreateColumn extends HTMLAttributes<HTMLDivElement> {
  title: string;
  buttonClassname?: string;
}

export type { IModalCreateColumn };
