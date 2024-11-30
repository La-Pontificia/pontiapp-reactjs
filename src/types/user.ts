import { PRIVILEGE_DEVELOPER } from '@/const'
import { Role } from './role'
import { UserRole } from './user-role'
import { ContractType } from './contract-type'

export const contactTypes = {
  email: 'Correo electrónico',
  phone: 'Número de teléfono'
} as const

export type ContactType = {
  value: string
  type: keyof typeof contactTypes
}

export class User {
  id: string
  photoURL?: string
  documentId: string
  firstNames: string
  lastNames: string
  role: Role

  userRole: UserRole
  status: number
  email: string
  manage?: User
  username: string
  entryDate?: Date
  birthdate?: Date
  fullName: string
  contractType: ContractType
  displayName?: string
  contacts?: ContactType[]

  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: User) {
    this.id = data.id
    this.photoURL = data.photoURL
    this.documentId = data.documentId
    this.firstNames = data.firstNames
    this.lastNames = data.lastNames
    this.role = data.role
    this.updatedBy = data.updatedBy
    this.createdBy = data.createdBy
    this.userRole = data.userRole
    this.status = data.status
    this.email = data.email
    this.manage = data.manage
    this.username = data.username
    this.entryDate = data.entryDate
    this.birthdate = data.birthdate
    this.fullName = data.fullName
    this.contractType = data.contractType
    this.displayName = data.displayName
    this.contacts = data.contacts
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
  }

  isDeveloper(): boolean {
    return this.userRole.privileges?.includes(PRIVILEGE_DEVELOPER) ?? false
  }

  display(): string {
    if (this.displayName) return this.displayName

    const firstNameParts = this.firstNames.trim().split(' ')
    const firstName = firstNameParts[0]
    const lastNameParts = this.lastNames.trim().split(' ')
    let lastName = lastNameParts[0]

    if (lastNameParts.length > 1)
      lastName = lastNameParts.slice(0, -1).join(' ')

    return `${firstName} ${lastName}`
  }
}
