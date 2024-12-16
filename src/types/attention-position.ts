import { BusinessUnit } from './business-unit'
import { User } from './user'

export class AttentionPosition {
  id: string
  name: string
  shortName: string
  business: BusinessUnit
  businessId: string
  available: boolean
  current: User
  created_at: Date
  updated_at: Date
  creator: User
  updater: User
  constructor(data: AttentionPosition) {
    this.id = data.id
    this.name = data.name
    this.shortName = data.shortName
    this.business = data.business
    this.businessId = data.businessId
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater
    this.available = data.available
    this.current = data.current

    if (data.business) this.business = new BusinessUnit(data.business)
    if (data.current) this.current = new User(data.current)
    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
  }
}
