
import { useEffect, useRef } from "react";
import { useTaskStore } from "@/store/tasks";
import type { ITasks } from "@/shared/types/tasks";

import { setSend } from "@/lib/wsClient";

const WS_URL = (typeof window !== "undefined" && window.location.hostname === "localhost")
  ? "ws://localhost:3999"
  : "ws://localhost:3999";

/**
 * React hook that keeps a websocket connection open and applies server updates
 * to the local Zustand store. It also returns a `send` function to dispatch
 * actions to the server.
 *
 * Mount this once at the top level of the drag-drop page (for example in
 * `src/dragdrop/page.tsx` or in your layout for that route).
 */
export default function useWsTasks() {
  const wsRef = useRef<WebSocket | null>(null);

  const send = (obj: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Connect once
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      // Request current tasks on connect
      ws.send(JSON.stringify({ type: "get" }));
    });

    ws.addEventListener("message", (ev) => {
      try {
        const data = JSON.parse(ev.data as string) as {
          type: string;
          tasks?: unknown;
        };
        const { type, tasks } = data;
        if (type === "init" || type === "tasks_update") {
          // Update the Zustand store with the server snapshot
          // useTaskStore.setState merges at the root; we only replace the `state` key
          useTaskStore.setState({ state: { tasks: tasks as ITasks } });
        }
      } catch (err) {
        // ignore malformed messages
        console.warn("ws message parse failed", err);
      }
    });

    ws.addEventListener("close", () => {
      wsRef.current = null;
    });

    // expose send to other modules so they can dispatch actions via the
    // single websocket connection created here (e.g. DragDrop hook)
    setSend(send);

    return () => {
      ws.close();
      wsRef.current = null;
      // restore a noop sender
  setSend(() => false);
    };
  }, []);

  return { send, wsRef } as const;
}
