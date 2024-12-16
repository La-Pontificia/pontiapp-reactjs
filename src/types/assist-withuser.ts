import { AssistTerminal } from './assist-terminal'
import { User } from './user'

export class AssistWithUser {
  id: string
  datetime: string
  user: User
  terminal: AssistTerminal
  created_at: string
  updated_at: string

  constructor(data: AssistWithUser) {
    this.id = data.id
    this.datetime = data.datetime
    this.user = data.user
    this.terminal = data.terminal
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (data.user) this.user = new User(data.user)
    if (data.terminal) this.terminal = new AssistTerminal(data.terminal)
  }
}
