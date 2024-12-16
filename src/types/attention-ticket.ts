import { AttentionService } from './attention-service'
import { User } from './user'

export class AttentionTicket {
  id: string
  state: 1 | 2 | 3 | 4
  personDocumentId: string
  personFirstNames: string
  personLastNames: string
  personEmail: string
  personGender: string
  personCareer: string
  personPeriodName: string
  service: AttentionService
  attentionServiceId: string
  created_at: Date
  updated_at: Date
  creator: User
  constructor(data: AttentionTicket) {
    this.id = data.id
    this.personDocumentId = data.personDocumentId
    this.personFirstNames = data.personFirstNames
    this.personLastNames = data.personLastNames
    this.personEmail = data.personEmail
    this.personGender = data.personGender
    this.personCareer = data.personCareer
    this.personPeriodName = data.personPeriodName
    this.state = data.state
    this.service = data.service
    this.attentionServiceId = data.attentionServiceId
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    if (data.service) this.service = new AttentionService(data.service)
    if (data.creator) this.creator = new User(data.creator)
  }

  get displayName() {
    return `${this.personLastNames}, ${this.personFirstNames}`
  }
}
