import {
  VITE_AREA_DEVELOPER_ID,
  VITE_DEPARTMENT_DEVELOPER_ID,
  VITE_JOB_DEVELOPER_ID,
  VITE_PRIVILEGE_DEVELOPER,
  VITE_ROLE_DEVELOPER_ID
} from '@/config/env'

export const businesses = {
  'https://www.elp.edu.pe': {
    logo: '/businesses/elp.webp',
    acronym: 'ELP',
    name: 'Escuela Superior La Pontificia'
  },
  'https://www.ilp.edu.pe': {
    logo: '/businesses/ilp.webp',
    acronym: 'ILP',
    name: 'Instituo La Pontificia'
  },
  'https://www.cybernet.edu.pe': {
    logo: '/businesses/cc.webp',
    acronym: 'CC',
    name: 'Colegio Cybernet'
  },
  'https://www.idiomaslp.edu.pe/': {
    logo: '/businesses/il.webp',
    acronym: 'IL',
    name: 'Idiomas La Pontificia'
  },
  'https://www.continualp.edu.pe/': {
    logo: '/businesses/ec.webp',
    acronym: 'EC',
    name: 'Educacion Continua La Pontificia'
  }
} as const

export const modules = {
  '/modules/collaborators': {
    name: 'Gestión Colaboradores',
    icon: '/modules/collaborators.webp'
  }
} as const

export const CONTACT_TYPES = {
  email: 'Correo electrónico',
  phone: 'Número de teléfono',
  whatsapp: 'WhatsApp'
} as const

export const calendarStrings = {
  days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  goToToday: 'Ir a hoy',
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  shortDays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  shortMonths: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ]
}

export const localizedStrings = calendarStrings

export const days = {
  '1': {
    label: 'Lunes',
    short: 'Lun'
  },
  '2': {
    label: 'Martes',
    short: 'Mar'
  },
  '3': {
    label: 'Miércoles',
    short: 'Mié'
  },
  '4': {
    label: 'Jueves',
    short: 'Jue'
  },
  '5': {
    label: 'Viernes',
    short: 'Vie'
  },
  '6': {
    label: 'Sábado',
    short: 'Sáb'
  },
  '7': {
    label: 'Domingo',
    short: 'Dom'
  }
} as const

export const availableDomains = {
  'lapontificia.edu.pe': 'La Pontificia',
  'elp.edu.pe': 'Escuela Superior La Pontificia',
  'ilp.edu.pe': 'Instituto La Pontificia',
  'idiomaslp.edu.pe': 'Idiomas La Pontificia',
  'continualp.edu.pe': 'Educación Continua La Pontificia',
  'cybenet.edu.pe': 'Colegio Cybernet'
} as const

export const AREA_DEVELOPER_ID = VITE_AREA_DEVELOPER_ID
export const DEPARTMENT_DEVELOPER_ID = VITE_DEPARTMENT_DEVELOPER_ID
export const JOB_DEVELOPER_ID = VITE_JOB_DEVELOPER_ID
export const ROLE_DEVELOPER_ID = VITE_ROLE_DEVELOPER_ID
export const PRIVILEGE_DEVELOPER = VITE_PRIVILEGE_DEVELOPER

