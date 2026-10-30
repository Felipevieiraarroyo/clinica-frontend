interface SpinnerProps {
  fullscreen?: boolean;
}

export function Spinner({ fullscreen = false }: SpinnerProps) {
  const spinner = (
    <div
      role="status"
      aria-label="Carregando"
      className="flex items-center justify-center"
    >
      <div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700" />
      <span className="sr-only">Carregando...</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center p-4">{spinner}</div>;
}
