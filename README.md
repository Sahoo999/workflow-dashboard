<div align="center">

# Durable Workflow Engine Dashboard

**Operations Control Plane for Durable Workflow Execution**

A focused React control plane for inspecting **workflow definitions, runs, task graphs, retries, approvals, dead-lettered work, and worker health** from one operational surface.

[**🚀 Live Demo**](https://workflow-dashboard-kappa.vercel.app) · [**⚙️ Workflow Engine**](https://github.com/Sahoo999/durable-workflow-engine)

</div>

---

## Why this exists

Reliable background execution is only half the problem.

Once work becomes asynchronous and durable, engineers also need to answer:

- What is running right now?
- Which task is blocked?
- What failed, and how many times?
- Is a workflow waiting for a human decision?
- Are workers alive and sending heartbeats?
- Which tasks were exhausted and moved to the dead-letter queue?

This repository is the **observability and operations layer** for my [Durable Workflow Engine](https://github.com/Sahoo999/durable-workflow-engine).

The engine owns execution.
This dashboard makes that execution **visible, navigable, and operable**.

The [live demo](https://workflow-dashboard-kappa.vercel.app) is seeded with two example runs: a pipeline that succeeds, retries, and dead-letters a task, and a workflow paused on a pending human approval — so every page above has real state to look at rather than an empty list.

---

## Product view

The UI is intentionally built around an operator's path through a failure or execution state:

```text
Workflow
   ↓
Run
   ↓
Task graph
   ↓
Task state
   ↓
Attempts / retries
   ↓
Approval or DLQ
   ↓
Worker health
```

Instead of exposing raw JSON or asking an engineer to piece together state from logs, the dashboard turns the engine's durable state into a small operational control plane.

---

## Core capabilities

| Area | What you can see / do |
|---|---|
| **Workflows** | Browse registered workflows, inspect the latest version, definition, tasks, and dependencies |
| **Runs** | Open individual executions and inspect their current lifecycle state |
| **Workflow graph** | Visualize task dependencies and execution state with React Flow |
| **Task attempts** | Inspect execution history across retries and repeated attempts |
| **Approvals** | Surface human-in-the-loop work and approve or reject pending tasks |
| **Dead Letter Queue** | Investigate tasks that permanently failed after exhausting retries |
| **Workers** | Monitor worker identity, state, hostname, heartbeat, and start time |
| **API connectivity** | Surface backend availability and fetch failures directly in the control plane |

---

## The architecture

The frontend is deliberately kept separate from the execution engine.

```text
                    ┌──────────────────────────────┐
                    │      React Dashboard         │
                    │                              │
                    │  Workflows                   │
                    │  Runs / Tasks                │
                    │  Graphs                      │
                    │  Approvals                   │
                    │  Dead Letter Queue            │
                    │  Workers                      │
                    └──────────────┬───────────────┘
                                   │
                              REST / HTTPS
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │    Durable Workflow Engine   │
                    │            Fastify            │
                    └──────────────┬───────────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     │                           │
                     ▼                           ▼
              ┌──────────────┐           ┌──────────────┐
              │  PostgreSQL  │           │ Redis/BullMQ │
              └──────────────┘           └──────┬───────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │   Workers    │
                                         └──────────────┘
```

### Separation of responsibilities

**Dashboard**
- Reads operational state
- Visualizes execution
- Surfaces failures and waiting states
- Provides operator actions for approvals/recovery workflows

**Workflow Engine**
- Persists workflow and task state
- Schedules dependency-aware work
- Queues tasks
- Executes tasks on workers
- Handles retries, heartbeats, fencing, recovery, approvals, and DLQ behavior

This boundary keeps the UI replaceable without coupling it to the execution runtime.

---

## A concrete execution story

Imagine an order workflow:

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

The dashboard lets an operator move through the lifecycle of one run:

**1. Find the workflow**
Open the workflow definition and confirm the task graph.

**2. Open a run**
Inspect the run ID and current overall state.

**3. Read the graph**
See task dependencies and which nodes have completed, are pending, or are blocked.

**4. Inspect attempts**
Understand whether a task failed once, retried, or exhausted its retry policy.

**5. Handle human intervention**
Approve or reject a pending approval without leaving the control plane.

**6. Investigate permanent failures**
Use the dead-letter queue as the operational boundary for work that needs investigation or replay.

**7. Check workers**
Confirm that the execution layer is alive and heartbeating when progress is delayed.

You can walk through this exact flow right now on the [live demo](https://workflow-dashboard-kappa.vercel.app) — open `demo-pipeline`'s run to see a completed graph with one dead-lettered task, or check `/approvals` for a real pending request.

---

## Engineering choices

### React + TypeScript

The dashboard is written in TypeScript so API models, component contracts, and application state remain explicit instead of becoming a collection of untyped JSON responses.

### React Router

The UI is organized around operational resources rather than a single page:

```text
/                       Workflows overview
/workflows/:name        Workflow definition, versions, runs
/runs/:id               Run detail — graph, tasks, attempts
/approvals               Pending human approvals
/dead-letter              Dead Letter Queue
/workers                 Worker health
```

This keeps navigation predictable as the control plane grows.

Since this is a client-side-rendered single-page app, the deployment includes a `vercel.json` rewrite so that a direct visit or hard refresh on any of these paths (e.g. sharing a link straight to `/approvals`) is served `index.html` and handled by the router, rather than returning a 404 from Vercel's static host:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### React Flow

Workflow execution is naturally a graph problem. React Flow (`@xyflow/react`) is used to render task nodes and dependency edges so the operator can understand execution topology at a glance.

### Environment-driven API configuration

The dashboard does not hard-code the production backend into the application. It reads the backend URL from a build-time environment variable, falling back to a local default:

```env
VITE_API_URL=http://localhost:3000
```

Local development can point at the local engine, while production uses:

```env
VITE_API_URL=https://durable-workflow-engine-production.up.railway.app
```

Since Vite inlines environment variables at **build time**, changing `VITE_API_URL` on a hosting provider requires a fresh build/redeploy — restarting the existing build has no effect.

---

## Technology

```text
Frontend
├── React 19
├── TypeScript
├── Vite
├── React Router
└── React Flow (@xyflow/react)

Backend integration
└── Fastify REST API

Production
├── Vercel      → Dashboard
└── Railway     → Workflow Engine / PostgreSQL / Redis / Worker
```

---

## Project structure

```text
src/
├── api/
│   └── client.ts              # API boundary
├── components/
│   ├── Layout.tsx             # Application shell / navigation
│   ├── RunGraph.tsx            # Workflow execution graph
│   └── TaskAttempts.tsx        # Attempt history
├── pages/
│   ├── WorkflowsPage.tsx
│   ├── WorkflowPage.tsx
│   ├── RunPage.tsx
│   ├── ApprovalsPage.tsx
│   ├── DeadLetterPage.tsx
│   └── WorkersPage.tsx
├── types/
├── App.tsx
└── main.tsx

vercel.json                    # SPA rewrite for direct/refreshed routes
```

---

## Run locally

### Prerequisites

- Node.js
- The [Durable Workflow Engine](https://github.com/Sahoo999/durable-workflow-engine) running locally, seeded via its own `npm run seed:demo` if you want example data instead of an empty dashboard

### Install

```bash
git clone https://github.com/Sahoo999/workflow-dashboard.git
cd workflow-dashboard
npm install
```

### Configure the backend URL

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:3000
```

### Start

```bash
npm run dev
```

### Production build

```bash
npm run build
```

---

## Production

The dashboard is deployed as a static React application on Vercel and connects to the separately deployed workflow engine on Railway.

```text
Vercel
  └── workflow-dashboard
          │
          │ HTTPS
          ▼
Railway
  └── durable-workflow-engine
       ├── Fastify API
       ├── PostgreSQL
       ├── Redis
       └── Worker
```

Deploying your own copy on Vercel requires setting `VITE_API_URL` as a **Production** (and Preview) environment variable pointing at your own backend's public URL, then triggering a build — see [Environment-driven API configuration](#environment-driven-api-configuration) above for why a rebuild is required.

### Live

**Dashboard:**
https://workflow-dashboard-kappa.vercel.app

**Engine repository:**
https://github.com/Sahoo999/durable-workflow-engine

---

## What this project demonstrates

This repository is intentionally more than a visual frontend exercise.

It demonstrates how to build a control plane around an asynchronous system where the important UI state is derived from:

- durable workflow state
- task state transitions
- dependency relationships
- retry attempts
- human approval state
- dead-letter state
- worker liveness

The interesting part is not just rendering the data. It is **turning distributed execution state into something an engineer can reason about quickly**.

---

## Related repository

### Durable Workflow Engine

The backend execution system lives in a separate repository:

**https://github.com/Sahoo999/durable-workflow-engine**

That repository contains the core runtime for durable workflow execution, including task orchestration, Redis/BullMQ dispatch, PostgreSQL persistence, worker execution, retries, recovery, approvals, dead-letter handling, and observability. It also includes a seed script (`npm run seed:demo`) that registers example workflows and starts runs against them — the same data shown on the live demo above.

This repository is the **control plane that sits on top of it**.

---

<div align="center">

### Built for engineers who need to see the system, not just run it.

</div>
