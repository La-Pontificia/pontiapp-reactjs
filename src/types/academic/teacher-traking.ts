import { Branch } from '../rm/branch'
import { Schedule } from '../schedule'
import { User } from '../user'
import { SectionCourse } from './section-course'

export class TeacherTraking {
  id: string
  sectionCourse: SectionCourse
  schedule: Schedule
  branch: Branch
  date: Date
  trackingTime: Date
  evaluator: User
  evaluationNumber: number
  er1Json: object
  er1a: number
  er1b: number
  er1Obtained: number
  er1Qualification: string
  er2Json: object
  er2a1: number
  er2a2: number
  er2aObtained: number
  er2b1: number
  er2b2: number
  er2bObtained: number
  er2Total: number
  er2FinalGrade: number
  er2Qualification: string
  aditional1: string | null
  aditional2: string | null
  aditional3: string | null
  created_at: Date
  updated_at: Date

  constructor(d: TeacherTraking) {
    this.id = d.id
    this.sectionCourse = d.sectionCourse
    this.schedule = d.schedule
    this.branch = d.branch

    this.date = d.date
    this.evaluator = d.evaluator
    this.evaluationNumber = d.evaluationNumber

    this.trackingTime = d.trackingTime
    this.er1Json = d.er1Json
    this.er1a = d.er1a
    this.er1b = d.er1b
    this.er1Obtained = d.er1Obtained
    this.er1Qualification = d.er1Qualification
    this.er2Json = d.er2Json
    this.er2a1 = d.er2a1
    this.er2a2 = d.er2a2
    this.er2aObtained = d.er2aObtained
    this.er2b1 = d.er2b1
    this.er2b2 = d.er2b2
    this.er2bObtained = d.er2bObtained
    this.er2Total = d.er2Total
    this.er2FinalGrade = d.er2FinalGrade
    this.er2Qualification = d.er2Qualification
    this.aditional1 = d.aditional1
    this.aditional2 = d.aditional2
    this.aditional3 = d.aditional3

    this.created_at = d.created_at
    this.updated_at = d.updated_at

    if (this.branch) this.branch = new Branch(this.branch)
    if (this.sectionCourse)
      this.sectionCourse = new SectionCourse(this.sectionCourse)
    if (this.evaluator) this.evaluator = new User(this.evaluator)
  }
}
