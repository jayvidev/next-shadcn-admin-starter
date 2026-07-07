import { ChartColumnBig, CircleQuestionMark, Component, Settings, Users } from 'lucide-react'

import { pageMap, type ValidUrl } from '@/config/page-map'

type SidebarVisualMeta = {
  icon: React.ElementType
  group: 'principal' | 'otros'
}

export const sidebarMap: Partial<Record<ValidUrl, SidebarVisualMeta>> = {}

const setSidebar = <T extends ValidUrl>(url: T, meta: SidebarVisualMeta) => {
  if (pageMap[url].showInSidebar) {
    sidebarMap[url] = meta
  }
}

setSidebar('/admin', { icon: ChartColumnBig, group: 'principal' })
setSidebar('/admin/componentes', { icon: Component, group: 'principal' })
setSidebar('/admin/usuarios', { icon: Users, group: 'principal' })

setSidebar('/admin/ajustes', { icon: Settings, group: 'otros' })
setSidebar('/admin/centro-de-ayuda', { icon: CircleQuestionMark, group: 'otros' })
