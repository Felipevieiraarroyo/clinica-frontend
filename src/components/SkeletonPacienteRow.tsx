export function SkeletonPacienteRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-48 rounded bg-slate-200" />
      </td>

      <td className="px-5 py-4">
        <div className="h-4 w-28 rounded bg-slate-200" />
      </td>

      <td className="px-5 py-4">
        <div className="h-4 w-24 rounded bg-slate-200" />
      </td>

      <td className="px-5 py-4">
        <div className="h-4 w-20 rounded bg-slate-200" />
      </td>
    </tr>
  );
}
