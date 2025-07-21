import { User } from '../user'
import { SectionCourse } from './section-course'
import { TeCategory } from './te-category'

export class Tevaluation {
  id: string
  trackingTime: Date
  teacher: User | null
  evaluator: User | null
  sectionCourse: SectionCourse | null
  creator: User | null
  updater: User | null
  created_at: Date
  updated_at: Date

  constructor(d: Tevaluation) {
    this.id = d.id
    this.trackingTime = d.trackingTime
    this.teacher = d.teacher ? new User(d.teacher) : null
    this.evaluator = d.evaluator ? new User(d.evaluator) : null
    this.sectionCourse = d.sectionCourse
      ? new SectionCourse(d.sectionCourse)
      : null
    this.creator = d.creator ? new User(d.creator) : null
    this.updater = d.updater ? new User(d.updater) : null
    this.created_at = d.created_at
    this.updated_at = d.updated_at
  }
}

export class EvaluationDetails extends Tevaluation {
  categories: TeCategory[]

  constructor(d: EvaluationDetails) {
    super(d)
    this.categories = d.categories.map((category) => new TeCategory(category))
  }
}
