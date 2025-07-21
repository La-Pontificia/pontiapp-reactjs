import { User } from '../user'
import { TeQuestion } from './te-question'

export class TeOption {
  id: string
  name: string
  value: number
  question: TeQuestion | null
  order: number
  creator: User | null
  updater: User | null
  created_at: Date
  updated_at: Date

  constructor(d: TeOption) {
    this.id = d.id
    this.name = d.name
    this.value = d.value
    this.order = d.order
    this.question = d.question ? new TeQuestion(d.question) : null
    this.creator = d.creator ? new User(d.creator) : null
    this.updater = d.updater ? new User(d.updater) : null
    this.created_at = d.created_at
    this.updated_at = d.updated_at
  }
}
