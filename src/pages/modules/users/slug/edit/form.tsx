import { useForm } from 'react-hook-form'
import { useUserEdit } from './+page'
import AccountForm from './account-form'
import { ContactType, User } from '~/types/user'
import { Job } from '~/types/job'
import { Role } from '~/types/role'
import { ContractType } from '~/types/contract-type'
import { UserRole } from '~/types/user-role'
import { Button, Divider, Spinner } from '@fluentui/react-components'
import { useNavigate } from 'react-router'
import OrganizationForm from './organization-form'
import PropertiesPersonForm from './properties-person-form'
import { api } from '~/lib/api'
import { toast } from 'anni'
import { useSlugUser } from '../+layout'
import React from 'react'
import UsersEditSchedules from './schedules'
import { RmBranch } from '~/types/rm-branch'

export type FormUserValues = {
  documentId: string
  lastNames: string
  firstNames: string
  displayName: string
  photoURL: string
  birthdate: Date
  contacts: ContactType[]
  job: Job | null
  role: Role | null
  contractType: ContractType | null
  entryDate: Date
  branch: RmBranch | null
  username: string
  domain: string
  status: boolean
  userRole: UserRole | null
  customPrivileges: string[]
  manager?: User
}

export default function FormUser() {
  const { user, page, refetch } = useUserEdit()
  const { refetch: slugRefetch } = useSlugUser()

  const [fetching, setFetching] = React.useState(false)

  const navigate = useNavigate()
  const { control, handleSubmit, watch, setValue } = useForm<FormUserValues>({
    defaultValues: {
      documentId: user.documentId,
      displayName: user.displayName,
      firstNames: user.firstNames,
      lastNames: user.lastNames,
      status: user.status,
      domain: user.email.split('@')[1],
      username: user.username,
      contacts: user.contacts ?? [],
      branch: user.branch,
      customPrivileges: user.customPrivileges ?? [],
      birthdate: user.birthdate,
      contractType: user.contractType,
      entryDate: user.entryDate,
      job: user.role?.job,
      manager: user.manager,
      photoURL: user.photoURL,
      role: user.role,
      userRole: user.userRole
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
      branchId: values.branch?.id,
      entryDate: values.entryDate,
      email: values.username + '@' + values.domain,
      username: values.username,
      status: values.status,
      customPrivileges: values.customPrivileges,
      managerId: values.manager?.id
    }
    console.log({
      newData
    })

    setFetching(true)
    const res = await api.post<User>(`users/${user.username}`, {
      data: JSON.stringify(newData)
    })
    if (res.ok) {
      refetch()
      slugRefetch()
      setFetching(false)
      toast('Usuario actualizado correctamente.')
      return
    }
    toast(res.error)
    setFetching(false)
  })

  return (
    <>
      <div className="max-w-7xl mx-auto w-full overflow-auto flex-grow">
        <div className="grid px-4 flex-grow overflow-auto py-5">
          <div className="space-y-2 w-full max-w-2xl">
            {(page === 'account' || page === 'all') && (
              <AccountForm control={control} />
            )}

            {page === 'all' && <Divider className="py-5">Organización</Divider>}
            {(page === 'organization' || page === 'all') && (
              <OrganizationForm
                control={control}
                watch={watch}
                setValue={setValue}
              />
            )}
            {page === 'all' && (
              <Divider className="py-5">Información personal</Divider>
            )}
            {(page === 'properties' || page === 'all') && (
              <PropertiesPersonForm
                setValue={setValue}
                watch={watch}
                control={control}
              />
            )}
          </div>
          {page === 'schedules' && <UsersEditSchedules />}
        </div>
      </div>
      <footer className="border-t relative dark:border-neutral-700">
        <div className="max-w-7xl flex gap-2 py-2 lg:pb-0 px-4 mx-auto w-full">
          <Button
            onClick={() => onSubmit()}
            disabled={fetching}
            icon={fetching ? <Spinner size="extra-tiny" /> : undefined}
            appearance="primary"
          >
            Guardar cambios
          </Button>
          <Button
            onClick={() => {
              navigate(`/m/users/${user.username}`)
            }}
          >
            Cancelar
          </Button>
        </div>
      </footer>
    </>
  )
}
