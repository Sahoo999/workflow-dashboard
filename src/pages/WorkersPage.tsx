import {
  useEffect,
  useState,
} from "react";

import {
  getWorkers,
  type Worker,
} from "../api/client";

function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setWorkers(await getWorkers());
        setError(null);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : String(err),
        );
      }
    };

    void load();

    const interval = window.setInterval(
      () => void load(),
      3000,
    );

    return () => window.clearInterval(interval);
  }, []);

  const visibleWorkers = [...workers]
  .sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime(),
  )
  .slice(0, 12);

  const activeWorkers = workers.filter(
    (worker) => worker.status === "ACTIVE",
  ).length;

  const offlineWorkers = workers.filter(
    (worker) => worker.status === "OFFLINE",
  ).length;

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            INFRASTRUCTURE
          </div>

          <h1>Workers</h1>

          <p>
            Live worker registration and
            heartbeat state.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <div className="summary-card">
            <span>ACTIVE</span>
            <strong>{activeWorkers}</strong>
          </div>

          <div className="summary-card">
            <span>OFFLINE</span>
            <strong>{offlineWorkers}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="worker-grid">
        {visibleWorkers.map((worker) => (
          <div
            key={worker.id}
            className="worker-card"
          >
            <div className="worker-header">
              <div>
                <strong>
                  {worker.workerKey}
                </strong>

                <div className="worker-host">
                  {worker.hostname ?? "Unknown host"}
                </div>
              </div>

              <span
                className={`worker-state ${
                  worker.status === "ACTIVE"
                    ? "worker-active"
                    : "worker-offline"
                }`}
              >
                <span className="status-dot" />
                {worker.status}
              </span>
            </div>

            <div className="worker-meta">
              <div>
                <span>
                  Last heartbeat
                </span>

                <strong>
                  {worker.lastHeartbeatAt
                    ? new Date(
                        worker.lastHeartbeatAt,
                      ).toLocaleString()
                    : "Never"}
                </strong>
              </div>

              <div>
                <span>Started</span>

                <strong>
                  {worker.startedAt
                    ? new Date(
                        worker.startedAt,
                      ).toLocaleString()
                    : "Unknown"}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkersPage;