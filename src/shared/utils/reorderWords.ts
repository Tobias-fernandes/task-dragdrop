// import { DropResult } from "@hello-pangea/dnd";
// import { Columns } from "../types/tasks";

// /**
//  * Função genérica para reordenar tasks de um conjunto de colunas.
//  * @param columns - objeto com todas as colunas
//  * @param result - resultado do drag do @hello-pangea/dnd
//  * @returns novo objeto columns atualizado
//  */
// export const reorderColumns = (
//   columns: Columns,
//   result: DropResult
// ): Columns => {
//   const { source, destination } = result; // recolhem info de origem e destino
//   if (!destination) return columns; // se não houver destino, retorna o estado atual

//   // se a posição de origem e destino forem iguais, não faz nada
//   if (
//     source.droppableId === destination.droppableId &&
//     source.index === destination.index
//   )
//     return columns;

//   const startColumn = columns[source.droppableId];
//   const endColumn = columns[destination.droppableId];

//   // Movimento dentro da mesma coluna
//   if (startColumn === endColumn) {
//     const newTasks = Array.from(startColumn.tasks);
//     const [movedTask] = newTasks.splice(source.index, 1);
//     newTasks.splice(destination.index, 0, movedTask);

//     return {
//       ...columns,
//       [startColumn.id]: { ...startColumn, tasks: newTasks },
//     };
//   }

//   // Movimento entre colunas diferentes
//   const startTasks = Array.from(startColumn.tasks);
//   const [movedTask] = startTasks.splice(source.index, 1);
//   const endTasks = Array.from(endColumn.tasks);
//   endTasks.splice(destination.index, 0, movedTask);

//   return {
//     ...columns,
//     [startColumn.id]: { ...startColumn, tasks: startTasks },
//     [endColumn.id]: { ...endColumn, tasks: endTasks },
//   };
// };
