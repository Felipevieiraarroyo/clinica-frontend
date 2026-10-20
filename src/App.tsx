import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RotaProtegida } from "./components/RutaProtegida";
import { PaginaLogin } from "./pages/PaginaLogin";
import { PaginaDashboard } from "./pages/PaginaDashboard";
import { PaginaPacientes } from "./pages/PaginaPacientes";
import { PaginaDetallePaciente } from "./pages/PaginaDetallePaciente";
import { PaginaNuevaCita } from "./pages/PaginaNuevaCita";
import { PaginaNotFound } from "./pages/PaginaNotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<PaginaDashboard />} />
          <Route path="/pacientes" element={<PaginaPacientes />} />
          <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
          <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
