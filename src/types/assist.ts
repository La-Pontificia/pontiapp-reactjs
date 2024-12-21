import { AssistTerminal } from './assist-terminal'
import { User } from './user'

export class Assist {
  date: string
  from: string
  to: string
  user: User
  terminal: AssistTerminal
  markedIn: string | null
  markedOut: string | null

  constructor(data: Assist) {
    this.date = data.date
    this.from = data.from
    this.to = data.to
    this.user = data.user
    this.terminal = data.terminal
    this.markedIn = data.markedIn
    this.markedOut = data.markedOut

    if (data.user) this.user = new User(data.user)
    if (data.terminal) this.terminal = new AssistTerminal(data.terminal)
  }
}

export class RestAssist {
  datetime: string
  terminal: AssistTerminal
  user: User
  constructor(data: RestAssist) {
    this.datetime = data.datetime
    this.terminal = data.terminal
    this.user = data.user
    if (data.terminal) this.terminal = new AssistTerminal(data.terminal)
    if (data.user) this.user = new User(data.user)
  }
}
