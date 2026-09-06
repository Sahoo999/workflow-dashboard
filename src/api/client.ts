import type { Workflow } from "../types/workflow";


const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000";

export const getWorkflows =
  async (): Promise<Workflow[]> => {
    const response = await fetch(
      `${API_URL}/workflows`,
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch workflows",
      );
    }

    return response.json();
  };

export const getWorkflow = async (
  name: string,
) => {
  const response = await fetch(
    `${API_URL}/workflows/${encodeURIComponent(name)}`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch workflow",
    );
  }

  return response.json();
};

export interface WorkflowRun {
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

export const getWorkflowRuns = async (
  workflowName: string,
): Promise<WorkflowRun[]> => {
  const response = await fetch(
    `${API_URL}/workflows/${encodeURIComponent(
      workflowName,
    )}/runs`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch workflow runs",
    );
  }

  return response.json();
};

export interface RunTask {
  id: string;
  workflowRunId: string;
  taskKey: string;
  taskType: string;
  status: string;
  input: unknown;
  output: unknown;
  dependsOn: string[];
  maxAttempts: number;
  backoffType: string;
  timeoutMs: number | null;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getRun = async (
  runId: string,
): Promise<WorkflowRun> => {
  const response = await fetch(
    `${API_URL}/runs/${encodeURIComponent(runId)}`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch workflow run",
    );
  }

  return response.json();
};

export const getRunTasks = async (
  runId: string,
): Promise<RunTask[]> => {
  const response = await fetch(
    `${API_URL}/runs/${encodeURIComponent(runId)}/tasks`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch run tasks",
    );
  }

  return response.json();
};

export interface TaskApproval {
  id: string;
  taskId: string;
  status: string;
  requestedAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
}

export const getPendingApprovals =
  async (): Promise<TaskApproval[]> => {
    const response = await fetch(
      `${API_URL}/approvals`,
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch approvals",
      );
    }

    return response.json();
  };

  export interface DeadLetterTask {
  id: string;
  taskId: string;
  reason: unknown;
  createdAt: string;
}

  export const getDeadLetterTasks =
  async () => {
    const response = await fetch(
      `${API_URL}/dead-letter`,
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch dead-letter tasks",
      );
    }

    return response.json();
  };

  export interface Worker {
  id: string;
  workerKey: string;
  status: string;
  hostname: string | null;
  lastHeartbeatAt: string | null;
  startedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getWorkers =
  async (): Promise<Worker[]> => {
    const response = await fetch(
      `${API_URL}/workers`,
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch workers",
      );
    }

    return response.json();
  };

  export interface TaskAttempt {
  id: string;
  taskId: string;
  attemptNumber: number;
  status: string;
  workerId: string | null;
  fencingToken: number;
  input: unknown;
  output: unknown;
  error: unknown;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export const getTaskAttempts = async (
  taskId: string,
): Promise<TaskAttempt[]> => {
  const response = await fetch(
    `${API_URL}/tasks/${encodeURIComponent(
      taskId,
    )}/attempts`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch task attempts",
    );
  }

  return response.json();
};

export const approveApproval = async (
  approvalId: string,
  resolvedBy: string,
): Promise<TaskApproval> => {
  const response = await fetch(
    `${API_URL}/approvals/${encodeURIComponent(
      approvalId,
    )}/approve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resolvedBy,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to approve task",
    );
  }

  return response.json();
};

export const rejectApproval = async (
  approvalId: string,
  resolvedBy: string,
): Promise<TaskApproval> => {
  const response = await fetch(
    `${API_URL}/approvals/${encodeURIComponent(
      approvalId,
    )}/reject`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resolvedBy,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to reject task",
    );
  }

  return response.json();
};

export const replayDeadLetterTask =
  async (
    taskId: string,
  ): Promise<{
    taskId: string;
    status: string;
  }> => {
    const response = await fetch(
      `${API_URL}/dead-letter/${encodeURIComponent(
        taskId,
      )}/replay`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error(
        "Failed to replay dead-letter task",
      );
    }

    return response.json();
  };