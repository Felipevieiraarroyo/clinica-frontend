import { Link } from "react-router-dom";

export function PaginaNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-extrabold text-teal-700">🔎404</p>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Página no encontrada
      </h1>

      <p className="mt-2 text-slate-500">
        Lo sentimos, la página que buscas no existe.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
      >
        Ir al inicio
      </Link>
    </main>
  );
}
