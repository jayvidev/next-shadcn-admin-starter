'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Column } from '@tanstack/react-table'
import { ListFilter } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

const formatNumber = (value: number) =>
  new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value)

interface DataTablePriceRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  min?: number
  max?: number
  step?: number
  prefix?: string
  formatDisplay?: (value: number) => string
}

export function DataTablePriceRangeFilter<TData, TValue>({
  column,
  title,
  min = 0,
  max = 1000000,
  step = 100,
  prefix = '$',
  formatDisplay = formatNumber,
}: DataTablePriceRangeFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as [number, number] | undefined
  const isActive = filterValue !== undefined && filterValue !== null

  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<[number, number]>([
    filterValue?.[0] ?? min,
    filterValue?.[1] ?? max,
  ])

  useEffect(() => {
    if (!filterValue) {
      setRange([min, max])
    } else {
      setRange([filterValue[0], filterValue[1]])
    }
  }, [filterValue, min, max])

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (value) {
      setRange([filterValue?.[0] ?? min, filterValue?.[1] ?? max])
    }
  }

  const applyFilter = useCallback(
    (newRange: [number, number]) => {
      if (newRange[0] <= min && newRange[1] >= max) {
        column?.setFilterValue(undefined)
      } else {
        column?.setFilterValue(newRange)
      }
    },
    [column, min, max]
  )

  const handleSliderChange = (value: number[]) => {
    setRange([value[0], value[1]])
  }

  const handleSliderCommit = (value: number[]) => {
    applyFilter([value[0], value[1]])
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-full', !isActive && 'text-muted-foreground')}>
          <ListFilter />
          {title}
          {isActive && (
            <>
              <span className="flex-1 flex justify-center">
                <Separator orientation="vertical" className="mx-2 h-4" />
              </span>
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {prefix}
                {formatDisplay(filterValue[0])} - {prefix}
                {formatDisplay(filterValue[1])}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 gap-0" align="start">
        <div className="py-4 px-4 space-y-4">
          <div className="flex items-center gap-2">
            <RangeInput
              value={range[0]}
              prefix={prefix}
              min={min}
              max={range[1]}
              formatDisplay={formatDisplay}
              onCommit={(val) => {
                const newRange: [number, number] = [val, range[1]]
                setRange(newRange)
                applyFilter(newRange)
              }}
            />
            <span className="text-muted-foreground text-xs shrink-0">-</span>
            <RangeInput
              value={range[1]}
              prefix={prefix}
              min={range[0]}
              max={max}
              formatDisplay={formatDisplay}
              onCommit={(val) => {
                const newRange: [number, number] = [range[0], val]
                setRange(newRange)
                applyFilter(newRange)
              }}
            />
          </div>

          <Slider
            min={min}
            max={max}
            step={step}
            value={range}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
          />
        </div>

        <Separator />
        <div className="p-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!isActive}
            className="w-full justify-center text-sm font-normal h-8"
            onClick={() => {
              column?.setFilterValue(undefined)
              setRange([min, max])
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface RangeInputProps {
  value: number
  prefix: string
  min: number
  max: number
  formatDisplay: (value: number) => string
  onCommit: (value: number) => void
}

function RangeInput({ value, prefix, min, max, formatDisplay, onCommit }: RangeInputProps) {
  const [rawText, setRawText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayed = isFocused ? rawText : formatDisplay(value)

  return (
    <InputGroup className="flex-1">
      {prefix && (
        <InputGroupAddon>
          <InputGroupText>{prefix}</InputGroupText>
        </InputGroupAddon>
      )}
      <InputGroupInput
        ref={inputRef}
        inputMode="numeric"
        value={displayed}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/\D/g, '')
          setRawText(cleaned)
        }}
        onFocus={() => {
          setIsFocused(true)
          setRawText(value > 0 ? String(value) : '')
        }}
        onBlur={() => {
          const parsed = rawText ? Number(rawText) : min
          const clamped = Math.min(Math.max(parsed, min), max)
          onCommit(clamped)
          setRawText('')
          setIsFocused(false)
        }}
        className="text-xs"
      />
    </InputGroup>
  )
}
