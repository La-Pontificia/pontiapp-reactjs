import { User } from '../user'
import { TeCategory } from './te-category'
import { TeQuestion } from './te-question'

export class TeBlock {
  id: string
  name: string
  order: number
  category: TeCategory | null
  questions: TeQuestion[]
  creator: User | null
  updater: User | null
  created_at: Date
  updated_at: Date

  constructor(d: TeBlock) {
    this.id = d.id
    this.name = d.name
    this.order = d.order
    this.creator = d.creator ? new User(d.creator) : null
    this.updater = d.updater ? new User(d.updater) : null
    this.category = d.category ? new TeCategory(d.category) : null
    this.questions = d.questions
      ? d.questions.map((question) => new TeQuestion(question))
      : []
    this.created_at = d.created_at
    this.updated_at = d.updated_at
  }
}
