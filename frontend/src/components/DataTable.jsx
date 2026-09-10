const getId = (row) => row.id ?? row.id_libro ?? row.id_autor ?? row.id_usuario ?? row.id_rol ?? Object.entries(row).find(([key]) => key.startsWith("id_"))?.[1];

const formatValue = (value, column) => {
  if (value === null || value === undefined || value === "") return "-";
  if (column.type === "boolean") return value ? "Sí" : "No";
  if (column.type === "date" && typeof value === "string") return value.slice(0, 10);
  if (typeof value === "object") return value.nombre ?? value.name ?? JSON.stringify(value);
  return String(value);
};

export default function DataTable({ columns, rows, onEdit, onDelete, actions = [] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => <th key={column.name}>{column.label}</th>)}
            <th className="actions-heading">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="empty-cell">No hay registros para mostrar.</td></tr>
          ) : rows.map((row, index) => {
            const id = getId(row);
            return (
              <tr key={id ?? index}>
                {columns.map((column) => <td key={column.name}>{formatValue(row[column.name], column)}</td>)}
                <td className="row-actions">
                  {actions.filter((action) => !action.hidden?.(row)).map((action) => (
                    <button key={action.label} className={`button button-small ${action.variant || "button-muted"}`} onClick={() => action.onClick(row)}>{action.label}</button>
                  ))}
                  <button className="button button-small button-secondary" onClick={() => onEdit(row)}>Editar</button>
                  <button className="button button-small button-danger" onClick={() => onDelete(row)}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
