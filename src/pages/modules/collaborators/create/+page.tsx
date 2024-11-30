import { Button, Tab, TabList } from '@fluentui/react-components'
import React from 'react'
import { useForm } from 'react-hook-form'
import PropertiesUser from './properties'
import { Schedule } from '@/types/schedule'
import OrganizationUser from './organization'
import BasicUser from './basic'
import { availableDomains } from '@/const'
import { generateRandomPassword } from '@/utils'
import { ContactType, User } from '@/types/user'
import { ArrowLeft24Filled, ArrowRight24Filled } from '@fluentui/react-icons'
import PreviewUser from './preview'
import { Role } from '@/types/role'
import { Job } from '@/types/job'
import { UserRole } from '@/types/user-role'
import { ContractType } from '@/types/contract-type'

export type FormValues = {
  documentId: string
  lastNames: string
  firstNames: string
  displayName: string
  photoFile: File
  photoURL: string
  birthdate: Date
  contacts: ContactType[]
  job: Job | null
  role: Role | null
  contractType: ContractType | null
  schedules: Array<Partial<Schedule>>
  entryDate: Date
  username: string
  domain: string
  password: string
  status: boolean
  userRole: UserRole | null
  customPrivileges: string[]
  adminstrator: User
}

const TABS = {
  basic: 'Básica',
  properties: 'Propiedades',
  organization: 'Organización',
  'preview+create': 'Revisar y crear'
}

export default function CreateCollaboratorPage() {
  const [tab, setTab] = React.useState<keyof typeof TABS>('basic')
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    register
  } = useForm<FormValues>({
    defaultValues: {
      documentId: '',
      displayName: '',
      firstNames: '',
      lastNames: '',
      schedules: [],
      status: true,
      domain: Object.keys(availableDomains)[0],
      password: generateRandomPassword(),
      username: ''
    }
  })

  const onSubmit = handleSubmit((data) => {
    if (tab !== 'preview+create') return setTab('preview+create')
    console.log(data)
  })

  const nextText = React.useMemo(() => {
    if (tab === 'basic') return TABS.properties
    if (tab === 'properties') return TABS.organization
    if (tab === 'organization') return TABS['preview+create']
    return ''
  }, [tab])

  const onPrevious = () => {
    if (tab === 'properties') setTab('basic')
    else if (tab === 'organization') setTab('properties')
    else if (tab === 'preview+create') setTab('organization')
  }

  const onNext = () => {
    if (tab === 'basic') setTab('properties')
    else if (tab === 'properties') setTab('organization')
    else if (tab === 'organization') setTab('preview+create')
  }

  // Register all fields
  register('username', {
    required: 'El nombre de usuario es requerido'
  })
  register('domain', {
    required: 'Selecciona un dominio'
  })
  register('displayName', {
    required: 'Ingrese el nombre a mostrar'
  })
  register('password', {
    required: 'Ingresa una contraseña'
  })
  register('userRole', {
    required: 'Selecciona un rol de usuario'
  })
  register('documentId', {
    required: {
      value: true,
      message: 'El campo es requerido'
    },
    pattern: {
      value: /^[0-9]{8}$/,
      message: 'Solo se permite numeros de 8 digitos'
    }
  })
  register('lastNames', {
    required: 'Ingresa los apellidos'
  })
  register('firstNames', {
    required: 'Ingresa los nombres'
  })
  register('job', {
    required: 'Selecciona un cargo'
  })
  register('role', {
    required: 'Selecciona un rol'
  })
  register('contractType', {
    required: 'Selecciona un tipo de contrato'
  })
  register('entryDate', {
    required: 'Selecciona una fecha de ingreso'
  })
  register('adminstrator', {
    required: 'Selecciona un administrador'
  })

  return (
    <div className="h-full flex-grow flex flex-col overflow-y-auto">
      <nav className="flex items-center gap-2 px-2">
        <TabList
          selectedValue={tab}
          onTabSelect={(_, d) => setTab(d.value as keyof typeof TABS)}
        >
          {Object.entries(TABS).map(([key, value]) => (
            <Tab key={key} value={key}>
              {value}
            </Tab>
          ))}
        </TabList>
      </nav>
      <div className="px-5 py-3 flex-grow overflow-y-auto">
        <div className="max-w-xl">
          {tab === 'basic' && (
            <BasicUser control={control} setValue={setValue} watch={watch} />
          )}
          {tab === 'properties' && (
            <PropertiesUser
              control={control}
              setValue={setValue}
              watch={watch}
            />
          )}
          {tab === 'organization' && (
            <OrganizationUser
              control={control}
              setValue={setValue}
              watch={watch}
            />
          )}
          {tab === 'preview+create' && (
            <PreviewUser
              errors={errors}
              control={control}
              setValue={setValue}
              watch={watch}
            />
          )}
        </div>
      </div>
      <footer className="border-t gap-24 flex dark:border-stone-700 p-4">
        <Button
          // icon={<Spinner size="extra-tiny" />}
          disabled={Object.keys(errors).length > 0}
          onClick={onSubmit}
        >
          {tab === 'preview+create' ? 'Crear' : 'Revisar + crear'}
        </Button>

        <div className="flex items-center gap-4">
          <Button
            disabled={tab === 'basic'}
            iconPosition="before"
            icon={<ArrowLeft24Filled />}
            onClick={onPrevious}
          >
            Anterior
          </Button>
          <Button
            disabled={tab === 'preview+create'}
            iconPosition="after"
            icon={<ArrowRight24Filled />}
            onClick={onNext}
          >
            Siguiente {nextText ? `: ${nextText}` : ''}
          </Button>
        </div>
      </footer>
    </div>
  )
}
