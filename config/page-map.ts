type PageMeta = {
  title: string
  authOnly?: boolean
  showInSidebar?: boolean
  resource?: string
}

export const pageMap: Record<string, PageMeta> = {
  '/admin': { title: 'Dashboard', authOnly: true, showInSidebar: true },
  '/admin/componentes': { title: 'Componentes', authOnly: true, showInSidebar: true },
  '/admin/usuarios': {
    title: 'Usuarios',
    authOnly: true,
    showInSidebar: true,
    resource: 'usuarios',
  },

  '/admin/ajustes': { title: 'Ajustes', authOnly: true, showInSidebar: true },
  '/admin/ajustes/cuenta': { title: 'Cuenta', authOnly: true },
  '/admin/ajustes/apariencia': { title: 'Apariencia', authOnly: true },
  '/admin/ajustes/notificaciones': { title: 'Notificaciones', authOnly: true },
  '/admin/ajustes/visualizacion': { title: 'Visualización', authOnly: true },

  '/admin/centro-de-ayuda': { title: 'Centro de ayuda', authOnly: true, showInSidebar: true },

  '/error/401': { title: 'Acceso no autorizado' },
  '/error/403': { title: 'Acceso denegado' },
  '/error/404': { title: 'Página no encontrada' },
  '/error/500': { title: 'Algo salió mal' },
  '/error/503': { title: 'Sitio en mantenimiento' },
} as const

export type ValidUrl = keyof typeof pageMap
