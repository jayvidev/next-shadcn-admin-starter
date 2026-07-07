import { CircleCheck, CircleSlash, Eye, Shield, ShieldCheck } from 'lucide-react'

import type { FilterOption } from '@/lib/types'

export const roleOptions: FilterOption[] = [
  { value: 'ADMIN', label: 'Admin', icon: ShieldCheck },
  { value: 'EDITOR', label: 'Editor', icon: Shield },
  { value: 'VIEWER', label: 'Lector', icon: Eye },
]

export const statusOptions: FilterOption[] = [
  { value: 'ACTIVO', label: 'Activo', icon: CircleCheck },
  { value: 'INACTIVO', label: 'Inactivo', icon: CircleSlash },
]
