'use client'

import { useState } from 'react'

import { Table } from '@tanstack/react-table'
import { Filter, Search, X } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { getColumnLabel } from '@admin/config/column-labels'

import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { FilterOption } from '@/lib/types'

import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTablePriceRangeFilter } from './data-table-price-range-filter'
import { DataTableRangeFilter } from './data-table-range-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface ExternalSearch {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  resource: string
  isServerSide?: boolean
  externalSearch?: ExternalSearch
}

export function DataTableToolbar<TData>({
  table,
  resource,
  isServerSide = false,
  externalSearch,
}: DataTableToolbarProps<TData>) {
  const hasColumnFilters = table.getState().columnFilters.length > 0
  const isFiltered = externalSearch
    ? externalSearch.value.length > 0 || hasColumnFilters
    : hasColumnFilters

  const searchCol = externalSearch
    ? undefined
    : table.getAllLeafColumns().find((col) => col.columnDef.meta?.searchable)

  const dateRangeCols = table
    .getAllLeafColumns()
    .filter((col) => col.columnDef.meta?.dateRangeFilter)

  const filterCols = table.getAllLeafColumns().filter((col) => col.columnDef.meta?.filter)
  const priceRangeCols = table
    .getAllLeafColumns()
    .filter((col) => col.columnDef.meta?.priceRangeFilter)
  const rangeFilterCols = table.getAllLeafColumns().filter((col) => col.columnDef.meta?.rangeFilter)

  const hasAnyFilter =
    filterCols.length > 0 ||
    priceRangeCols.length > 0 ||
    rangeFilterCols.length > 0 ||
    dateRangeCols.length > 0

  const searchValue =
    (searchCol ? (table.getColumn(searchCol.id)?.getFilterValue() as string) : '') ?? ''

  const [dateRanges, setDateRanges] = useState<Record<string, DateRange | null>>(() => {
    const initial: Record<string, DateRange | null> = {}
    dateRangeCols.forEach((col) => {
      const filterValue = col.getFilterValue() as [Date, Date] | undefined
      if (filterValue && filterValue[0] && filterValue[1]) {
        initial[col.id] = { from: filterValue[0], to: filterValue[1] }
      }
    })
    return initial
  })

  const handleDateSelect = (columnId: string, range: DateRange | undefined) => {
    const updatedDateRanges = { ...dateRanges }
    if (!range || (!range.from && !range.to)) {
      updatedDateRanges[columnId] = null
      table.getColumn(columnId)?.setFilterValue(undefined)
      setDateRanges(updatedDateRanges)
      return
    }
    updatedDateRanges[columnId] = range
    setDateRanges(updatedDateRanges)
    if (range.from && range.to) {
      table.getColumn(columnId)?.setFilterValue([range.from, range.to])
    } else if (range.from) {
      table.getColumn(columnId)?.setFilterValue([range.from, range.from])
    }
  }

  const handleReset = () => {
    if (externalSearch) externalSearch.onChange('')
    table.resetColumnFilters()
    setDateRanges({})
  }

  const renderFilterControls = (compact = false) => (
    <>
      {filterCols.map((col) => {
        const { title, options } = col.columnDef.meta!.filter! as {
          title: string
          options: FilterOption[]
        }
        return (
          <div key={col.id} className={compact ? 'w-full [&>button]:w-full' : undefined}>
            <DataTableFacetedFilter
              column={col}
              title={title}
              options={options}
              table={table}
              isServerSide={isServerSide}
            />
          </div>
        )
      })}

      {priceRangeCols.map((col) => {
        const meta = col.columnDef.meta?.priceRangeFilter
        const config = typeof meta === 'object' ? meta : {}
        return (
          <div key={col.id} className={compact ? 'w-full [&>button]:w-full' : undefined}>
            <DataTablePriceRangeFilter
              column={col}
              title={getColumnLabel(resource, col.id)}
              {...config}
            />
          </div>
        )
      })}

      {rangeFilterCols.map((col) => {
        const config = col.columnDef.meta?.rangeFilter ?? {}
        return (
          <div key={col.id} className={compact ? 'w-full [&>button]:w-full' : undefined}>
            <DataTableRangeFilter
              column={col}
              title={getColumnLabel(resource, col.id)}
              {...config}
            />
          </div>
        )
      })}

      {dateRangeCols.map((col) => (
        <div key={col.id} className={compact ? 'w-full [&>button]:w-full' : undefined}>
          <DateRangePicker
            value={dateRanges[col.id] || undefined}
            onDateSelect={(range) => handleDateSelect(col.id, range)}
            placeholder={`Rango de ${getColumnLabel(resource, col.id).toLowerCase()}`}
          />
        </div>
      ))}
    </>
  )

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {externalSearch && (
          <div className="relative">
            <Input
              placeholder={externalSearch.placeholder ?? 'Buscar…'}
              className="pl-9 pr-4 h-8 w-47.5 lg:w-67.5 text-sm"
              value={externalSearch.value}
              onChange={(e) => externalSearch.onChange(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        )}
        {searchCol && !externalSearch && (
          <div className="relative">
            <Input
              placeholder={`Buscar por ${getColumnLabel(resource, searchCol.id).toLowerCase()}…`}
              className="pl-9 pr-4 h-8 w-47.5 lg:w-67.5 text-sm"
              value={searchValue}
              onChange={(e) => table.getColumn(searchCol.id)?.setFilterValue(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        )}

        {hasAnyFilter && (
          <>
            <div className="hidden sm:contents">{renderFilterControls()}</div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="sm:hidden h-8 gap-1.5 border-dashed">
                  <Filter className="size-3.5" />
                  Filtros
                  {hasColumnFilters && (
                    <span className="ml-0.5 rounded-full bg-primary text-primary-foreground text-[10px]  w-4 h-4 flex items-center justify-center">
                      {table.getState().columnFilters.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl max-h-[85dvh] overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-center">Filtros</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-8">
                  <div className="grid grid-cols-2 gap-3">{renderFilterControls(true)}</div>
                  {isFiltered && (
                    <Button
                      variant="outline"
                      className="border-dashed w-full mt-4"
                      onClick={handleReset}
                    >
                      Resetear filtros
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}

        {isFiltered && (
          <Button className="hidden sm:flex border-dashed" variant="outline" onClick={handleReset}>
            Resetear
            <X />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button variant="outline" className="text-destructive hover:text-destructive">
            Eliminar ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <DataTableViewOptions table={table} resource={resource} />
      </div>
    </div>
  )
}
