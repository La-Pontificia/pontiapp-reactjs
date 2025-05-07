import { ChartSections } from './chart-sections'
import { ChartSchedules } from './chart-shedules'
import React from 'react'
import { ChartPlans } from './chart-plans'
import { Period } from '@/types/academic/period'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/store/auth'
import { api } from '@/lib/api'
import { ChartClassrooms } from './chart-classrooms'

type ScheduleData = {
  data: Record<string, number>
  total: number
}
type SectionData = Record<string, Record<string, number>>
type ClassroomData = Record<string, number>
type PlanData = Record<string, number>

export type Data = {
  schedules: ScheduleData
  sections: SectionData
  programs: Record<string, string>
  classrooms: ClassroomData
  plans: PlanData
}

export default function AcademicPage() {
  const { businessUnit } = useAuth()
  const [period] = React.useState<Period | null>(null)

  // const { data: periods } = useQuery<Period[]>({
  //   queryKey: ['academic/periods', businessUnit],
  //   queryFn: async () => {
  //     const res = await api.get<Period[]>(
  //       'academic/periods' + `?businessUnitId=${businessUnit?.id}`
  //     )
  //     if (!res.ok) return []
  //     return res.data
  //   }
  // })

  const query = React.useMemo(() => {
    let query = `academic/stadistics?businessUnitId=${businessUnit?.id}`
    if (period) query += `&periodId=${period.id}`
    return query
  }, [period, businessUnit])
  const { data: stadistics } = useQuery<Data | null>({
    queryKey: ['academic/stadistics', businessUnit, period],
    queryFn: async () => {
      const res = await api.get<Data | null>(query)
      if (!res.ok) return null
      return res.data
    }
  })

  return (
    <div className="grow px-2 overflow-auto pb-4">
      <nav className="py-4 pb-2">
        <h2 className="text-center text-2xl  font-semibold">
          Gestión Académica
        </h2>
        {/* <div className='flex pb-3 flex-wrap gap-2'>
          <Field
            label="Periodo"
          >
            <Combobox
              clearable
              value={period ? period.name : ''}
              selectedOptions={period ? [period.id] : []}
              onOptionSelect={(_, data) => {
                const selectedPeriod = periods?.find((p) => p.id === data.optionValue);
                setPeriod(selectedPeriod || null);
              }}
              placeholder="Todos"
            >
              {periods?.map((period) => (
                <Option key={period.id} value={period.id}>
                  {period.name}
                </Option>
              ))}
            </Combobox>
          </Field>
        </div> */}
      </nav>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
        <ChartSchedules store={stadistics} />
        <ChartSections store={stadistics} />
        <ChartPlans store={stadistics} />
        <ChartClassrooms store={stadistics} />
      </div>
    </div>
  )
}
