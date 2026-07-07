export function calculateObjectPropertyFacets<T>(
  data: T[],
  accessor: string | ((row: T) => Record<string, unknown>),
  propertyKeys?: string[]
): Map<string, number> {
  const facets = new Map<string, number>()

  data.forEach((row) => {
    const columnValue =
      typeof accessor === 'function' ? accessor(row) : getNestedValue(row, accessor)

    if (columnValue && typeof columnValue === 'object') {
      const obj = columnValue as Record<string, unknown>
      const keys = propertyKeys || Object.keys(obj)

      keys.forEach((key) => {
        const value = obj[key]
        if (typeof value === 'number') {
          const currentCount = facets.get(key) || 0
          facets.set(key, currentCount + value)
        }
      })
    }
  })

  return facets
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

export function createObjectSumFacetCalculator<T>(
  accessor: string | ((row: T) => Record<string, unknown>),
  propertyKeys?: string[]
) {
  return (data: T[]): Map<string, number> => {
    return calculateObjectPropertyFacets(data, accessor, propertyKeys)
  }
}
