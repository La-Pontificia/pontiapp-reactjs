import { Outlet, useParams } from 'react-router'

export default function SlugCollaboratorsLayout() {
  const params = useParams<{
    slug: string
  }>()
  return (
    <div>
      {params.slug}
      <Outlet />
    </div>
  )
}
