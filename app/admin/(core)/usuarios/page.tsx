import type { Metadata } from 'next'

import UsersPage from '@admin/pages/users'

import { pageMap } from '@/config/page-map'

const PATHNAME = '/admin/usuarios'
const page = pageMap[PATHNAME]

const title = page.title

export const metadata: Metadata = {
  title,
}

export default function Page() {
  return <UsersPage title={title} pathname={PATHNAME} resource={page.resource ?? 'usuarios'} />
}
