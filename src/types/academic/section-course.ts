import { User } from '../user'
import { PlanCourse } from './plan'
import { Section } from './section'

export class SectionCourse {
  id: string
  planCourse: PlanCourse
  section: Section
  teacher: User
  schedulesCount: number
  created_at: Date
  updated_at: Date
  creator: User
  updater: User

  constructor(data: SectionCourse) {
    this.id = data.id
    this.planCourse = data.planCourse
    this.section = data.section
    this.schedulesCount = data.schedulesCount
    this.teacher = data.teacher
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater

    if (data.planCourse) this.planCourse = new PlanCourse(data.planCourse)
    if (data.section) this.section = new Section(data.section)
    if (data.teacher) this.teacher = new User(data.teacher)
    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
  }
}
