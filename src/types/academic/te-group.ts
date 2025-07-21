import { User } from '../user'
import { TeCategory } from './te-category'

export class TeGroup {
  id: string
  name: string
  creator: User | null
  updater: User | null
  categories: TeCategory[]
  created_at: Date
  updated_at: Date

  constructor(d: TeGroup) {
    this.id = d.id
    this.name = d.name
    this.creator = d.creator ? new User(d.creator) : null
    this.updater = d.updater ? new User(d.updater) : null
    this.categories = d.categories
      ? d.categories.map((cat) => new TeCategory(cat))
      : []
    this.created_at = d.created_at
    this.updated_at = d.updated_at
  }
}
