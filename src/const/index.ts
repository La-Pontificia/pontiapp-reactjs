import {
  VITE_AREA_DEVELOPER_ID,
  VITE_DEPARTMENT_DEVELOPER_ID,
  VITE_JOB_DEVELOPER_ID,
  VITE_PRIVILEGE_DEVELOPER,
  VITE_ROLE_DEVELOPER_ID
} from '~/config/env'

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
  'lapontificia.edu.pe': 'La Pontificia'
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

  // Assistances management
  'assists:schedules': 'Asistencias con horarios',
  'assists:withUsers': 'Asistencias con usuarios del sistema',
  'assists:withoutUsers': 'Asistencias sin usuarios',
  'assists:summary': 'Resumen único de asistencias',
  'assists:report': 'Generar reportes de asistencias',
  'assists:reportFiles': 'Ver reportes de asistencias',
  'assists:databases': 'Bases de datos de asistencias',
  'assists:assistTerminals': 'Terminales de asistencias',

  // Edas management
  'edas:showAll': 'Ver todas las edas',
  'edas:show': 'Ver edas que supervisa',
  'edas:createAll': 'Registrar todas las edas',
  'edas:create': 'Registrar edas que supervisa',
  'edas:createYourself': 'Registrar sus edas',
  'edas:reset': 'Resetear edas',
  'edas:closeAll': 'Cerrar todas las edas',
  'edas:close': 'Cerrar las edas que supervisa',
  'edas:report': 'Generar reportes de edas',
  'edas:years': 'Años',
  'edas:goals': 'Objetivos',
  'edas:evaluations': 'Evaluaciones',
  'edas:questionnaires': 'Cuestionarios',
  'edas:questionnaireTemplates': 'Plantillas de cuestionarios',

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
  settings: 'Acceso a configuraciones del sistema'
}
