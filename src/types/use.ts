export class User {
  id: string
  profile: string
  dni: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
  updated_by: string
  created_by: string
  status: number
  email: string
  email_access?: null
  username: string
  entry_date: string
  exit_date: string
  date_of_birth: string
  phone_number: string
  display_name?: null
  role: Role
  full_name?: string
  role_position: RolePosition

  constructor(data: User) {
    this.id = data.id
    this.profile = data.profile
    this.dni = data.dni
    this.first_name = data.first_name
    this.last_name = data.last_name
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.updated_by = data.updated_by
    this.created_by = data.created_by
    this.status = data.status
    this.email = data.email
    this.email_access = data.email_access
    this.username = data.username
    this.entry_date = data.entry_date
    this.exit_date = data.exit_date
    this.date_of_birth = data.date_of_birth
    this.phone_number = data.phone_number
    this.display_name = data.display_name
    this.full_name = data.full_name
    this.role = data.role
    this.role_position = data.role_position
  }

  displayName(): string {
    if (this.display_name) return this.display_name

    const firstNameParts = this.first_name.trim().split(' ')
    const firstName = firstNameParts[0]
    const lastNameParts = this.last_name.trim().split(' ')
    let lastName = lastNameParts[0]

    if (lastNameParts.length > 1)
      lastName = lastNameParts.slice(0, -1).join(' ')

    return `${firstName} ${lastName}`
  }
}

interface Role {
  id: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  privileges?: string[] | null
  title: string
  status?: null
  level: number
}

interface RolePosition {
  id: string
  name: string
  id_job_position: string
  id_department: string
  created_at: string
  updated_at?: null
  code: string
  created_by: string
  updated_by?: null
  job_position: JobPosition
  department: Department
}

interface JobPosition {
  id: string
  level: number
  name: string
  code: string
  created_at: string
  updated_at?: null
  created_by: string
  updated_by?: null
}

interface Department {
  id: string
  code: string
  name: string
  id_area: string
  created_at: string
  updated_at?: null
  created_by: string
  updated_by?: null
  area: Area
}

interface Area {
  id: string
  code: string
  name: string
  created_at: string
  updated_at?: null
  created_by: string
  updated_by?: null
}
