import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getWorkflow,
  getWorkflowRuns,
  type WorkflowRun,
} from "../api/client";

interface WorkflowVersion {
  id: string;
  version: number;
  definition: unknown;
  createdAt: string;
}

interface WorkflowResponse {
  workflow: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  latestVersion: WorkflowVersion | null;
}

function WorkflowPage() {
  const { name } = useParams();

  const [data, setData] =
    useState<WorkflowResponse | null>(
      null,
    );

  const [runs, setRuns] =
    useState<WorkflowRun[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      return;
    }

    Promise.all([
      getWorkflow(name),
      getWorkflowRuns(name),
    ])
      .then(([workflow, workflowRuns]) => {
        setData(workflow);
        setRuns(workflowRuns);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : String(err),
        );
      });
  }, [name]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <main style={{ padding: 32 }}>
      <Link to="/">
        ← Back to workflows
      </Link>

      <h1>{data.workflow.name}</h1>

      <p>
        Latest version:{" "}
        {data.latestVersion?.version ?? "None"}
      </p>

      <h2>Runs</h2>

      {runs.length === 0 ? (
        <p>No runs yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            maxWidth: 1000,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th align="left">Run ID</th>
              <th align="left">Status</th>
              <th align="left">Created</th>
              <th align="left">Action</th>
            </tr>
          </thead>

          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td>
                  {run.id}
                </td>

                <td>
                  {run.status}
                </td>

                <td>
                  {new Date(
                    run.createdAt,
                  ).toLocaleString()}
                </td>

                <td>
                  <Link
                    to={`/runs/${run.id}`}
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Latest Definition</h2>

      <pre>
        {JSON.stringify(
          data.latestVersion?.definition,
          null,
          2,
        )}
      </pre>
    </main>
  );
}

export default WorkflowPage;