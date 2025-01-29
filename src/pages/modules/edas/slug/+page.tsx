import React from 'react'
import { Navigate } from 'react-router'
import { SlugCollaboratorContext } from './+layout'

export default function SlugEdaPage() {
  const ctx = React.useContext(SlugCollaboratorContext)

  return (
    <Navigate to={`/m/edas/${ctx.collaborator.username}/${ctx.years[0].id}`} />
  )
}
