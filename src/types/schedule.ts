import { Time } from '.'
import { AssistTerminal } from './assist-terminal'
import { User } from './user'

export class Schedule {
  id: string
  from: Time
  to: Time
  title: string
  days?: string[]
  startDate: Date
  userId: string
  user: User
  archived: boolean
  terminalId: string
  terminal: AssistTerminal

  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User
  constructor(data: Schedule) {
    this.id = data.id
    this.from = data.from
    this.to = data.to
    this.title = data.title
    this.days = data.days
    this.startDate = data.startDate
    this.userId = data.userId
    this.user = data.user
    this.archived = data.archived
    this.terminalId = data.terminalId
    this.terminal = data.terminal
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
    if (data.terminal) this.terminal = new AssistTerminal(data.terminal)
  }
}
