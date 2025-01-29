import { Eda } from './eda'
import { EdaObjetiveEvaluation } from './eda-objetive-evaluation'
import { User } from './user'

export class EdaEvaluation {
  id: string
  number: number
  eda: Eda
  qualification: number | null
  qualificationAt: Date | null
  qualifier: User
  selftQualification: number | null
  selftQualificationAt: Date | null
  selftQualifier: User
  closedAt: Date | null
  closer: User
  objetives: EdaObjetiveEvaluation[]

  constructor(data: EdaEvaluation) {
    this.id = data.id
    this.number = data.number
    this.eda = data.eda
    this.qualification = data.qualification
    this.qualificationAt = data.qualificationAt
    this.qualifier = data.qualifier
    this.selftQualification = data.selftQualification
    this.selftQualificationAt = data.selftQualificationAt
    this.selftQualifier = data.selftQualifier
    this.closedAt = data.closedAt
    this.closer = data.closer
    this.objetives = data.objetives

    if (data.eda) this.eda = new Eda(data.eda)
    if (data.qualifier) this.qualifier = new User(data.qualifier)
    if (data.selftQualifier) this.selftQualifier = new User(data.selftQualifier)
    if (data.closer) this.closer = new User(data.closer)
    if (data.objetives) {
      this.objetives = data.objetives.map((o) => new EdaObjetiveEvaluation(o))
    }
  }
}
