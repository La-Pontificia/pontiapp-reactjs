import { BusinessUnit } from './business-unit'
import { Event } from './event'

export class EventRecord {
  id: string
  documentId: string
  firstNames: string
  lastNames: string
  displayName: string
  career: string
  event: Event
  eventId: string
  gender: string
  period: string
  email: string
  business: BusinessUnit
  created_at: Date
  updated_at: Date
  constructor(data: EventRecord) {
    this.id = data.id
    this.documentId = data.documentId
    this.firstNames = data.firstNames
    this.lastNames = data.lastNames
    this.career = data.career
    this.event = data.event
    this.eventId = data.eventId
    this.gender = data.gender
    this.period = data.period
    this.email = data.email
    this.business = data.business
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    this.displayName = `${this.firstNames} ${this.lastNames}`

    if (data.event) this.event = new Event(data.event)
    if (data.business) this.business = new BusinessUnit(data.business)
  }
}
