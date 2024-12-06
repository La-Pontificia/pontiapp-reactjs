import { User } from './user'

export class UserTeamMember {
  id: string
  user: User
  role: 'owner' | 'member'
  teamId: string
  created_at?: Date
  updated_at?: Date
  constructor(data: UserTeamMember) {
    this.id = data.id
    this.user = new User(data.user)
    this.role = data.role
    this.teamId = data.teamId
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    if (data.user) this.user = new User(data.user)
  }
}

export class UserTeam {
  id: string
  photoURL?: string
  name: string
  description: string
  members: User[]
  owners: User[]
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  membersCount?: number
  ownersCount?: number
  updatedUser?: User
  created_at?: Date
  updated_at?: Date

  constructor(data: UserTeam) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.members = data.members
    this.owners = data.owners
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
    this.membersCount = data.membersCount
    this.ownersCount = data.ownersCount
    this.photoURL = data.photoURL
    if (data.members) this.members = data.members.map((u) => new User(u))
    if (data.owners) this.owners = data.owners.map((u) => new User(u))
  }
}
