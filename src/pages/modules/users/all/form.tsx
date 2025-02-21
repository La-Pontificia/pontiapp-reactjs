import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { availableDomains } from '~/const'
import { ContractType } from '~/types/contract-type'
import { Job } from '~/types/job'
import { Role } from '~/types/role'
import { Schedule } from '~/types/schedule'
import { ContactType, User } from '~/types/user'
import { UserRole } from '~/types/user-role'
import { generateRandomPassword } from '~/utils'
import AccountForm from './account-form'
import PropertiesPersonForm, { UserContacts } from './properties-person-form'
import OrganizationForm, { ScheduleForm } from './organization-form'
import { format } from '~/lib/dayjs'
import { toast } from 'anni'
import { useNavigate } from 'react-router'
import { api } from '~/lib/api'
import { RmBranch } from '~/types/rm-branch'

type Props = {
  title?: string
  open: boolean
  setOpen: (open: boolean) => void
  onSubmitTitle?: string
  readOnly?: boolean
  defaultUser?: User
}

export type FormUserValues = {
  documentId: string
  lastNames: string
  firstNames: string
  displayName: string
  photoFile: File
  photoURL: string
  birthdate: Date
  contacts: ContactType[]
  branch: RmBranch | null
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
  manager?: User
}

export default function FormUser(props?: Props) {
  const [fetching, setFetching] = React.useState(false)
  const [openFormSchedule, setOpenFormSchedule] = React.useState(false)
  const [openFormContact, setOpenFormContact] = React.useState(false)
  const navigate = useNavigate()
  const {
    open = false,
    setOpen = () => {},
    readOnly = false,
    defaultUser
  } = props ?? {}

  const { control, handleSubmit, watch, setValue } = useForm<FormUserValues>({
    defaultValues: defaultUser ?? {
      documentId: '',
      displayName: '',
      firstNames: '',
      lastNames: '',
      schedules: [],
      status: true,
      domain: Object.keys(availableDomains)[0],
      password: generateRandomPassword(),
      username: '',
      contacts: []
    }
  })
  const onSubmit = handleSubmit(async (values) => {
    const newData = {
      documentId: values.documentId,
      lastNames: values.lastNames,
      firstNames: values.firstNames,
      displayName: values.displayName,
      birthdate: values.birthdate,
      contacts: values.contacts.length > 0 ? values.contacts : undefined,
      photoURL: values.photoURL,
      roleId: values.role?.id,
      userRoleId: values.userRole?.id,
      contractTypeId: values.contractType?.id,
      schedules: values.schedules.map((s) => ({
        ...s,
        from: format(s.from, 'YYYY-MM-DD HH:mm:ss'),
        to: format(s.to, 'YYYY-MM-DD HH:mm:ss'),
        startDate: format(s.startDate, 'YYYY-MM-DD'),
        tolerance: s.tolerance,
        assistTerminalId: s.terminal?.id
      })),
      branchId: values.branch?.id,
      entryDate: values.entryDate,
      email: values.username + '@' + values.domain,
      username: values.username,
      password: values.password,
      status: values.status,
      customPrivileges: values.customPrivileges,
      managerId: values.manager?.id
    }
    setFetching(true)
    const res = await api.post<User>('users/create', {
      data: JSON.stringify(newData)
    })
    if (res.ok) {
      return navigate(`/m/users/${res.data.username}`)
    }
    toast(res.error)

    setFetching(false)
  })

  return (
    <>
      <Dialog open={open} onOpenChange={(_, { open }) => setOpen(open)}>
        <DialogSurface className="min-w-[600px]">
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              {defaultUser ? 'Editar usuario' : 'Nuevo usuario'}
            </DialogTitle>
            <DialogContent className="space-y-1">
              <AccountForm control={control} open={open} />
              <PropertiesPersonForm
                setOpenFormContact={setOpenFormContact}
                control={control}
                watch={watch}
                setValue={setValue}
                setOpen={setOpen}
              />
              <OrganizationForm
                control={control}
                watch={watch}
                setValue={setValue}
                setOpen={setOpen}
                open={open}
                setOpenFormSchedule={setOpenFormSchedule}
              />
            </DialogContent>
            <DialogActions className="pt-5">
              <Button
                disabled={fetching}
                icon={fetching ? <Spinner size="extra-tiny" /> : undefined}
                onClick={() => {
                  if (readOnly) {
                    setOpen(false)
                  } else {
                    onSubmit()
                  }
                }}
                appearance="primary"
              >
                {defaultUser ? 'Guardar cambios' : 'Crear usuario'}
              </Button>
              <Button onClick={() => setOpen(false)} appearance="outline">
                Cerrar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <ScheduleForm
        open={openFormSchedule}
        setValue={setValue}
        watch={watch}
        setOpen={(value) => {
          setOpenFormSchedule(value)
          setOpen(true)
        }}
      />
      <UserContacts
        open={openFormContact}
        setOpen={(value) => {
          setOpenFormContact(value)
          setOpen(true)
        }}
        contacts={watch().contacts ?? []}
        onSubmit={(contacts) => setValue('contacts', contacts)}
      />
    </>
  )
}
