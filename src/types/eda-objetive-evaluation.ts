import { EdaEvaluation } from './eda-evaluation'
import { EdaObjetive } from './eda-objetive'

export class EdaObjetiveEvaluation {
  id: string
  objetive: EdaObjetive
  evaluation: EdaEvaluation
  qualification: number
  selftQualification: number
  created_at: Date
  updated_at: Date
  constructor(data: EdaObjetiveEvaluation) {
    this.id = data.id
    this.objetive = data.objetive
    this.evaluation = data.evaluation
    this.qualification = data.qualification
    this.selftQualification = data.selftQualification
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (data.objetive) this.objetive = new EdaObjetive(data.objetive)
    if (data.evaluation) this.evaluation = new EdaEvaluation(data.evaluation)
  }
}
