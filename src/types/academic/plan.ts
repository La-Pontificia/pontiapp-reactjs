import { User } from '../user'
import { Course } from './course'
import { Cycle } from './cycle'
import { Program } from './program'

export class Plan {
  id: string
  name: string
  program: Program
  courses: Course[]
  status: boolean
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: Plan) {
    this.id = data.id
    this.name = data.name
    this.courses = data.courses
    this.program = data.program
    this.status = data.status
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (data.courses) {
      this.courses = data.courses.map((course) => new Course(course))
    }

    if (data.creator) this.creator = new User(data.creator)

    if (data.updater) this.updater = new User(data.updater)

    if (data.program) this.program = new Program(data.program)
  }
}

export class PlanCourse {
  id: string
  plan: Plan
  cycle: Cycle
  course: Course
  status: boolean
  name: string
  teoricHours: number
  practiceHours: number
  credits: number
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: PlanCourse) {
    this.id = data.id
    this.plan = data.plan
    this.cycle = data.cycle
    this.course = data.course
    this.status = data.status
    this.name = data.name
    this.teoricHours = data.teoricHours
    this.practiceHours = data.practiceHours
    this.credits = data.credits

    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (data.creator) this.creator = new User(data.creator)

    if (data.cycle) this.cycle = new Cycle(data.cycle)

    if (data.updater) this.updater = new User(data.updater)

    if (data.plan) this.plan = new Plan(data.plan)

    if (data.course) this.course = new Course(data.course)
  }
}
