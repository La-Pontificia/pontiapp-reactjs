import { User } from '../user'
import { TeBlock } from './te-block'
import { TeOption } from './te-option'

type Answer = {
  id: string
  questionId: string
  answer: string
}

export class TeQuestion {
  id: string
  question: string
  type: 'text' | 'select'
  order: number
  block: TeBlock | null
  answer: Answer | null
  options: TeOption[]
  option: TeOption | null
  creator: User | null
  updater: User | null
  created_at: Date
  updated_at: Date

  constructor(d: TeQuestion) {
    this.id = d.id
    this.question = d.question
    this.order = d.order
    this.type = d.type
    this.creator = d.creator ? new User(d.creator) : null
    this.updater = d.updater ? new User(d.updater) : null
    this.answer = d.answer
    this.block = d.block ? new TeBlock(d.block) : null
    this.options = d.options
      ? d.options.map((option) => new TeOption(option))
      : []
    this.option = d.option ? new TeOption(d.option) : null
    this.created_at = d.created_at
    this.updated_at = d.updated_at
  }
}
