import { User } from '../user'
import { Cycle } from './cycle'
import { Period } from './period'
import { Plan } from './plan'
import { Program } from './program'

export class Section {
  id: string
  code: string
  details: string
  period: Period
  program: Program
  cycle: Cycle
  plan: Plan
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: Section) {
    this.id = data.id
    this.code = data.code
    this.details = data.details
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater
    this.period = data.period
    this.program = data.program
    this.cycle = data.cycle
    this.plan = data.plan

    if (data.plan) this.plan = new Plan(data.plan)
    if (data.cycle) this.cycle = new Cycle(data.cycle)
    if (data.period) this.period = new Period(data.period)
    if (data.program) this.program = new Program(data.program)
    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
  }
}
