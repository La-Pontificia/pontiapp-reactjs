import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { Period } from '@/types/academic/period'
import { Program } from '@/types/academic/program'
import { Section } from '@/types/academic/section'
import { SectionCourse } from '@/types/academic/section-course'
import { SectionCourseSchedule } from '@/types/academic/section-course-schedule'
import { BusinessUnit } from '@/types/business-unit'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm as useFormHook } from 'react-hook-form'
import React from 'react'
import { Branch } from '@/types/rm/branch'
import { parseTimeWithFormat } from '@/lib/dayjs'
import { toast } from 'anni'
import { useSlug } from '../+layout'

export type Answer = {
  questionId: string
  answer: string
}

export type FormValues = {
  program: Program | null
  period: Period | null
  section: Section | null
  sectionCourse: SectionCourse | null
  schedule: SectionCourseSchedule | null
  branch: Branch | null
  trackingTime: string
  evaluationNumber: string
  answers: Answer[]
}

export const useForm = ({
  open,
  refetch,
  setOpen
}: {
  open: boolean
  refetch: () => void
  setOpen: (open: boolean) => void
}) => {
  const { businessUnit } = useAuth()
  const { group } = useSlug()

  const { control, watch, reset, setValue, handleSubmit } =
    useFormHook<FormValues>({
      defaultValues: {
        answers: []
      }
    })

  const { mutate: createEvaluation, isPending } = useMutation({
    mutationFn: async (values: object) =>
      api.post('academic/te', {
        data: JSON.stringify(values),
        alreadyHandleError: false
      }),
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('En hora buena! La evaluación ha sido creada exitosamente.')
      reset({
        answers: [],
        trackingTime: '',
        evaluationNumber: '',
        program: null,
        period: null,
        section: null,
        sectionCourse: null,
        schedule: null,
        branch: null
      })
      refetch()
      setOpen(false)
    }
  })

  const { period, program, section, sectionCourse, schedule, answers } = watch()

  const { data: programs } = useQuery<Program[]>({
    queryKey: ['academic/programs', BusinessUnit],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Program[]>(
        `academic/programs?businessUnitId=${businessUnit?.id}`
      )
      if (!res.ok) return []
      return res.data.map((data) => new Program(data))
    }
  })

  const { data: periods } = useQuery<Period[]>({
    queryKey: ['academic/periods', businessUnit],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Period[]>(
        `academic/periods?businessUnitId=${businessUnit?.id}`
      )
      if (!res.ok) return []
      return res.data.map((data) => new Period(data))
    }
  })

  const { data: sections } = useQuery<Section[]>({
    queryKey: ['academic/sections', period, program],
    enabled: !!(open && period && program),
    queryFn: async () => {
      const res = await api.get<Section[]>(
        `academic/sections?periodId=${period?.id}&programId=${program?.id}`
      )
      if (!res.ok) return []
      return res.data.map((data) => new Section(data))
    }
  })

  const { data: sectionCourses } = useQuery<SectionCourse[]>({
    queryKey: ['academic/sections/courses', section],
    enabled: !!(open && section),
    queryFn: async () => {
      const res = await api.get<SectionCourse[]>(
        `academic/sections/courses?sectionId=${section?.id}`
      )
      if (!res.ok) {
        return []
      }
      return res.data.map((data) => new SectionCourse(data))
    }
  })

  const { data: schedules } = useQuery<SectionCourseSchedule[]>({
    queryKey: ['academic/sections/courses/schedules', sectionCourse],
    enabled: open && !!sectionCourse,
    queryFn: async () => {
      const res = await api.get<SectionCourseSchedule[]>(
        `academic/sections/courses/schedules?sectionCourseId=${sectionCourse?.id}`
      )
      if (!res.ok) return []
      return res.data.map((data) => new SectionCourseSchedule(data))
    }
  })

  const { data: branches } = useQuery<Branch[]>({
    queryKey: ['rm/branches'],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Branch[]>(`rm/branches`)
      if (!res.ok) {
        return []
      }
      return res.data.map((data) => new Branch(data))
    }
  })

  React.useEffect(() => {
    return () => {
      reset({
        answers: [],
        trackingTime: '',
        evaluationNumber: '',
        program: null,
        period: null,
        section: null,
        sectionCourse: null,
        schedule: null,
        branch: null
      })
    }
  }, [reset])

  const onSubmit = handleSubmit((values) => {
    createEvaluation({
      sectionCourseId: values.sectionCourse?.id,
      teacherId: sectionCourse?.teacher?.id,
      scheduleId: values.schedule?.id,
      branchId: values.branch?.id,
      trackingTime: parseTimeWithFormat(values.trackingTime!),
      evaluationNumber: values.evaluationNumber,
      answers: values.answers,
      groupId: group?.id
    })
  })

  return {
    periods,
    programs,
    control,
    period,
    program,
    sections,
    section,
    sectionCourses,
    sectionCourse,
    schedules,
    schedule,
    branches,
    answers,
    setValue,
    onSubmit,
    isPending
  }
}
