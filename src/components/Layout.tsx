import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/pacientes", label: "Pacientes", icon: "👥", end: false },
  { to: "/citas/nueva", label: "Nueva cita", icon: "📅", end: false },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="w-full bg-slate-900 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Clínica Salud</h2>
          <p className="mt-1 text-sm text-slate-400">Sistema de gestión</p>
        </div>

        <nav aria-label="Navegación principal">
          <ul className="flex flex-wrap gap-2 md:flex-col">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
                      isActive
                        ? "bg-teal-700 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <span aria-hidden="true">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
