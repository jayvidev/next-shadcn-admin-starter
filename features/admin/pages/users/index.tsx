'use client'

import { useMemo } from 'react'

import { toast } from 'sonner'

import { TableListLayout } from '@admin/components/shared/table-list-layout'

import { getColumns } from './columns'
import { demoUsers } from './data'

interface Props {
  title: string
  pathname: string
  resource: string
}

export default function UsersPage({ title, pathname, resource }: Props) {
  const columns = useMemo(
    () =>
      getColumns({
        onDetail: (user) => toast.info(`Detalles de ${user.name}`),
        onEdit: (user) => toast.info(`Editar a ${user.name}`),
        onDelete: (user) => toast.warning(`Eliminar a ${user.name}`),
      }),
    []
  )

  return (
    <TableListLayout
      columns={columns}
      data={demoUsers}
      resource={resource}
      title={title}
      description="Listado de usuarios con búsqueda, filtros y paginación (datos de prueba)."
      pathname={pathname}
    />
  )
}
