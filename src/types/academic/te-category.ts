import { User } from '../user'
import { TeBlock } from './te-block'
import { TeGroup } from './te-group'

export class TeCategory {
  id: string
  name: string
  order: number
  group: TeGroup | null
  blocks: TeBlock[]
  creator: User | null
  updater: User | null
  created_at: Date
  updated_at: Date

  constructor(d: TeCategory) {
    this.id = d.id
    this.name = d.name
    this.order = d.order
    this.creator = d.creator ? new User(d.creator) : null
    this.updater = d.updater ? new User(d.updater) : null
    this.group = d.group ? new TeGroup(d.group) : null
    this.blocks = d.blocks ? d.blocks.map((block) => new TeBlock(block)) : []
    this.created_at = d.created_at
    this.updated_at = d.updated_at
  }
}
