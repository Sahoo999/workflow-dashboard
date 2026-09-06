import {
  useEffect,
  useState,
} from "react";

import {
  approveApproval,
  getPendingApprovals,
  rejectApproval,
  type TaskApproval,
} from "../api/client";

function ApprovalsPage() {
  const [approvals, setApprovals] =
    useState<TaskApproval[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const loadApprovals = async () => {
    try {
      const data =
        await getPendingApprovals();

      setApprovals(data);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : String(err),
      );
    }
  };

  useEffect(() => {
  let cancelled = false;

  const load = async () => {
    try {
      const data = await getPendingApprovals();

      if (cancelled) {
        return;
      }

      setApprovals(data);
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

  const timeout = window.setTimeout(() => {
    void load();
  }, 0);

  const interval = window.setInterval(() => {
    void load();
  }, 3000);

  return () => {
    cancelled = true;
    window.clearTimeout(timeout);
    window.clearInterval(interval);
  };
}, []);

  const resolve = async (
    approvalId: string,
    action: "approve" | "reject",
  ) => {
    try {
      setBusyId(approvalId);

      if (action === "approve") {
        await approveApproval(
          approvalId,
          "admin",
        );
      } else {
        await rejectApproval(
          approvalId,
          "admin",
        );
      }

      await loadApprovals();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : String(err),
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            HUMAN-IN-THE-LOOP
          </div>

          <h1>Pending Approvals</h1>

          <p>
            Review and resume waiting tasks.
          </p>
        </div>

        <div className="summary-card">
          <span>PENDING</span>
          <strong>
            {approvals.length}
          </strong>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {approvals.length === 0 ? (
        <div className="workflow-card">
          <h2>
            No pending approvals
          </h2>

          <p style={{ color: "#71717a" }}>
            All approval requests have been
            resolved.
          </p>
        </div>
      ) : (
        <div className="approval-grid">
          {approvals.map(
            (approval) => (
              <div
                key={approval.id}
                className="approval-card"
              >
                <div className="approval-header">
                  <div>
                    <div className="approval-label">
                      APPROVAL
                    </div>

                    <div className="approval-id">
                      {approval.id}
                    </div>
                  </div>

                  <span className="approval-badge">
                    PENDING
                  </span>
                </div>

                <div className="approval-details">
                  <div>
                    <span>Task</span>
                    <code>
                      {approval.taskId}
                    </code>
                  </div>

                  <div>
                    <span>Requested</span>
                    <span>
                      {new Date(
                        approval.requestedAt,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="approval-actions">
                  <button
                    className="approve-button"
                    disabled={
                      busyId ===
                      approval.id
                    }
                    onClick={() =>
                      void resolve(
                        approval.id,
                        "approve",
                      )
                    }
                  >
                    {busyId ===
                    approval.id
                      ? "Working..."
                      : "Approve"}
                  </button>

                  <button
                    className="reject-button"
                    disabled={
                      busyId ===
                      approval.id
                    }
                    onClick={() =>
                      void resolve(
                        approval.id,
                        "reject",
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export default ApprovalsPage;