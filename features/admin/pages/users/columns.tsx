'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Mail, Pencil, Trash } from 'lucide-react'

import { statusBadges, userRoleBadges } from '@admin/components/badges'
import {
  DataTableRowActions,
  type RowActionItem,
} from '@admin/components/data-table/data-table-row-actions'
import { withMetaLabelFilter } from '@admin/utils/components/with-meta-label-filter'
import { withMetaLabelHeader } from '@admin/utils/components/with-meta-label-header'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'

import type { DemoUser } from './data'
import { roleOptions, statusOptions } from './filter-options'

const includesFilter = (row: { getValue: (id: string) => unknown }, id: string, value: string[]) =>
  value.includes(String(row.getValue(id)))

interface UserColumnCallbacks {
  onDetail?: (user: DemoUser) => void
  onEdit?: (user: DemoUser) => void
  onDelete?: (user: DemoUser) => void
}

export const getColumns = (callbacks?: UserColumnCallbacks): ColumnDef<DemoUser>[] => {
  const { onDetail, onEdit, onDelete } = callbacks ?? {}
  return [
    {
      accessorKey: 'name',
      header: withMetaLabelHeader<DemoUser>(),
      cell: ({ row }) => {
        const name = row.original.name
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{name}</span>
          </div>
        )
      },
      meta: {
        searchable: true,
      },
    },
    {
      accessorKey: 'email',
      header: withMetaLabelHeader<DemoUser>(),
      cell: ({ getValue }) => {
        const email = getValue<string>()
        return (
          <div className="flex items-center gap-1.5">
            <Mail className="size-3.5 text-muted-foreground shrink-0" />
            <a href={`mailto:${email}`} className="hover:underline">
              {email}
            </a>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'role',
      header: withMetaLabelHeader<DemoUser>(),
      cell: ({ row }) => {
        const meta = userRoleBadges[row.original.role]
        if (!meta) return null
        const Icon = meta.icon
        return (
          <Badge variant={meta.variant}>
            <Icon />
            {meta.label}
          </Badge>
        )
      },
      enableSorting: false,
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
        ...withMetaLabelFilter<DemoUser>({
          columnId: 'role',
          options: roleOptions,
        }),
      },
      filterFn: includesFilter,
    },
    {
      accessorKey: 'status',
      header: withMetaLabelHeader<DemoUser>(),
      cell: ({ row }) => {
        const meta = statusBadges[row.original.status]
        if (!meta) return null
        return (
          <Badge variant={meta.variant}>
            {meta.icon}
            {meta.label}
          </Badge>
        )
      },
      enableSorting: false,
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
        ...withMetaLabelFilter<DemoUser>({
          columnId: 'status',
          options: statusOptions,
        }),
      },
      filterFn: includesFilter,
    },
    {
      accessorKey: 'createdAt',
      header: withMetaLabelHeader<DemoUser>(),
      cell: ({ getValue }) => {
        const date = new Date(getValue<string>())
        return (
          <span className="text-muted-foreground">
            {date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const items: RowActionItem[] = [
          {
            icon: Eye,
            label: 'Detalles',
            onClick: () => onDetail?.(row.original),
          },
          {
            icon: Pencil,
            label: 'Editar',
            onClick: () => onEdit?.(row.original),
          },
          {
            icon: Trash,
            label: 'Eliminar',
            onClick: () => onDelete?.(row.original),
            variant: 'destructive' as const,
          },
        ]
        return <DataTableRowActions items={items} />
      },
    },
  ]
}