export const PRIVILEGES = {
  development: 'Development',

  // Collaborators management
  'users:show': 'Ver usuarios',
  'users:create': 'Registrar usuarios',
  'users:edit': 'Editar usuarios',
  'users:editYourself': 'Editar su propio usuario',
  'users:asignCustomPrivileges': 'Asignar privilegios personalizados',
  'users:asignManager': 'Asignar jefes inmediato a usuarios',
  'users:toggleStatus': 'Deshabilitar o habilitar usuarios',
  'users:createVersion': 'Crear versiones de usuarios',
  'users:resetPassword': 'Restablecer contraseñas',
  'users:teams:create': 'Registrar grupos de usuarios',
  'users:report:generate': 'Generar reportes de usuarios',
  'users:teams': 'Ver grupos de usuarios',
  'users:reportFiles': 'Acceso a reportes de usuarios',
  'users:areas': 'Areas de trabajo de usuarios',
  'users:departments': 'Departamentos de usuarios',
  'users:jobs': 'Puestos de trabajo de usuarios',
  'users:roles': 'Cargos de usuarios',
  'users:userRoles': 'Roles y permisos de usuarios',
  'users:contractTypes': 'Tipos de contratos de usuarios',
  'users:schedules:archived': 'Horarios archivados',
  'users:files:all': 'Visualizar todos los archivos de reportes',
  'users:sessions': 'Ver sesiones de usuarios',

  // Assistances management
  'assists:schedules': 'Asistencias con horarios',
  'assists:withUsers': 'Asistencias con usuarios del sistema',
  'assists:withoutUsers': 'Asistencias sin usuarios',
  'assists:summary': 'Resumen único de asistencias',
  'assists:report': 'Generar reportes de asistencias',
  'assists:reportFiles': 'Ver reportes de asistencias',
  'assists:databases': 'Bases de datos de asistencias',
  'assists:assistTerminals': 'Terminales de asistencias',
  'assists:tools': 'Herramientas de asistencias',

  // Attentions management
  'attentions:tickets': '(Tickets) - Ver tickets',
  'attentions:tickets:create': '(Tickets) - Registrar tickets',
  'attentions:register': '(Tickets) - Registro rápido de tickets',
  'attentions:shiftScreen': '(Tickets) - Pantalla de turnos',
  'attentions:answerTickets': '(Tickets) - Atender tickets',
  'attentions:show': '(Tickets) - Ver atenciones',
  'attentions:reportFiles': '(Tickets) - Ver reportes de atenciones',
  'attentions:positions': '(Tickets) - Puestos de atención',
  'attentions:services': '(Tickets) - Servicios de atención (Opciones)',
  'attentions:businessUnits': '(Tickets) - Unidades de negocio de atención',

  // Edas management
  'edas:collaborators:inHisSupervision':
    '(Edas) - Ver solo colaboradores bajo su supervisión',
  'edas:collaborators:all': '(Edas) - Ver todos los colaboradores',
  'edas:my': '(Edas) - Ver sus edas',
  'edas:create:my': '(Edas) - Crear sus edas',
  'edas:create:inHisSupervision': '(Edas) - Crear edas bajo su supervisión',
  'edas:create:all': '(Edas) - Crear edas de cualquier colaborador',
  'edas:delete': '(Edas) - Eliminar edas de cualquier colaborador',
  'edas:objetives:edit': '(Edas) - Editar objetivos',
  'edas:objetives:delete': '(Edas) - Eliminar objetivos',
  'edas:objetives:approve': '(Edas) - Aprobar objetivos',
  'edas:evaluations:qualify': '(Edas) - Calificar evaluaciones',
  'edas:evaluations:selftQualify': '(Edas) - Auto calificar evaluaciones',
  'edas:evaluations:close': '(Edas) - Cerrar evaluaciones',

  // Events management
  'events:show': 'Eventos',
  'events:create': 'Registrar eventos',
  'events:edit': 'Editar eventos',
  'events:delete': 'Eliminar eventos',
  'events:records:register': 'Registrar asistencias a eventos',
  'events:records:view': 'Ver asistencias a eventos',
  'events:records:reportFiles': 'Visualizar reportes de registros de eventos',
  'events:records:report': 'Generar reportes de registros de eventos',

  // Audits management
  audits: 'Auditoria del sistema',

  // Events management
  'tickets:show': 'Ver tickets',

  // Settings management
  settings: 'Acceso a configuraciones del sistema',

  // Resource management
  'academic:trakingTeachers': '(Académica) Seguimiento de docentes',
  'academic:schedules': '(Académica) Horarios académicos',
  'academic:programs': '(Académica) Programas académicos',
  'academic:plans': '(Académica) Planes de estudio',
  'academic:periods': '(Académica) Periodos académicos',
  'academic:sections': '(Académica) Secciones académicas',
  'academic:cycles': '(Académica) Ciclos académicos',
  'academic:courses': '(Académica) Cursos académicos',
  'academic:pavilionsClassrooms': '(Académica) Pabellones y aulas',
  'academic:reportFiles': '(Académica) Archivo de reportes',
  'academic:areas': '(Académica) Areas académicas',
  'academic:teacherSchedules': '(Académica) Horarios de docentes'
}

export const BIRTHDAY_MESSAGE: string[] = [
  'Que este nuevo año te traiga grandes logros y alegrías.',
  'Te deseamos un año lleno de éxito y momentos felices.',
  'Que todos tus sueños y metas se hagan realidad en este nuevo año.',
  'Que cada día esté lleno de nuevas oportunidades para ti.',
  'Que este año te traiga todo lo que te mereces y más.',
  'Feliz cumpleaños, que cada meta que te propongas se haga realidad.',
  'Que este día marque el comienzo de un año lleno de bendiciones.',
  'Te deseamos un año increíble lleno de crecimiento y felicidad.',
  'Que este nuevo ciclo esté lleno de éxitos, salud y felicidad.',
  'Que cada día del año esté lleno de momentos inolvidables para ti.'
] as const

export const PATHNAMES = {
  programs: 'Programas',
  plans: 'Planes de Estudio',
  cycles: 'Ciclos',
  courses: 'Cursos',
  sections: 'Secciones',
  periods: 'Periodos',
  classrooms: 'Aulas',
  pavilions: 'Pabellones'
} as const

export const CLASSROOM_TYPES = [
  'Aula computo',
  'Aula teoria',
  'Aula virtual',
  'Lab. computo',
  'Lab. CIIE',
  'Taller enfermeria'
] as const
