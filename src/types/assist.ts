import { User } from './user'

export class Assist {
  date: string
  user: User
  morningFrom: string
  morningTo: string
  afternoonFrom: string
  afternoonTo: string
  morningMarkedIn: string | null
  morningMarkedOut: string | null
  afternoonMarkedIn: string | null
  afternoonMarkedOut: string | null

  constructor(data: Assist) {
    this.date = data.date
    this.morningFrom = data.morningFrom
    this.morningTo = data.morningTo
    this.afternoonFrom = data.afternoonFrom
    this.afternoonTo = data.afternoonTo
    this.morningMarkedIn = data.morningMarkedIn
    this.morningMarkedOut = data.morningMarkedOut
    this.afternoonMarkedIn = data.afternoonMarkedIn
    this.afternoonMarkedOut = data.afternoonMarkedOut
    this.user = data.user

    if (data.user) this.user = new User(data.user)
  }
}
