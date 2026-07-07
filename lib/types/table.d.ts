import '@tanstack/react-table'

export type ColumnFilterMeta = {
  columnId?: string
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

declare module '@tanstack/react-table' {
  interface ColumnMeta {
    filter?: ColumnFilterMeta
    searchable?: boolean
    dateRangeFilter?: boolean
    priceRangeFilter?:
      | boolean
      | {
          min?: number
          max?: number
          step?: number
          prefix?: string
          formatDisplay?: (value: number) => string
        }
    rangeFilter?: {
      min?: number
      max?: number
      step?: number
      suffix?: string
    }
    cellClass?: string
    headerClass?: string
    customFacetCalculator?: (data: unknown[]) => Map<string, number>
    resource?: string
  }
}
