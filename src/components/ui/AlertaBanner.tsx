type TipoAlerta = "info" | "success" | "warning" | "error";

interface AlertaBannerProps {
  tipo: TipoAlerta;
  mensaje: string;
  titulo?: string;
}

const estilos: Record<TipoAlerta, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

export function AlertaBanner({ tipo, mensaje, titulo }: AlertaBannerProps) {
  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className={`rounded-xl border p-4 ${estilos[tipo]}`}
    >
      {titulo && <p className="font-semibold">{titulo}</p>}
      <p className={titulo ? "mt-1 text-sm" : "text-sm"}>{mensaje}</p>
    </div>
  );
}
