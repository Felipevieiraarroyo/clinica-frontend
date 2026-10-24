import { Link } from "react-router-dom";

export function PaginaAcessoNegado() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-red-600">403</p>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Acceso denegado
      </h1>

      <p className="mt-2 max-w-md text-slate-600">
        Tu perfil no tiene permiso para acceder a esta página. Si necesitas
        acceso, contacta con el administrador del sistema.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
