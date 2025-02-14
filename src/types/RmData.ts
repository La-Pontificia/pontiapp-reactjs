import { BusinessUnit } from './business-unit'
import { User } from './user'

export class RmData {
  id: string
  name: string
  address?: string
  created_at: Date
  updated_at: Date

  constructor(d: RmData) {
    this.id = d.id
    this.name = d.name
    this.address = d.address
    this.created_at = d.created_at
    this.updated_at = d.updated_at
  }
}

export class RmTT {
  id: string
  created_at: Date
  updated_at: Date
  teacherDocumentId: string
  teacherFullName: string
  period: string
  cycle: string
  section: string
  classRoom: string
  branchId: string
  branch: RmData
  businessUnitId: string
  businessUnit: BusinessUnit
  area: string
  academicProgram: string
  course: string
  date: Date
  evaluator: User
  evaluationNumber: number
  startOfClass: Date
  endOfClass: Date
  trackingTime: Date
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

  constructor(d: RmTT) {
    this.id = d.id
    this.created_at = d.created_at
    this.updated_at = d.updated_at
    this.teacherDocumentId = d.teacherDocumentId
    this.teacherFullName = d.teacherFullName
    this.period = d.period
    this.cycle = d.cycle
    this.section = d.section
    this.classRoom = d.classRoom
    this.branchId = d.branchId
    this.branch = d.branch
    this.businessUnitId = d.businessUnitId
    this.businessUnit = d.businessUnit
    this.area = d.area
    this.academicProgram = d.academicProgram
    this.course = d.course
    this.date = d.date
    this.evaluator = d.evaluator
    this.evaluationNumber = d.evaluationNumber
    this.startOfClass = d.startOfClass
    this.endOfClass = d.endOfClass
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

    if (this.branch) this.branch = new RmData(this.branch)
    if (this.businessUnit)
      this.businessUnit = new BusinessUnit(this.businessUnit)
    if (this.evaluator) this.evaluator = new User(this.evaluator)
  }
}
