import { AssistTerminal } from './assist-terminal'
import { User } from './user'

export class Assist {
  date: string
  user: User
  morningFrom: Date
  morningTo: Date
  afternoonFrom: Date
  afternoonTo: Date
  morningMarkedIn: Date | null
  morningMarkedOut: Date | null
  afternoonMarkedIn: Date | null
  afternoonMarkedOut: Date | null

  constructor(data: Assist) {
    this.date = data.date
    this.user = data.user
    this.morningFrom = data.morningFrom
    this.morningTo = data.morningTo
    this.afternoonFrom = data.afternoonFrom
    this.afternoonTo = data.afternoonTo
    this.morningMarkedIn = data.morningMarkedIn
    this.morningMarkedOut = data.morningMarkedOut
    this.afternoonMarkedIn = data.afternoonMarkedIn
    this.afternoonMarkedOut = data.afternoonMarkedOut

    if (data.user) this.user = new User(data.user)
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
