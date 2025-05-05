import { User } from '../user'

export class TeamMember extends User {
  type: 'owner' | 'member'
  constructor(data: TeamMember) {
    super(data)
    this.type = data.type
  }
}

export class Team {
  id: string
  name: string
  description: string
  members: TeamMember[]
  membersCount: number

  created_at: Date
  updated_at: Date
  owner: User | null
  creator: User | null
  updater: User | null

  constructor(data: Team) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.members = data.members
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.membersCount = data.membersCount
    this.owner = data.owner ? new User(data.owner) : null
    this.creator = data.creator ? new User(data.creator) : null
    this.updater = data.updater ? new User(data.updater) : null

    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
    if (data.members)
      this.members = data.members.map((member) => new TeamMember(member))
  }
}
