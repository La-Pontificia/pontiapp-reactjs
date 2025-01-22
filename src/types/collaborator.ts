import { User } from './user'

export class Collaborator extends User {
  edasCount?: number
  constructor(data: Collaborator) {
    super(data)
    this.edasCount = data.edasCount
  }
}
