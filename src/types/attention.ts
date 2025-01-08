import { AttentionPosition } from './attention-position'
import { FirebaseAttentionTicket } from './attention-ticket'
import { User } from './user'

export class Attention {
  id: string
  position: AttentionPosition
  attendant: User

  personDocumentId: string
  personFirstnames: string
  personLastnames: string
  personCareer: string | null
  personGender: string | null
  personPeriodName: string | null
  personEmail: string | null

  startAttend: string
  finishAttend: string
  ticket: FirebaseAttentionTicket
  attentionDescription: string

  created_at: string
  updated_at: string

  constructor(data: Attention) {
    this.id = data.id
    this.position = new AttentionPosition(data.position)
    this.attendant = new User(data.attendant)

    this.personDocumentId = data.personDocumentId
    this.personFirstnames = data.personFirstnames
    this.personLastnames = data.personLastnames
    this.personCareer = data.personCareer
    this.personGender = data.personGender
    this.personPeriodName = data.personPeriodName
    this.personEmail = data.personEmail

    this.startAttend = data.startAttend
    this.finishAttend = data.finishAttend
    this.ticket = data.ticket
    this.attentionDescription = data.attentionDescription

    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }

  get personDisplayName() {
    return `${this.personLastnames}, ${this.personFirstnames}`
  }
}
