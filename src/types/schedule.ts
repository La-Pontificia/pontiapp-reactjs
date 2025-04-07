import { AssistTerminal } from './assist-terminal'
import { User } from './user'

export class Schedule {
  id: string
  type: 'available' | 'unavailable'
  from: Date
  to: Date
  title: string
  days?: string[]
  startDate: Date
  endDate?: Date
  dates?: Date[]
  userId: string
  user: User
  archived: boolean
  terminalId: string
  terminal: AssistTerminal
  tolerance: string
  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: Schedule) {
    this.id = data.id
    this.type = data.type
    this.from = data.from
    this.to = data.to
    this.title = data.title
    this.days = data.days
    this.startDate = data.startDate
    this.endDate = data.endDate
    this.userId = data.userId
    this.user = data.user
    this.archived = !!data.archived
    this.terminalId = data.terminalId
    this.terminal = data.terminal
    this.tolerance = data.tolerance
    this.dates = data.dates
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
    if (data.terminal) this.terminal = new AssistTerminal(data.terminal)
  }
}
