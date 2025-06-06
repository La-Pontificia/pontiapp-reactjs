import { CONTACT_TYPES, PRIVILEGE_DEVELOPER } from '@/const'
import { Role } from './role'
import { UserRole } from './user-role'
import { ContractType } from './contract-type'
import { RmBranch } from './rm-branch'
import { Session } from './user/session'
import { Schedule } from './schedule'

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
  role: Role | null
  role2: Role | null
  userRole: UserRole
  userRole2: UserRole
  status: boolean
  email: string
  manager: User
  username: string
  entryDate?: Date
  birthdate?: Date
  schedulesNotAvailable: Schedule[]
  fullName: string
  branch: RmBranch | null
  contractType: ContractType
  contacts?: ContactType[]
  internalDisplayName: string
  customPrivileges: string[]
  subordinates: User[]
  coworkers: User[]
  sessions?: Session[]
  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User
  edaInvitedAt?: Date

  constructor(
    data: User & {
      contract_type?: ContractType
      user_role?: UserRole
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
    this.userRole2 = data.userRole2
    this.status = data.status
    this.email = data.email
    this.manager = data.manager
    this.username = data.username
    this.entryDate = data.entryDate
    this.birthdate = data.birthdate
    this.branch = data.branch
    this.fullName = data.fullName
    this.contractType = data.contractType
    this.contacts = data.contacts
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.subordinates = data.subordinates
    this.coworkers = data.coworkers
    this.updatedUser = data.updatedUser
    this.role = data.role
    this.role2 = data.role2
    this.schedulesNotAvailable = data.schedulesNotAvailable
    this.customPrivileges = data.customPrivileges
    this.internalDisplayName = data.displayName
    this.edaInvitedAt = data.edaInvitedAt

    if (data.contract_type)
      this.contractType = new ContractType(data.contract_type)
    if (data.user_role) this.userRole = new UserRole(data.user_role)
    if (data.manager) this.manager = new User(data.manager)
    if (data.branch) this.branch = new RmBranch(data.branch)
    if (data.role) this.role = new Role(data.role)
    if (data.role2) this.role2 = new Role(data.role2)
    if (data.userRole) this.userRole = new UserRole(data.userRole)
    if (data.userRole2) this.userRole2 = new UserRole(data.userRole2)

    if (data.subordinates)
      this.subordinates = data.subordinates.map((s: User) => new User(s))

    if (data.coworkers)
      this.coworkers = data.coworkers.map((c: User) => new User(c))
    if (data.sessions)
      this.sessions = data.sessions.map((s: Session) => new Session(s))

    if (data.schedulesNotAvailable)
      this.schedulesNotAvailable = data.schedulesNotAvailable.map(
        (s: Schedule) => new Schedule(s)
      )
  }

  get displayName() {
    let n = this.internalDisplayName

    if (!this.internalDisplayName) {
      const firstNameParts = this.firstNames?.trim().split(' ')
      const firstName = firstNameParts[0]
      const lastNameParts = this.lastNames?.trim().split(' ')
      let lastName = lastNameParts[0]
      if (lastNameParts.length > 1)
        lastName = lastNameParts?.slice(0, -1).join(' ')
      n = `${firstName} ${lastName}`
    }

    return n
  }

  get allPrivileges(): string[] {
    return [
      ...(this.userRole?.privileges || []),
      ...(this.customPrivileges || [])
    ]
  }

  get isDeveloper(): boolean {
    const allPrivileges = [
      ...(this.userRole?.privileges || []),
      ...(this.customPrivileges || [])
    ]
    return allPrivileges?.includes(PRIVILEGE_DEVELOPER) ?? false
  }

  hasPrivilege(
    privilege: string | string[],
    type: 'or' | 'equals' = 'or'
  ): boolean {
    if (this.isDeveloper) return true

    const allPrivileges = [
      ...(this.userRole?.privileges || []),
      ...(this.customPrivileges || [])
    ]
    if (Array.isArray(privilege)) {
      if (type === 'or') {
        return privilege.some((p) => allPrivileges.includes(p))
      } else if (type === 'equals') {
        return privilege.every((p) => allPrivileges.includes(p))
      }
    } else {
      return allPrivileges.includes(privilege)
    }
    return false
  }

  hasModule(module: string): boolean {
    if (this.isDeveloper) return true

    const allPrivileges = [
      ...(this.userRole?.privileges || []),
      ...(this.customPrivileges || [])
    ]
    return allPrivileges.some((p) => p.startsWith(module))
  }
}
