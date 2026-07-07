export const columnLabelsByResource: Record<string, Record<string, string>> = {
  usuarios: {
    name: 'Nombre',
    email: 'Correo electrónico',
    role: 'Rol',
    status: 'Estado',
    createdAt: 'Fecha de registro',
  },
}

export function getColumnLabel(resource: string | undefined, columnId: string): string {
  if (!resource) return columnId
  return columnLabelsByResource[resource]?.[columnId] ?? columnId
}
