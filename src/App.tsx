import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";

import WorkflowsPage from "./pages/WorkflowsPage";
import WorkflowPage from "./pages/WorkflowPage";
import RunPage from "./pages/RunPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import DeadLetterPage from "./pages/DeadLetterPage";
import WorkersPage from "./pages/WorkersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<WorkflowsPage />}
          />

          <Route
            path="/workflows/:name"
            element={<WorkflowPage />}
          />

          <Route
            path="/runs/:id"
            element={<RunPage />}
          />

          <Route
            path="/approvals"
            element={<ApprovalsPage />}
          />

          <Route
            path="/dead-letter"
            element={<DeadLetterPage />}
          />

          <Route
            path="/workers"
            element={<WorkersPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;