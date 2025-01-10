import { BusinessUnit } from './business-unit'
import { Event } from './event'
export class EventRecord {
  id: string
  documentId: string
  firstNames: string
  lastNames: string
  fullName: string
  career: string | null
  event: Event
  gender: string | null
  period: string | null
  email: string | null
  business: BusinessUnit
  created_at: string
  updated_at: string
  constructor(data: EventRecord) {
    this.id = data.id
    this.documentId = data.documentId
    this.firstNames = data.firstNames
    this.lastNames = data.lastNames
    this.fullName = data.fullName
    this.career = data.career
    this.gender = data.gender
    this.period = data.period
    this.email = data.email
    this.business = data.business
    this.event = data.event

    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (data.business) this.business = new BusinessUnit(data.business)
    if (data.event) this.event = new Event(data.event)
  }

  get displayName() {
    if (this.fullName) return this.fullName
    return `${this.firstNames} ${this.lastNames}`
  }
}
