import { User } from '../user'
import { Classroom } from './classroom'
import { SectionCourse } from './section-course'

type DateSchedule = Date[]

export class SectionCourseSchedule {
  id: string
  sectionCourse: SectionCourse
  classroom: Classroom
  startTime: Date
  endTime: Date
  daysOfWeek: string[]
  startDate: Date
  endDate: Date
  dates: DateSchedule
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: SectionCourseSchedule) {
    this.id = data.id
    this.sectionCourse = data.sectionCourse
    this.classroom = data.classroom
    this.startTime = data.startTime
    this.endTime = data.endTime
    this.daysOfWeek = data.daysOfWeek
    this.startDate = data.startDate
    this.endDate = data.endDate
    this.dates = data.dates
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater
    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
    if (data.sectionCourse)
      this.sectionCourse = new SectionCourse(data.sectionCourse)
    if (data.classroom) this.classroom = new Classroom(data.classroom)
  }
}
