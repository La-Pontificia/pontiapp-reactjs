import { Eda } from './eda'
import { User } from './user'

export class EdaObjetive {
  readonly id: string
  order: number
  eda: Eda
  title: string
  description: string
  indicators: string
  percentage: number
  creator: User
  updater: User
  created_at: Date
  updated_at: Date

  constructor(data: EdaObjetive) {
    this.id = data.id
    this.order = data.order
    this.eda = data.eda
    this.title = data.title
    this.description = data.description
    this.indicators = data.indicators
    this.percentage = data.percentage
    this.creator = data.creator
    this.updater = data.updater
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (data.eda) this.eda = new Eda(data.eda)
    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
  }
}
