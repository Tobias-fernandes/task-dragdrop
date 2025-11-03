import WebSocket, { WebSocketServer, type RawData } from "ws";
import { initialTasksData } from "./src/store/tasks/constants";
import type { ITasks, ITask } from "./src/shared/types/tasks";

const PORT = 3999;

// Cliente com campo extra 'id' usado apenas localmente
type Client = WebSocket & { id?: string };

// Lista de tarefas armazenadas (inicializada a partir do store)
let tasks = initialTasksData;

// Helper para enviar o estado atual para todos os clientes
const broadcastTasks = () => {
  const payload = JSON.stringify({ type: "tasks_update", tasks });
  wss.clients.forEach((c) => {
    const other = c as WebSocket;
    if (other.readyState === WebSocket.OPEN) other.send(payload);
  });
};

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws: WebSocket) => {
  const client = ws as Client;
  client.id = Date.now().toString(); // id simples para cada cliente
  console.log(`Cliente conectado: ${client.id}`);

  // Envia para o cliente o estado inicial de tarefas
  client.send(JSON.stringify({ type: "init", tasks }));

  // Quando o cliente envia uma mensagem (esperamos JSON com { type, payload })
  client.on("message", (message: RawData) => {
    try {
      const data = JSON.parse(message.toString());
      const { type, payload } = data;
      console.log(`Mensagem recebida: ${type}`);

      switch (type) {
        case "get":
          client.send(JSON.stringify({ type: "init", tasks }));
          break;


        case "addTask": {
          const { columnId, task } = payload as {
            columnId: keyof ITasks;
            task: ITask;
          };
          if (!tasks[columnId]) {
            console.warn(`Coluna ${String(columnId)} não encontrada`);
            break;
          }
          tasks = {
            ...tasks,
            [columnId]: {
              ...tasks[columnId],
              tasks: [...tasks[columnId].tasks, task],
            },
          } as ITasks;
          broadcastTasks();
          break;
        }

        case "removeTask": {
          const { columnId, taskId } = payload as {
            columnId: keyof ITasks;
            taskId: string;
          };
          if (!tasks[columnId]) break;
          tasks = {
            ...tasks,
            [columnId]: {
              ...tasks[columnId],
              tasks: tasks[columnId].tasks.filter((t: ITask) => t.id !== taskId),
            },
          } as ITasks;
          broadcastTasks();
          break;
        }

        case "createColumn": {
          const { id, title } = payload as { id: string; title: string };
          if (!id || !title) break;
          tasks = {
            ...tasks,
            [id]: { id, title, tasks: [] },
          };
          broadcastTasks();
          break;
        }

        case "clear": {
          // Preserve the same columns but clear their task arrays
          const newTasks = {} as ITasks;
          for (const key in tasks) {
            const k = key as keyof ITasks;
            newTasks[k] = { ...tasks[k], tasks: [] } as ITasks[typeof k];
          }
          tasks = newTasks;
          broadcastTasks();
          break;
        }

        case "reorder": {
          // payload expected: { source: { droppableId, index }, destination: { droppableId, index } }
          type DropRef = { droppableId: keyof ITasks; index: number };
          const { source, destination } = payload as {
            source: DropRef;
            destination: DropRef | null;
          };
          if (!destination) break;
          const sourceCol = tasks[source.droppableId];
          const destCol = tasks[destination.droppableId];
          const sourceTasks = Array.from(sourceCol.tasks);
          const destTasks = Array.from(destCol.tasks);
          const [movedTask] = sourceTasks.splice(source.index, 1);

          if (source.droppableId === destination.droppableId) {
            sourceTasks.splice(destination.index, 0, movedTask);
            tasks = {
              ...tasks,
              [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
            };
          } else {
            destTasks.splice(destination.index, 0, movedTask);
            tasks = {
              ...tasks,
              [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
              [destination.droppableId]: { ...destCol, tasks: destTasks },
            };
          }
          broadcastTasks();
          break;
        }

        default:
          console.warn("Unknown message type:", type);
      }
    } catch (err) {
      console.error("Invalid message payload", err);
    }
  });

  client.on("close", () => {
    console.log(`Cliente desconectado: ${client.id}`);
  });
});

console.log(`Servidor WebSocket rodando na porta ${PORT}`);
