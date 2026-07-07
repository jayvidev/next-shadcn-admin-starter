import * as React from 'react'

import { Column, Table } from '@tanstack/react-table'
import { Check, ListFilter } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  }[]
  table?: Table<TData>
  isServerSide?: boolean
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  table,
  isServerSide = false,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const customFacetCalculator = column?.columnDef.meta?.customFacetCalculator

  const filteredRowModel = table?.getFilteredRowModel()

  const facets = React.useMemo(() => {
    if (customFacetCalculator && table && column && filteredRowModel) {
      const allRows = filteredRowModel.rows.map((row) => row.original)
      const result = customFacetCalculator(allRows)
      return result
    }
    return column?.getFacetedUniqueValues()
  }, [column, customFacetCalculator, filteredRowModel, table])

  const rawFilterValue = column?.getFilterValue() as string[] | undefined
  const selectedValues = new Set(rawFilterValue?.map(String))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(selectedValues.size === 0 && 'text-muted-foreground')}
        >
          <ListFilter />
          {title}
          {selectedValues.size > 0 && (
            <>
              <span className="flex-1 flex justify-center">
                <Separator orientation="vertical" className="mx-2 h-4" />
              </span>
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} seleccionados
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(String(option.value)))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optionValue = String(option.value)
                const isSelected = selectedValues.has(optionValue)
                const rawCount = facets?.get(option.value) ?? facets?.get(optionValue)
                const facetCount = typeof rawCount === 'number' ? rawCount : 0

                return (
                  <CommandItem
                    key={optionValue}
                    className="[&>svg:last-child]:hidden"
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(optionValue)
                      } else {
                        selectedValues.add(optionValue)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(filterValues.length ? filterValues : undefined)
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className={cn('size-4 text-primary-foreground')} />
                    </div>
                    {option.icon &&
                      (React.isValidElement(option.icon)
                        ? option.icon
                        : (() => {
                            const Icon = option.icon as React.ComponentType<{
                              className?: string
                            }>
                            return <Icon className="text-muted-foreground" />
                          })())}
                    <span>{option.label}</span>
                    {facetCount > 0 && !isServerSide && (
                      <span className="ml-auto flex size-4 items-center justify-center text-xs">
                        {facetCount}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center [&>svg]:hidden"
                  >
                    Limpiar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
