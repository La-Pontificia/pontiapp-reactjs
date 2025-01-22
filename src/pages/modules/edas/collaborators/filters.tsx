import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
import { Job } from '~/types/job'
import {
  Button,
  Combobox,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Option
} from '@fluentui/react-components'
import { Broom20Filled, Dismiss24Regular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { FiltersValues } from './+page'
import React from 'react'
import { Area } from '~/types/area'
import { UserRole } from '~/types/user-role'

// const managers = {
//   has: 'Con jefes',
//   not: 'Sin jefes'
// }

// const schedules = {
//   has: 'Con horarios',
//   not: 'Sin horarios'
// }

export default function CollaboratorsFilters({
  sidebarIsOpen,
  setSidebarIsOpen,
  setFilters,
  filters
}: {
  sidebarIsOpen: boolean
  setSidebarIsOpen: (isOpen: boolean) => void
  setFilters: React.Dispatch<React.SetStateAction<FiltersValues>>
  filters: FiltersValues
}) {
  const { user } = useAuth()
  const [userRoleId, setUserRoleId] = React.useState<string | undefined | null>(
    filters.role
  )
  const [areaId, setAreaId] = React.useState<string | undefined | null>(
    filters.area
  )
  const [jobId, setJobId] = React.useState<string | undefined | null>(
    filters.job
  )
  // const [hasManager, setHasManager] = React.useState<string | undefined | null>(
  //   filters.hasManager
  // )
  // const [hasSchedules, setHasSchedules] = React.useState<
  //   string | undefined | null
  // >(filters.hasSchedules)

  const { data: areas, isLoading: isAreasLoading } = useQuery<Area[]>({
    queryKey: ['Allareas'],
    queryFn: async () => {
      const res = await api.get<Area[]>('partials/areas/all')
      if (!res.ok) return []
      return res.data.map((area) => new Area(area))
    }
  })

  const { data: jobs, isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get<Job[]>('partials/jobs/all')
      if (!res.ok) return []
      return res.data.map((job) => new Job(job))
    }
  })

  const { data: userRoles, isLoading: isUserRolesLoading } = useQuery<
    UserRole[]
  >({
    queryKey: ['rolesUsers'],
    queryFn: async () => {
      const res = await api.get<UserRole[]>('partials/user-roles/all')
      if (!res.ok) return []
      return res.data.map((r) => new UserRole(r))
    }
  })
  const roleValue = userRoles?.find((r) => r.id === userRoleId)?.title
  const jobValue = jobs?.find((j) => j.id === jobId)?.name
  const areaValue = areas?.find((a) => a.id === areaId)?.name
  // const hasManagerValue =
  //   hasManager === 'has'
  //     ? managers.has
  //     : hasManager === 'not'
  //     ? managers.not
  //     : undefined
  // const hasSchedulesValue =
  //   hasSchedules === 'has'
  //     ? schedules.has
  //     : hasSchedules === 'not'
  //     ? schedules.not
  //     : undefined

  const handleApplyFilters = () => {
    setSidebarIsOpen(false)
    setFilters((prev) => ({
      ...prev,
      role: userRoleId ?? null,
      area: areaId ?? null,
      job: jobId ?? null
      // hasManager: hasManager ?? null,
      // hasSchedules: hasSchedules ?? null
    }))
  }

  return (
    <Drawer
      position="end"
      separator
      className="xl:min-w-[35svw] sm:min-w-[50svw] max-w-full min-w-full"
      open={sidebarIsOpen}
      onOpenChange={(_, { open }) => setSidebarIsOpen(open)}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Dismiss24Regular />}
              onClick={() => setSidebarIsOpen(false)}
            />
          }
        >
          Agrega filtros a tu búsqueda
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody className="flex flex-col">
        <div className="flex-grow">
          <div className="col-span-2 pt-10 pb-2">Básico</div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Tipo de usuario" className="w-full">
              <Combobox
                selectedOptions={[userRoleId ? userRoleId : '']}
                onOptionSelect={(_, e) => setUserRoleId(e.optionValue)}
                input={{
                  autoComplete: 'off'
                }}
                value={roleValue ?? ''}
                disabled={isUserRolesLoading}
                placeholder="-- Todos --"
              >
                {userRoles?.map((r) =>
                  r.isDeveloper && !user.isDeveloper ? null : (
                    <Option text={r.title} key={r.id} value={r.id}>
                      {r.title}
                    </Option>
                  )
                )}
              </Combobox>
            </Field>
          </div>
          <div className="col-span-2 pt-10 pb-2">Organizacion</div>
          <div className="grid gap-5">
            <Field label="Area" className="w-full">
              <Combobox
                selectedOptions={[areaId ? areaId : '']}
                onOptionSelect={(_, e) => setAreaId(e.optionValue)}
                input={{
                  autoComplete: 'off'
                }}
                className="w-full"
                value={areaValue ?? ''}
                disabled={isAreasLoading}
                placeholder="-- Todos --"
              >
                {areas?.map((a) =>
                  a.isDeveloper && !user.isDeveloper ? null : (
                    <Option text={a.name} key={a.id} value={a.id}>
                      {a.name}
                    </Option>
                  )
                )}
              </Combobox>
            </Field>
            <Field label="Puesto">
              <Combobox
                selectedOptions={[jobId ? jobId : '']}
                onOptionSelect={(_, e) => setJobId(e.optionValue)}
                input={{
                  autoComplete: 'off'
                }}
                value={jobValue ?? ''}
                disabled={isJobsLoading}
                placeholder="-- Todos --"
              >
                {jobs?.map((j) =>
                  j.isDeveloper && !user.isDeveloper ? null : (
                    <Option text={j.name} key={j.id} value={j.id}>
                      {j.name}
                    </Option>
                  )
                )}
              </Combobox>
            </Field>
            {/* <Field label="Jefes">
              <Combobox
                selectedOptions={[hasManager ? hasManager : '']}
                onOptionSelect={(_, e) => setHasManager(e.optionValue)}
                input={{
                  autoComplete: 'off'
                }}
                value={hasManagerValue ?? ''}
                placeholder="-- Todos --"
              >
                {Object.entries(managers).map(([key, value]) => (
                  <Option key={key} value={key} text={value}>
                    {value}
                  </Option>
                ))}
              </Combobox>
            </Field> */}
            {/* <Field label="Horarios">
              <Combobox
                selectedOptions={[hasSchedules ? hasSchedules : '']}
                onOptionSelect={(_, e) => setHasSchedules(e.optionValue)}
                input={{
                  autoComplete: 'off'
                }}
                value={hasSchedulesValue ?? ''}
                placeholder="-- Todos --"
              >
                {Object.entries(schedules).map(([key, value]) => (
                  <Option key={key} value={key} text={value}>
                    {value}
                  </Option>
                ))}
              </Combobox>
            </Field> */}
          </div>
        </div>
        <footer className="border-t py-4 flex gap-3 border-neutral-500">
          <Button onClick={handleApplyFilters} appearance="primary">
            Aplicar
          </Button>
          <Button
            onClick={() => {
              setSidebarIsOpen(false)
              setFilters((prev) => ({
                ...prev,
                role: null,
                area: null,
                job: null,
                hasManager: null,
                hasSchedules: null
              }))
            }}
            icon={<Broom20Filled />}
          >
            Limpiar filtros
          </Button>
        </footer>
      </DrawerBody>
    </Drawer>
  )
}
