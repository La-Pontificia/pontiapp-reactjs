import { User } from './user'

export class Report {
  id: string
  title: string
  fileUrl: string
  generatedBy: string
  downloadLink: string
  ext: string
  module: string
  created_at: Date
  updated_at: Date
  user: User

  constructor(data: Report) {
    this.id = data.id
    this.title = data.title
    this.fileUrl = data.fileUrl
    this.generatedBy = data.generatedBy
    this.downloadLink = data.downloadLink
    this.ext = data.ext
    this.module = data.module
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.user = data.user
    if (data.user) this.user = new User(data.user)
  }
}
