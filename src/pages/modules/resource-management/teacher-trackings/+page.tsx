import { Tooltip } from '@fluentui/react-components'
import { FilterAddFilled } from '@fluentui/react-icons'
import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '~/commons/search-box'
import { useAuth } from '~/store/auth'
import TeacherTrackingForm from './form'

export default function TeacherTrackingsPage() {
  const { user: authUser } = useAuth()
  const [, setOpenFilters] = React.useState(false)
  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <Helmet>
        <title>Evaluaciones y seguimiento a docentes | PontiApp</title>
      </Helmet>
      <nav className="flex items-center gap-2 flex-wrap w-full py-4 px-3 max-lg:py-2">
        <h1 className="font-semibold flex-grow text-lg">
          Evaluaciones y seguimiento a docentes
        </h1>
        {authUser.hasPrivilege(
          'resourceManagement:teacherTrackings:create'
        ) && <TeacherTrackingForm />}
        <Tooltip content="Mas filtros" relationship="description">
          <button
            onClick={() => setOpenFilters(true)}
            className="flex items-center gap-1 px-2 font-medium"
          >
            <FilterAddFilled fontSize={25} />
            <p className="max-md:hidden">Filtros</p>
          </button>
        </Tooltip>
        {/*    {openFilters && (
          <CollaboratorsFilters
            filters={filters}
            setFilters={setFilters}
            setSidebarIsOpen={setOpenFilters}
            sidebarIsOpen={openFilters}
          />
        )}
          */}
        <div className="ml-auto">
          <SearchBox
            // value={searchValue}
            // dismiss={() => {
            //   setFilters((prev) => ({ ...prev, q: null }))
            // }}
            // onChange={(e) => {
            //   if (e.target.value === '')
            //     setFilters((prev) => ({ ...prev, q: null }))
            //   handleChange(e.target.value)
            // }}
            className="w-[250px]"
            placeholder="Filtrar por DNI, nombres"
          />
        </div>
      </nav>
    </div>
  )
}
