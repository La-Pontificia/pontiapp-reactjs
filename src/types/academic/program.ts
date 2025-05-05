import { BusinessUnit } from '../rm/business-unit'
import { User } from '../user'
import { Area } from './area'

export class Program {
  id: string
  name: string
  businessUnit: BusinessUnit
  area: Area
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
    this.area = data.area

    if (this.area) this.area = new Area(this.area)

    if (this.businessUnit)
      this.businessUnit = new BusinessUnit(this.businessUnit)

    if (this.creator) this.creator = new User(this.creator)
  }
}
