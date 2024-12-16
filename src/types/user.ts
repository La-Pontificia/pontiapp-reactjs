import { CONTACT_TYPES, PRIVILEGE_DEVELOPER } from '~/const'
import { Role } from './role'
import { UserRole } from './user-role'
import { ContractType } from './contract-type'

export type ContactType = {
  value: string
  type: keyof typeof CONTACT_TYPES
}

export class User {
  id: string
  photoURL?: string
  documentId: string
  firstNames: string
  lastNames: string
  role: Role
  userRole: UserRole
  status: boolean
  email: string
  manager?: User
  username: string
  entryDate?: Date
  birthdate?: Date
  fullName: string
  contractType: ContractType
  contacts?: ContactType[]
  displayName: string
  customPrivileges: string[]
  subordinates: User[]
  coworkers: User[]
  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(
    data: User & {
      user_role?: UserRole
      contract_type?: ContractType
    }
  ) {
    this.id = data.id
    this.photoURL = data.photoURL
    this.documentId = data.documentId
    this.firstNames = data.firstNames
    this.lastNames = data.lastNames
    this.updatedBy = data.updatedBy
    this.createdBy = data.createdBy
    this.userRole = data.userRole
    this.status = data.status
    this.email = data.email
    this.manager = data.manager
    this.username = data.username
    this.entryDate = data.entryDate
    this.birthdate = data.birthdate
    this.fullName = data.fullName
    this.contractType = data.contractType
    this.contacts = data.contacts
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
    this.role = data.role
    this.subordinates = data.subordinates
    this.coworkers = data.coworkers
    this.customPrivileges = data.customPrivileges
    this.userRole = data.user_role as UserRole
    this.contractType = data.contract_type as ContractType

    if (data.manager) this.manager = new User(data.manager)
    if (data.role) this.role = new Role(data.role)
    if (data.userRole) this.userRole = new UserRole(data.userRole)
    if (data.subordinates)
      this.subordinates = data.subordinates.map((s) => new User(s))
    if (data.coworkers) this.coworkers = data.coworkers.map((c) => new User(c))

    if (data.displayName) {
      this.displayName = data.displayName
    } else {
      const firstNameParts = this.firstNames?.trim().split(' ')
      const firstName = firstNameParts[0]
      const lastNameParts = this.lastNames?.trim().split(' ')
      let lastName = lastNameParts[0]

      if (lastNameParts.length > 1)
        lastName = lastNameParts?.slice(0, -1).join(' ')

      this.displayName = `${firstName} ${lastName}`
    }
  }

  get isDeveloper(): boolean {
    const allPrivileges = [
      ...(this.userRole.privileges || []),
      ...(this.customPrivileges || [])
    ]
    return allPrivileges?.includes(PRIVILEGE_DEVELOPER) ?? false
  }

  hasPrivilege(privilege: string): boolean {
    const allPrivileges = [
      ...(this.userRole.privileges || []),
      ...(this.customPrivileges || [])
    ]
    return allPrivileges.includes(privilege) || this.isDeveloper
  }

  hasModule(module: string): boolean {
    const allPrivileges = [
      ...(this.userRole.privileges || []),
      ...(this.customPrivileges || [])
    ]
    return allPrivileges.some((p) => p.startsWith(module)) || this.isDeveloper
  }
}
