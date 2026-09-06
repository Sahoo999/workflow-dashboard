import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getRun,
  getRunTasks,
} from "../api/client";

import { RunGraph } from "../components/RunGraph";
import { TaskAttempts } from "../components/TaskAttempts";

import type { RunTask } from "../api/client";

interface Run {
  id: string;
  workflowVersionId: string;
  status: string;
  input: unknown;
  output: unknown;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function RunPage() {
  const { id } = useParams();

  const [run, setRun] =
    useState<Run | null>(null);

  const [tasks, setTasks] =
    useState<RunTask[]>([]);
    
  const [selectedTask, setSelectedTask] =
    useState<RunTask | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const [runData, taskData] =
          await Promise.all([
            getRun(id),
            getRunTasks(id),
          ]);

        if (cancelled) {
          return;
        }

        setRun(runData);
        setTasks(taskData);
        setError(null);
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : String(err),
        );
      }
    };

    void load();

    const interval = window.setInterval(
      () => {
        void load();
      },
      2000,
    );


    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!run) {
    return <p>Loading...</p>;
  }

  return (
    <main style={{ padding: 32 }}>
    <Link to="/">
      ← Workflows
    </Link>

    <div className="run-header">
      <div>
        <div className="eyebrow">
          WORKFLOW RUN
        </div>

        <h1>Execution Details</h1>

        <div className="run-id">
          {run.id}
        </div>
      </div>

      <div
        className={`run-status status-${run.status.toLowerCase()}`}
      >
        <span className="status-dot" />
        {run.status}
      </div>
    </div>

    <h2>Workflow Graph</h2>

      <RunGraph tasks={tasks} />

      <h2 style={{ marginTop: 32 }}>
        Tasks
      </h2>

      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() =>
              setSelectedTask(task)
            }
            style={{
              padding: 16,
              border: "1px solid #27272a",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <strong>
              {task.taskKey}
            </strong>

            {" — "}

            {task.taskType}

            {" — "}

            {task.status}

            {task.dependsOn.length > 0 && (
              <div
                style={{
                  marginTop: 6,
                }}
              >
                Depends on:{" "}
                {task.dependsOn.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTask && (
        <section
          style={{
            marginTop: 32,
          }}
        >
          <h2>
            Task: {selectedTask.taskKey}
          </h2>

          <p>
            Status: {selectedTask.status}
          </p>

          <p>
            Type: {selectedTask.taskType}
          </p>

          <TaskAttempts
            taskId={selectedTask.id}
          />
        </section>
      )}

      {selectedTask && (
  <div className="task-panel-overlay">
    <aside className="task-panel">
      <button
        className="task-panel-close"
        onClick={() =>
          setSelectedTask(null)
        }
      >
        ×
      </button>

      <div className="eyebrow">
        TASK DETAILS
      </div>

      <h2>
        {selectedTask.taskKey}
      </h2>

      <div className="task-panel-status">
        {selectedTask.status}
      </div>

      <div className="task-panel-section">
        <span>Type</span>
        <strong>
          {selectedTask.taskType}
        </strong>
      </div>

      <div className="task-panel-section">
        <span>Task ID</span>
        <code>
          {selectedTask.id}
        </code>
      </div>

      <div className="task-panel-section">
        <span>Dependencies</span>
        <strong>
          {selectedTask.dependsOn.length
            ? selectedTask.dependsOn.join(
                ", ",
              )
            : "None"}
        </strong>
      </div>

      <TaskAttempts
        taskId={selectedTask.id}
      />
    </aside>
  </div>
)}
    </main>
  );
}



export default RunPage;

