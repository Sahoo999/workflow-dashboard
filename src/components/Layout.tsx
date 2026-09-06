import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>

          <div>
            <div className="brand-title">
              Durable Engine
            </div>

            <div className="brand-subtitle">
              Workflow Control Plane
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>⌂</span>
            Workflows
          </NavLink>

          <NavLink
            to="/approvals"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>◈</span>
            Approvals
          </NavLink>

          <NavLink
            to="/dead-letter"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>⚠</span>
            Dead Letter Queue
          </NavLink>
        </nav>

        <NavLink
  to="/workers"
  className={({ isActive }) =>
    `nav-item ${isActive ? "active" : ""}`
  }
>
  <span>◉</span>
  Workers
</NavLink>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot online" />
            Engine Online
          </div>
        </div>
      </aside>

      <section className="main-shell">
        <header className="topbar">
          <div>
            <div className="topbar-label">
              WORKFLOW CONTROL
            </div>

            <div className="topbar-title">
              Operations
            </div>
          </div>

          <div className="topbar-right">
            <span className="api-status">
              API
              <span className="status-dot online" />
            </span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default Layout;