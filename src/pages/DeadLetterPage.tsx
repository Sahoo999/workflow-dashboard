import { useEffect, useState } from "react";

import {
  getDeadLetterTasks,
  type DeadLetterTask,
  replayDeadLetterTask,
} from "../api/client";


function DeadLetterPage() {
  const [entries, setEntries] =
    useState<DeadLetterTask[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    getDeadLetterTasks()
      .then(setEntries)
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : String(err),
        );
      });
  }, []);

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            OPERATIONS
          </div>

          <h1>Dead Letter Queue</h1>

          <p>
            Permanently failed tasks requiring
            investigation or replay.
          </p>
        </div>

        <div className="summary-card">
          <span>FAILED TASKS</span>
          <strong>{entries.length}</strong>
        </div>
      </div>

      

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="workflow-card">
          <h2>No dead-letter tasks</h2>

          <p style={{ color: "#71717a" }}>
            Everything is currently healthy.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="workflow-card"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#71717a",
                    }}
                  >
                    TASK
                  </div>

                  <h2
                    style={{
                      margin:
                        "6px 0 12px",
                    }}
                  >
                    {entry.taskId}
                  </h2>
                </div>

                <div className="run-status status-failed">
                  FAILED
                </div>
              </div>

              <pre
                style={{
                  margin: 0,
                  padding: 14,
                  borderRadius: 10,
                  overflowX: "auto",
                  background: "#09090b",
                  color: "#a1a1aa",
                  fontSize: 12,
                }}
              >
                {JSON.stringify(
                  entry.reason,
                  null,
                  2,
                )}
              </pre>

              <div
                style={{
                  marginTop: 12,
                  color: "#71717a",
                  fontSize: 12,
                }}
              >
                Created{" "}
                {new Date(
                  entry.createdAt,
                ).toLocaleString()}

                {entries.length > 0 && (
  <div
    style={{
      display: "grid",
      gap: 14,
    }}
  >
    {entries.map((entry) => (
      <div
        key={entry.id}
        className="workflow-card"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#71717a",
              }}
            >
              TASK
            </div>

            <h2
              style={{
                margin: "6px 0 10px",
              }}
            >
              {entry.taskId}
            </h2>
          </div>

          <div className="run-status status-failed">
            FAILED
          </div>
        </div>

        <pre
          style={{
            margin: 0,
            padding: 14,
            borderRadius: 10,
            overflowX: "auto",
            background: "#09090b",
            color: "#a1a1aa",
            fontSize: 12,
          }}
        >
          {JSON.stringify(
            entry.reason,
            null,
            2,
          )}
        </pre>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginTop: 16,
          }}
        >
          <span
            style={{
              color: "#71717a",
              fontSize: 12,
            }}
          >
            {new Date(
              entry.createdAt,
            ).toLocaleString()}
          </span>

          <button
            className="approve-button"
            onClick={async () => {
              try {
                await replayDeadLetterTask(
                  entry.taskId,
                );

                setEntries((current) =>
                  current.filter(
                    (item) =>
                      item.id !== entry.id,
                  ),
                );
              } catch (err: unknown) {
                setError(
                  err instanceof Error
                    ? err.message
                    : String(err),
                );
              }
            }}
          >
            Replay
          </button>
        </div>
      </div>
    ))}
  </div>
)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeadLetterPage;