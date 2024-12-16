import { AttentionPosition } from './attention-position'
import { User } from './user'

export class AttentionService {
  id: string
  name: string
  position: AttentionPosition
  positionId: string
  created_at: Date
  updated_at: Date
  creator: User
  updater: User
  constructor(data: AttentionService) {
    this.id = data.id
    this.name = data.name
    this.position = data.position
    this.positionId = data.positionId
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater

    if (data.position) this.position = new AttentionPosition(data.position)
    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
  }
}
