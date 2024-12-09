import { Tab, TabList } from '@fluentui/react-components'
import { useLocation, useNavigate } from 'react-router'

const TABS = {
  '/m/users/all': 'Todos',
  '/m/users/teams': 'Equipos',
  '/m/users/report-files': 'Archivos de reportes'
}

export const CollaboratorsNav = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const tabKeyExists = pathname in TABS

  return (
    <div className="lg:hidden flex p-2">
      <TabList
        selectedValue={tabKeyExists ? pathname : ''}
        onTabSelect={(_, d) => {
          navigate(d.value!.toString())
        }}
        appearance="subtle"
      >
        {Object.entries(TABS).map(([key, value]) => (
          <Tab key={key} value={key}>
            {value}
          </Tab>
        ))}
      </TabList>
    </div>
  )
}

export default CollaboratorsNav
