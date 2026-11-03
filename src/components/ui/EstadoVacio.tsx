interface EstadoVacioProps {
  titulo: string;
  descripcion: string;
  accion?: {
    texto: string;
    onClick: () => void;
  };
}

export function EstadoVacio({ titulo, descripcion, accion }: EstadoVacioProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
        <span aria-hidden="true">📋</span>
      </div>

      <h3 className="font-semibold text-slate-800">{titulo}</h3>

      <p className="mt-2 text-sm text-slate-500">{descripcion}</p>

      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          {accion.texto}
        </button>
      )}
    </div>
  );
}
