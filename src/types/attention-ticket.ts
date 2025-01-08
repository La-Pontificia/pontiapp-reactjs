export type TicketState =
  | 'pending'
  | 'calling'
  | 'attending'
  | 'attended'
  | 'cancelled'
  | 'transferred'

export class FirebaseAttentionTicket {
  id: string
  state: TicketState
  personDocumentId: string
  personFirstNames: string
  personLastNames: string
  personEmail: string | null
  personCareer: string | null
  personGender: string | null
  personPeriodName: string | null
  personBusiness: string | null

  attentionserviceId: string
  attentionPositionId: string
  attentionPositionBusinessId: string

  attentionServiceName: string
  attentionPositionName: string
  attentionPositionShortName: string
  attentionPositionBusinessName: string
  created_at: string
  updated_at: string
  created_at_date: string

  transferReason: string | null
  waitedUntil: string | null

  constructor(data: FirebaseAttentionTicket) {
    this.id = data.id
    this.state = data.state
    this.personDocumentId = data.personDocumentId
    this.personFirstNames = data.personFirstNames
    this.personLastNames = data.personLastNames
    this.personEmail = data.personEmail
    this.personGender = data.personGender
    this.personCareer = data.personCareer
    this.personPeriodName = data.personPeriodName
    this.personBusiness = data.personBusiness
    this.attentionserviceId = data.attentionserviceId
    this.attentionPositionId = data.attentionPositionId
    this.attentionPositionBusinessId = data.attentionPositionBusinessId
    this.attentionServiceName = data.attentionServiceName
    this.attentionPositionName = data.attentionPositionName
    this.attentionPositionShortName = data.attentionPositionShortName
    this.attentionPositionBusinessName = data.attentionPositionBusinessName
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.created_at_date = data.created_at_date
    this.transferReason = data.transferReason
    this.waitedUntil = data.waitedUntil
  }

  get displayName() {
    return `${this.personLastNames}, ${this.personFirstNames}`
  }
}
