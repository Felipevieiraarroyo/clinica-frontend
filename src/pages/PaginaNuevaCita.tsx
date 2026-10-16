import { useNavigate } from "react-router-dom";
import { FormularioCita } from "../components/FormularioCita";

export function PaginaNuevaCita() {
  const navigate = useNavigate();

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Nueva cita médica</h1>
        <p className="mt-2 text-slate-500">
          Registra una nueva consulta para un paciente.
        </p>
      </header>

      <FormularioCita />

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
      >
        ← Volver
      </button>
    </main>
  );
}
