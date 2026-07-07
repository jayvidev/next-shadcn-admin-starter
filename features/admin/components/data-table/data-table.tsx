'use client'

import * as React from 'react'

import type {
  OnChangeFn,
  PaginationState,
  Row,
  SortingState as SortingStateType,
} from '@tanstack/react-table'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useRouter } from 'nextjs-toploader/app'

import { getColumnLabel } from '@admin/config/column-labels'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { EmptyTableState } from './data-table-empty-state'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const createSmartFilter = <TData,>() => {
  return (row: Row<TData>, columnId: string, filterValue: string) => {
    if (!filterValue) return true

    const cellValue = row.getValue(columnId)
    if (cellValue === null) return false

    const normalizedCellValue = normalizeText(String(cellValue))
    const normalizedFilterValue = normalizeText(String(filterValue))

    return normalizedCellValue.includes(normalizedFilterValue)
  }
}

export interface ServerPaginationProps {
  pageIndex: number
  pageSize: number
  pageCount: number
  totalElements: number
  onPaginationChange: OnChangeFn<PaginationState>
  onFiltersChange?: (filters: ColumnFiltersState) => void
  initialFilters?: ColumnFiltersState
  sorting?: SortingStateType
  onSortingChange?: OnChangeFn<SortingStateType>
}

interface ExternalSearch {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  resource: string
  getRowHref?: (row: TData) => string
  onRowClick?: (row: TData) => void
  isFetchingData?: boolean
  serverPagination?: ServerPaginationProps
  externalSearch?: ExternalSearch
}

export function DataTable<TData, TValue>({
  columns,
  data,
  resource,
  getRowHref,
  onRowClick,
  isFetchingData = false,
  serverPagination,
  externalSearch,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const isServerPaginated = !!serverPagination
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => (isServerPaginated && serverPagination.initialFilters) || []
  )
  const pendingFiltersNotify = React.useRef<ColumnFiltersState | null>(null)

  React.useEffect(() => {
    if (!isServerPaginated || !serverPagination.initialFilters) return
    const next = serverPagination.initialFilters
    setColumnFilters((prev) => {
      const prevJson = JSON.stringify(prev)
      const nextJson = JSON.stringify(next)
      return prevJson === nextJson ? prev : next
    })
  }, [isServerPaginated, serverPagination?.initialFilters])

  React.useEffect(() => {
    if (pendingFiltersNotify.current !== null) {
      const filters = pendingFiltersNotify.current
      pendingFiltersNotify.current = null
      if (isServerPaginated && serverPagination.onFiltersChange) {
        serverPagination.onFiltersChange(filters)
      }
    }
  })

  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const sorting =
    isServerPaginated && serverPagination.sorting ? serverPagination.sorting : internalSorting
  const onSortingChange =
    isServerPaginated && serverPagination.onSortingChange
      ? serverPagination.onSortingChange
      : setInternalSorting
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  })

  const pagination = isServerPaginated
    ? { pageIndex: serverPagination.pageIndex, pageSize: serverPagination.pageSize }
    : internalPagination
  const onPaginationChange = isServerPaginated
    ? serverPagination.onPaginationChange
    : setInternalPagination

  const enhancedColumns = React.useMemo(() => {
    return columns.map((column): ColumnDef<TData, TValue> => {
      const meta = {
        ...column.meta,
        resource,
      }

      if (meta?.filter) {
        const filter = { ...meta.filter }
        const filterColumnId: string =
          filter.columnId ?? column.id ?? (column as { accessorKey?: string }).accessorKey ?? ''

        if (!filter.title) {
          filter.title = getColumnLabel(resource, filterColumnId)
        }

        filter.columnId = filterColumnId
        meta.filter = filter
      }

      const updatedColumn: ColumnDef<TData, TValue> = {
        ...column,
        meta,
      }

      if (column.meta?.searchable) {
        updatedColumn.filterFn = createSmartFilter<TData>()
      }

      return updatedColumn
    })
  }, [columns, resource])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    onColumnFiltersChange: (updater) => {
      setColumnFilters((prev) => {
        const newFilters = typeof updater === 'function' ? updater(prev) : updater
        pendingFiltersNotify.current = newFilters
        return newFilters
      })
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: isServerPaginated,
    manualFiltering: isServerPaginated,
    manualSorting: isServerPaginated && !!serverPagination.onSortingChange,
    pageCount: isServerPaginated ? serverPagination.pageCount : undefined,
    rowCount: isServerPaginated ? serverPagination.totalElements : undefined,
    getFilteredRowModel: isServerPaginated ? undefined : getFilteredRowModel(),
    getPaginationRowModel: isServerPaginated ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableRowSelection: true,
    autoResetPageIndex: false,
  })

  return (
    <>
      <div className="space-y-4">
        <DataTableToolbar
          table={table}
          resource={resource}
          isServerSide={isServerPaginated}
          externalSearch={externalSearch}
        />
        <div
          className={cn(
            'rounded-md border transition-opacity duration-200',
            isFetchingData && 'opacity-50'
          )}
        >
          {table.getRowModel().rows?.length === 0 ? (
            <EmptyTableState resource={resource} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={cn('px-4', header.column.columnDef.meta?.headerClass)}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row, index) => {
                    const rowHref = getRowHref?.(row.original)
                    const isClickable = !!rowHref || !!onRowClick

                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={cn('table-row-animate', isClickable && 'cursor-pointer')}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => {
                          if (rowHref) {
                            router.push(rowHref)
                          } else {
                            onRowClick?.(row.original)
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn('px-4', cell.column.columnDef.meta?.cellClass)}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <div className="sticky bottom-0 z-10 bg-background py-4 ">
        <DataTablePagination table={table} />
      </div>
    </>
  )
}
