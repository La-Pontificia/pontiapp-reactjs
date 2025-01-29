import { EdaEvaluation } from './eda-evaluation'
import { EdaYear } from './eda-year'
import { User } from './user'

export class Eda {
  id: string
  user: User
  created_at: string
  updated_at: string
  approver: User
  closer: User
  sender: User
  status: 'sent' | 'approved' | 'closed'
  approvedAt: string
  sentAt: string
  closedAt: string
  creator: User
  year: EdaYear
  managed: User
  countObjetives: number
  evaluations: {
    '1': EdaEvaluation
    '2': EdaEvaluation
  }

  constructor(data: Eda) {
    this.id = data.id
    this.user = data.user
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.approver = data.approver
    this.closer = data.closer
    this.sender = data.sender
    this.status = data.status
    this.approvedAt = data.approvedAt
    this.sentAt = data.sentAt
    this.closedAt = data.closedAt
    this.creator = data.creator
    this.year = data.year
    this.managed = data.managed
    this.evaluations = data.evaluations
    this.countObjetives = data.countObjetives

    if (data.user) this.user = new User(data.user)
    if (data.approver) this.approver = new User(data.approver)
    if (data.closer) this.closer = new User(data.closer)
    if (data.sender) this.sender = new User(data.sender)
    if (data.creator) this.creator = new User(data.creator)
    if (data.year) this.year = new EdaYear(data.year)
    if (data.managed) this.managed = new User(data.managed)

    if (data.evaluations['1']) {
      this.evaluations['1'] = new EdaEvaluation(data.evaluations['1'])
    }
    if (data.evaluations['2']) {
      this.evaluations['2'] = new EdaEvaluation(data.evaluations['2'])
    }
  }

  get statusText() {
    switch (this.status) {
      case 'sent':
        return 'Enviado'
      case 'approved':
        return 'Aprobado'
      case 'closed':
        return 'Cerrado'
      default:
        return 'Sin enviar'
    }
  }
}
