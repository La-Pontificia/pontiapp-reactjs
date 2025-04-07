import { BusinessUnit } from '../rm/business-unit'
import { User } from '../user'

export class Program {
  id: string
  name: string
  businessUnit: BusinessUnit
  creator: User
  created_at: Date
  updated_at: Date

  constructor(data: Program) {
    this.id = data.id
    this.name = data.name
    this.businessUnit = data.businessUnit
    this.creator = data.creator
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (this.businessUnit)
      this.businessUnit = new BusinessUnit(this.businessUnit)

    if (this.creator) this.creator = new User(this.creator)
  }
}
