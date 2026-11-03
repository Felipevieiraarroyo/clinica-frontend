import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const links = [
  {
    to: "/",
    label: "Dashboard",
    icon: "📊",
    end: true,
    roles: ["GERENCIA", "RECEPCIONISTA"],
  },
  {
    to: "/pacientes",
    label: "Pacientes",
    icon: "👥",
    end: false,
    roles: ["RECEPCIONISTA"],
  },
  {
    to: "/citas/nueva",
    label: "Nueva cita",
    icon: "📅",
    end: false,
    roles: ["RECEPCIONISTA"],
  },
  {
    to: "/historial",
    label: "Historial de citas",
    icon: "📋",
    end: false,
    roles: ["RECEPCIONISTA"],
  },
  {
    to: "/agenda-medica",
    label: "Mi agenda médica",
    icon: "🩺",
    end: false,
    roles: ["MEDICO"],
  },
];

export function Layout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();

  const linksPermitidos = links.filter((link) =>
    usuario ? link.roles.includes(usuario.rol) : false,
  );

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="flex w-full flex-col bg-slate-900 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Clínica Salud</h2>
          <p className="mt-1 text-sm text-slate-400">Sistema de gestión</p>
        </div>

        <div className="mb-6 rounded-lg bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Sesión activa</p>
          <p className="mt-1 font-semibold">{usuario?.nombre ?? "Usuario"}</p>
          <p className="mt-1 text-sm text-teal-300">
            {usuario?.rol ?? "Sin perfil"}
          </p>
        </div>

        <nav aria-label="Navegación principal">
          <ul className="flex flex-wrap gap-2 md:flex-col">
            {linksPermitidos.map((link) => (
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

        <div className="mt-6 border-t border-slate-700 pt-4 md:mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-medium text-slate-300 transition hover:bg-red-900 hover:text-white"
          >
            <span aria-hidden="true">🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
