import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import type { RunTask } from "../api/client";

interface RunGraphProps {
  tasks: RunTask[];
}

const statusStyle = (
  status: string,
): React.CSSProperties => {
  switch (status) {
    case "COMPLETED":
      return {
        border: "2px solid #22c55e",
        background: "#052e16",
      };

    case "RUNNING":
      return {
        border: "2px solid #3b82f6",
        background: "#172554",
      };

    case "FAILED":
      return {
        border: "2px solid #ef4444",
        background: "#450a0a",
      };

    case "WAITING":
      return {
        border: "2px solid #eab308",
        background: "#422006",
      };

    case "QUEUED":
      return {
        border: "2px solid #a855f7",
        background: "#2e1065",
      };

    default:
      return {
        border: "2px solid #64748b",
        background: "#0f172a",
      };
  }
};

export function RunGraph({
  tasks,
}: RunGraphProps) {
  const nodes: Node[] = tasks.map(
    (task, index) => ({
      id: task.taskKey,
      position: {
        x: (index % 3) * 260,
        y: Math.floor(index / 3) * 150,
      },
      data: {
  label: (
    <div style={{ minWidth: 180 }}>
      <strong>{task.taskKey}</strong>

      <div
        style={{
          fontSize: 13,
          marginTop: 6,
          opacity: 0.8,
        }}
      >
        {task.taskType}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        {task.status}
      </div>
    </div>
  ),
},
      style: {
        color: "#fff",
        borderRadius: 12,
        padding: 14,
        ...statusStyle(task.status),
      },
    }),
  );

  const edges: Edge[] = tasks.flatMap(
    (task) =>
      task.dependsOn.map((dependency) => ({
        id: `${dependency}-${task.taskKey}`,
        source: dependency,
        target: task.taskKey,
        animated:
          task.status === "RUNNING",
      })),
  );

  return (
    <div
      style={{
        width: "100%",
        height: 680,
        border: "1px solid #27272a",
        background: "#0b0d12",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}