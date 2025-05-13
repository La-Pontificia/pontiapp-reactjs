import { User } from '../user'

export class BusinessUnit {
  id: string
  name: string
  domain: string
  acronym: string
  logoURL: string
  logoURLSquare: string
  created_at: Date
  updated_at: Date
  creator: User
  updater: User
  constructor(data: BusinessUnit) {
    this.id = data.id
    this.name = data.name
    this.domain = data.domain
    this.acronym = data.acronym
    this.logoURL = data.logoURL
    this.logoURLSquare = data.logoURLSquare
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater

    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
  }
}
