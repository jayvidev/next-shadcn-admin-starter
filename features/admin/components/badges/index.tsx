import { type VariantProps } from 'class-variance-authority'
import { Eye, type LucideIcon, Pencil, UserCog } from 'lucide-react'
import type React from 'react'

import { badgeVariants } from '@/components/ui/badge'

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

export type StatusBadgeMeta = {
  label: string
  icon: React.ReactNode
  variant: BadgeVariant
}

export const statusBadges: Record<string, StatusBadgeMeta> = {
  ACTIVO: {
    label: 'Activo',
    icon: <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />,
    variant: 'success',
  },
  INACTIVO: {
    label: 'Inactivo',
    icon: <span className="size-1.5 rounded-full border border-current" aria-hidden="true" />,
    variant: 'danger',
  },
}

export type Status = keyof typeof statusBadges

export type RoleBadgeMeta = {
  label: string
  icon: LucideIcon
  variant: BadgeVariant
}

export const userRoleBadges: Record<string, RoleBadgeMeta> = {
  ADMIN: {
    label: 'Admin',
    icon: UserCog,
    variant: 'warning',
  },
  EDITOR: {
    label: 'Editor',
    icon: Pencil,
    variant: 'info',
  },
  VIEWER: {
    label: 'Lector',
    icon: Eye,
    variant: 'active',
  },
}

export type UserRole = keyof typeof userRoleBadges
