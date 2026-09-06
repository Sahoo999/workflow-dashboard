<div align="center">

# Durable Workflow Engine Dashboard

### Operations Control Plane for a Durable Workflow Engine

A production-style React dashboard for observing workflow definitions, executions, task dependencies, worker health, human approvals, retries, and dead-lettered tasks from a single operational interface.

**Live Demo:** https://workflow-dashboard-kappa.vercel.app

**Backend Engine:** https://github.com/Sahoo999/durable-workflow-engine

</div>

---

## Overview

The **Durable Workflow Engine Dashboard** is the visual control plane for my [Durable Workflow Engine](https://github.com/Sahoo999/durable-workflow-engine).

The engine is responsible for executing workflow tasks reliably in the background. This dashboard is responsible for making that execution **observable and manageable**.

Instead of exposing raw API responses or forcing an operator to inspect logs, the dashboard presents the system as an operational interface:

- Workflow definitions and versions
- Workflow runs and execution status
- Dependency-aware task graphs
- Individual task states
- Task attempts and execution history
- Pending human approvals
- Dead-letter queue entries
- Worker registration and heartbeat state
- API/engine availability

The result is a UI that behaves more like an internal **workflow operations console** than a typical CRUD application.

---

## Why I Built It

Background workflows are easy to start and difficult to operate reliably.

Once a workflow can contain multiple dependent tasks, retries, worker failures, approval gates, and permanently failed jobs, an engineering team needs more than an API. They need a clear way to answer questions such as:

> What is running right now?

> Which task is blocking the workflow?

> Did a task fail or is it waiting for a retry?

> Which workers are alive?

> Which workflows are waiting for human approval?

> Which tasks ended up in the dead-letter queue?

I built this dashboard to provide that operational visibility while keeping the workflow engine itself independent from the presentation layer.

---

## What the Dashboard Does

### 1. Workflow Overview

The main workflow screen presents registered workflows as an operational inventory.

Each workflow can be opened to inspect:

- Latest workflow version
- Workflow definition
- Configured tasks
- Dependencies
- Available workflow runs

This gives an operator a fast path from **workflow → execution**.

### 2. Workflow Run Monitoring

A workflow run has its own execution view.

The run page shows:

- Run ID
- Current workflow status
- Task execution graph
- Task-level states
- Dependency relationships
- Execution details

The graph gives a visual representation of how work moves through the workflow instead of presenting the execution as a flat table.

Example:

```text
A ───────► B ───────► C
         dependency
```

### 3. Task Attempts

Tasks can be executed more than once because of retry policies or recovery.

The dashboard exposes task-attempt information so an operator can understand execution history rather than seeing only the final task status.

### 4. Human-in-the-Loop Approvals

Some workflows should pause until a person makes a decision.

The **Pending Approvals** screen surfaces waiting tasks and provides operational actions for:

- Approve
- Reject

This connects the human decision directly to the workflow execution lifecycle.

### 5. Dead Letter Queue

Tasks that permanently fail after exhausting their retry policy can be moved to a dead-letter queue.

The dashboard provides a dedicated **Dead Letter Queue** view for investigating these failures and supporting replay/recovery workflows.

### 6. Worker Monitoring

The Workers screen shows the state of the worker pool, including:

- Worker identity
- Hostname
- Active/offline state
- Last heartbeat
- Start time

This gives operators visibility into the infrastructure responsible for executing queued tasks.

---

## Architecture

The dashboard is intentionally separated from the workflow engine.

```text
                         ┌─────────────────────────────┐
                         │      React Dashboard        │
                         │                             │
                         │  Workflows                  │
                         │  Runs                       │
                         │  Tasks                      │
                         │  Approvals                  │
                         │  Dead Letter Queue          │
                         │  Workers                    │
                         └──────────────┬──────────────┘
                                        │
                                     HTTPS API
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │    Durable Workflow Engine  │
                         │          Fastify             │
                         └──────────────┬──────────────┘
                                        │
                          ┌─────────────┴─────────────┐
                          │                           │
                          ▼                           ▼
                   ┌───────────────┐          ┌───────────────┐
                   │  PostgreSQL   │          │ Redis / Queue │
                   └───────────────┘          └───────┬───────┘
                                                      │
                                                      ▼
                                               ┌──────────────┐
                                               │    Workers   │
                                               └──────────────┘
```

The dashboard does not execute workflow tasks itself. It consumes the engine's API and turns durable execution state into a usable operator experience.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| **React** | UI and component architecture |
| **TypeScript** | Type-safe frontend development |
| **Vite** | Development and production build tooling |
| **React Router** | Client-side routing |
| **React Flow** | Workflow/run graph visualization |
| **Fetch API** | Communication with the workflow engine API |
| **Vercel** | Production frontend deployment |

The backend engine is a separate application built around Fastify, PostgreSQL, Redis/BullMQ, workers, durable task state, retries, recovery, approvals, and observability.

---

## Project Structure

```text
workflow-dashboard/
├── public/
├── src/
│   ├── api/
│   │   └── client.ts
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── RunGraph.tsx
│   │   └── TaskAttempts.tsx
│   ├── pages/
│   │   ├── WorkflowsPage.tsx
│   │   ├── WorkflowPage.tsx
│   │   ├── RunPage.tsx
│   │   ├── ApprovalsPage.tsx
│   │   ├── DeadLetterPage.tsx
│   │   └── WorkersPage.tsx
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Frontend ↔ Backend Integration

The frontend uses an environment-controlled API endpoint so local development and production can use the same application code.

```text
Local development
VITE_API_URL → http://localhost:3000

Production
VITE_API_URL → https://durable-workflow-engine-production.up.railway.app
```

This keeps the dashboard independent from a hard-coded local backend.

---

## Production Deployment

The dashboard is deployed on **Vercel**.

The workflow engine is deployed separately on **Railway**, together with PostgreSQL, Redis, and a background worker.

```text
Vercel
└── React Dashboard

Railway
├── Fastify API
├── PostgreSQL
├── Redis
└── Workflow Worker
```

This separation mirrors how a control plane and a background execution system can be deployed independently in a real engineering environment.

---

## Running Locally

### 1. Clone

```bash
git clone https://github.com/Sahoo999/workflow-dashboard.git
cd workflow-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API

Create `.env`:

```env
VITE_API_URL=http://localhost:3000
```

The backend engine must be running separately.

### 4. Start the dashboard

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

---

## Typical Operator Workflow

```text
1. Open Workflows
        ↓
2. Select a workflow
        ↓
3. Inspect its latest definition
        ↓
4. Open a workflow run
        ↓
5. Inspect the task graph
        ↓
6. Investigate task attempts/status
        ↓
7. Resolve approvals when required
        ↓
8. Inspect permanently failed work in the DLQ
        ↓
9. Check worker health when execution is delayed
```

The dashboard is designed around **operational investigation**, not simply data display.

---

## Example Operational Scenario

Imagine a workflow:

```text
Order Created
      │
      ▼
Validate Order
      │
      ▼
Reserve Inventory
      │
      ▼
Request Approval
      │
      ▼
Generate Invoice
```

An operator can use the dashboard to:

1. Find the workflow.
2. Open a specific run.
3. See which task is currently blocked.
4. Inspect the dependency chain.
5. Review task attempts.
6. Approve or reject a human-in-the-loop step.
7. Investigate permanently failed tasks in the DLQ.
8. Check worker availability when execution stops progressing.

---

## Design Goals

### Operational clarity
Important state should be visible without reading raw logs.

### Separation of concerns
The frontend is a control plane. The backend remains responsible for execution, persistence, queues, retries, recovery, and worker coordination.

### Failure visibility
Failures are first-class operational states, not hidden errors.

### Fast investigation
Operators should be able to move quickly from a workflow to a run, task, attempt, worker, approval, or dead-letter entry.

### Production-oriented presentation
The interface is designed to resemble an internal engineering operations console rather than a generic demo CRUD interface.

---

## Related Project

This repository is the frontend/control-plane companion to:

**Durable Workflow Engine**  
https://github.com/Sahoo999/durable-workflow-engine

The backend repository contains the core execution system, including durable workflow state, task scheduling, retries, worker coordination, approvals, dead-letter handling, and observability.

---

## Live Demo

<div align="center">

### 🚀 Try the Dashboard

**https://workflow-dashboard-kappa.vercel.app**

</div>

---

## Project Status

**Option A production deployment complete.**

Current deployment:

- React dashboard → Vercel
- Fastify API → Railway
- PostgreSQL → Railway
- Redis → Railway
- Background worker → Railway
- Production frontend-to-API configuration
- CI checks in the backend repository

---

## Author

<div align="center">

**Sahoo999**

Built from scratch as a practical exploration of durable workflow execution, asynchronous job processing, failure recovery, and operational tooling.

</div>
