import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import RutaProtegida from "./components/RutaProtegida";
import { PaginaLogin } from "./pages/PaginaLogin";
import { PaginaDashboard } from "./pages/PaginaDashboard";
import { PaginaPacientes } from "./pages/PaginaPacientes";
import { PaginaDetallePaciente } from "./pages/PaginaDetallePaciente";
import { PaginaNuevaCita } from "./pages/PaginaNuevaCita";
import { PaginaNotFound } from "./pages/PaginaNotFound";
import { PaginaAcessoNegado } from "./pages/PaginaAcessoNegado";
import { PaginaHistorialCitas } from "./pages/PaginaHistorialCitas";
import { PaginaAgendaMedico } from "./pages/PaginaAgendaMedico";

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/sin-acceso" element={<PaginaAcessoNegado />} />

      {/* Todas as rotas abaixo exigem autenticação */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          {/* Dashboard: Gerencia e Recepcionista */}
          <Route
            element={
              <RutaProtegida rolesPermitidos={["GERENCIA", "RECEPCIONISTA"]} />
            }
          >
            <Route index element={<PaginaDashboard />} />
          </Route>

          {/* Pacientes e novas consultas: somente Recepcionista */}
          <Route
            element={<RutaProtegida rolesPermitidos={["RECEPCIONISTA"]} />}
          >
            <Route path="pacientes" element={<PaginaPacientes />} />
            <Route path="pacientes/:id" element={<PaginaDetallePaciente />} />
            <Route path="citas/nueva" element={<PaginaNuevaCita />} />
            <Route path="historial" element={<PaginaHistorialCitas />} />
          </Route>

          {/* Somente Gerencia e Admin podem acessar os relatórios */}
          <Route
            element={<RutaProtegida rolesPermitidos={["GERENCIA", "ADMIN"]} />}
          >
            <Route path="reportes" element={<Navigate to="/" replace />} />
          </Route>
          <Route element={<RutaProtegida rolesPermitidos={["MEDICO"]} />}>
            <Route path="agenda-medica" element={<PaginaAgendaMedico />} />
          </Route>

          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
