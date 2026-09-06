import {
  useEffect,
  useState,
} from "react";

import {
  getTaskAttempts,
  type TaskAttempt,
} from "../api/client";

interface Props {
  taskId: string;
}

export function TaskAttempts({
  taskId,
}: Props) {
  const [attempts, setAttempts] =
    useState<TaskAttempt[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    getTaskAttempts(taskId)
      .then(setAttempts)
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : String(err),
        );
      });
  }, [taskId]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h3>Attempts</h3>

      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          style={{
            padding: 12,
            marginBottom: 8,
            border:
              "1px solid #27272a",
            borderRadius: 8,
          }}
        >
          <strong>
            Attempt #{attempt.attemptNumber}
          </strong>

          {" — "}

          {attempt.status}

          <div>
            Fencing token:{" "}
            {attempt.fencingToken}
          </div>

          {attempt.startedAt && (
            <div>
              Started:{" "}
              {new Date(
                attempt.startedAt,
              ).toLocaleString()}
            </div>
          )}

          {attempt.completedAt && (
            <div>
              Completed:{" "}
              {new Date(
                attempt.completedAt,
              ).toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}