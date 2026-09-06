import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import { getWorkflows } from "../api/client";
import type { Workflow } from "../types/workflow";

function WorkflowsPage() {
  const [workflows, setWorkflows] =
    useState<Workflow[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    getWorkflows()
      .then(setWorkflows)
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
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            CONTROL PLANE
          </div>

          <h1>
            Workflow Overview
          </h1>

          <p>
            Monitor definitions, executions,
            dependencies and failures.
          </p>
        </div>

        <div className="summary-card">
          <span>WORKFLOWS</span>
          <strong>{workflows.length}</strong>
        </div>
      </section>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <section className="workflow-grid">
        {workflows.map((workflow) => (
          <Link
            key={workflow.id}
            to={`/workflows/${encodeURIComponent(
              workflow.name,
            )}`}
            className="workflow-card"
          >
            <div className="workflow-card-top">
              <span className="workflow-icon">
                W
              </span>

              <span className="workflow-arrow">
                →
              </span>
            </div>

            <h2>
              {workflow.name}
            </h2>

            <div className="workflow-meta">
              <span>
                Updated
              </span>

              <span>
                {new Date(
                  workflow.updatedAt,
                ).toLocaleString()}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default WorkflowsPage;