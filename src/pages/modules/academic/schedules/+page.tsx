import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '@/commons/search-box'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '@/types/paginate-response'
import { api } from '@/lib/api'
import Pagination from '@/commons/pagination'
import Item from './item'
import { Period } from '@/types/academic/period'
import { TableContainer } from '@/components/table-container'
import { useDebounce } from 'hothooks'
import { useAuth } from '@/store/auth'
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Field,
  Spinner
} from '@fluentui/react-components'
import { ExcelColored } from '@/icons'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { Link } from 'react-router'
import { Program } from '@/types/academic/program'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function SectionPeriodsPage() {
  const { businessUnit } = useAuth()

  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })

  const [isPending, setIsPending] = React.useState({
    normal: false,
    pontisis: false,
    pontisisTeachers: false
  })

  const [selected, setSelected] = React.useState<Period[]>([])
  const [programsSelected, setProgramsSelected] = React.useState<Program[]>([])
  const [openReport, setOpenReport] = React.useState(false)
  const query = React.useMemo(() => {
    let uri = `?paginate=true&businessUnitId=${businessUnit?.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`
    return uri
  }, [filters, businessUnit])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const { data: periods, isLoading } = useQuery<ResponsePaginate<
    Period[]
  > | null>({
    queryKey: ['academic/periods', query],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Period[]>>(
        'academic/periods' + query
      )
      if (!res.ok) return null
      return res.data
    }
  })

  const { data: programs } = useQuery<Program[]>({
    queryKey: ['academic/programs', filters, businessUnit, 'array'],
    queryFn: async () => {
      const res = await api.get<Program[]>('academic/programs')
      if (!res.ok) return []
      return res.data
    }
  })

  const allSelected = React.useMemo(() => {
    return selected.length === periods?.data.length
  }, [periods, selected])

  const someSelected = React.useMemo(() => {
    return selected.length > 0 && !allSelected
  }, [allSelected, selected])

  const queryReport = React.useMemo(() => {
    const selectedPeriods = selected.map((i) => i.id).join(',')
    const selectedPrograms = programsSelected.map((i) => i.id).join(',')
    return `?periodIds=${selectedPeriods}&programIds=${selectedPrograms}`
  }, [selected, programsSelected])

  const uri = (type?: string) =>
    type === 'normal'
      ? 'report'
      : type === 'pontisis'
      ? 'report-pontisis'
      : 'report-pontisis-teachers'

  const { mutate: handleReport, isPending: reporting } = useMutation({
    mutationFn: ({ type }: { type?: string }) =>
      api.post(
        `academic/sections/courses/schedules/${uri(type)}${queryReport}`,
        {
          alreadyHandleError: false
        }
      ),
    onSuccess: (data) => {
      if (data.ok) {
        window.open(String(data.data), '_blank')
        setOpenReport(false)
        setSelected([])
        setProgramsSelected([])
        setIsPending({
          normal: false,
          pontisis: false,
          pontisisTeachers: false
        })
      }
    },
    onError: (error) => {
      setIsPending({
        normal: false,
        pontisis: false,
        pontisisTeachers: false
      })
      toast.error(handleError(error.message))
    }
  })

  const programsGroupedByBusinessUnit = React.useMemo(() => {
    return programs?.reduce((acc, program) => {
      const businessUnitName = program.businessUnit.name
      if (!acc[businessUnitName]) {
        acc[businessUnitName] = []
      }
      acc[businessUnitName].push(program)
      return acc
    }, {} as Record<string, Program[]>)
  }, [programs])

  return (
    <>
      <Dialog
        open={openReport}
        onOpenChange={(_, e) => setOpenReport(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Exportar excel</DialogTitle>
            <DialogContent>
              <p className="w-full">
                Enviaremos un correo del link de descarga o tambien puedes
                descargarlo desde la sección de{' '}
                <Link
                  to="/m/academic/report-files"
                  target="_blank"
                  className="underline"
                >
                  archivo de reportes
                </Link>{' '}
                del módulo.
              </p>
              <div className="pt-2 flex flex-col">
                <Field required label="Periodos" />
                {periods?.data.map((period) => {
                  const isSelected = selected.some((i) => i.id === period.id)

                  return (
                    <Checkbox
                      checked={isSelected}
                      onClick={() =>
                        setSelected((prev) =>
                          isSelected
                            ? prev.filter((i) => i.id !== period.id)
                            : [...prev, period]
                        )
                      }
                      label={period.name}
                    />
                  )
                })}
                <Divider />
                <Field required label="Programas academicas" />

                {programsGroupedByBusinessUnit &&
                  Object.entries(programsGroupedByBusinessUnit).map(
                    ([business, programs]) => (
                      <div className="pl-2 pt-2 flex flex-col">
                        <Field label={business} />
                        {programs?.map((program) => {
                          const isSelected = programsSelected.some(
                            (i) => i.id === program.id
                          )
                          return (
                            <Checkbox
                              checked={isSelected}
                              onClick={() =>
                                setProgramsSelected((prev) =>
                                  isSelected
                                    ? prev.filter((i) => i.id !== program.id)
                                    : [...prev, program]
                                )
                              }
                              label={program.name}
                            />
                          )
                        })}
                      </div>
                    )
                  )}
              </div>
            </DialogContent>
            <div className="grid gap-2 col-span-2">
              <Button
                onClick={() => {
                  handleReport({
                    type: 'normal'
                  })
                  setIsPending((prev) => ({
                    ...prev,
                    normal: true
                  }))
                }}
                disabled={reporting}
                icon={isPending.normal ? <Spinner size="tiny" /> : undefined}
                appearance="secondary"
              >
                Normal
              </Button>
              <Button
                onClick={() => {
                  handleReport({
                    type: 'pontisis'
                  })
                  setIsPending((prev) => ({
                    ...prev,
                    pontisis: true
                  }))
                }}
                disabled={reporting}
                icon={isPending.pontisis ? <Spinner size="tiny" /> : undefined}
                appearance="secondary"
              >
                Para pontisis
              </Button>
              <Button
                onClick={() => {
                  handleReport({
                    type: 'pontisisTeachers'
                  })
                  setIsPending((prev) => ({
                    ...prev,
                    pontisisTeachers: true
                  }))
                }}
                disabled={reporting}
                icon={
                  isPending.pontisisTeachers ? (
                    <Spinner size="tiny" />
                  ) : undefined
                }
                appearance="secondary"
              >
                Para pontisis (Docentes)
              </Button>
              <DialogTrigger disableButtonEnhancement>
                <Button className="!mt-3" appearance="secondary">
                  Cancelar
                </Button>
              </DialogTrigger>
            </div>
            {/* <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button
                  shape="circular"
                  disabled={reporting}
                  appearance="secondary"
                >
                  Cancelar
                </Button>
              </DialogTrigger>
              <Button
                onClick={() =>
                  handleReport({
                    type: 'pontisis'
                  })
                }
                disabled={
                  reporting || !selected.length || !programsSelected.length
                }
                icon={reporting ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
                shape="circular"
              >
                Pontisis
              </Button>
              <Button
                onClick={() => handleReport({})}
                disabled={
                  reporting || !selected.length || !programsSelected.length
                }
                icon={reporting ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
                shape="circular"
              >
                Exportar
              </Button>
            </DialogActions> */}
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Helmet>
        <title>Horarios | Pontiapp</title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={!periods?.data?.length}
        footer={
          periods && (
            <Pagination
              onChangePage={(page) => setFilters((prev) => ({ ...prev, page }))}
              state={periods}
            />
          )
        }
        nav={
          <>
            <nav className="flex items-center gap-3 flex-wrap w-full">
              <h1 className="font-semibold flex-grow text-xl">Horarios</h1>
              <Button
                onClick={() => {
                  setOpenReport(true)
                }}
                size="small"
                icon={<ExcelColored />}
                appearance="transparent"
              >
                Exportar Excel
              </Button>
              <SearchBox onSearch={setValue} placeholder="Filtrar " />
            </nav>
          </>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                checked={allSelected ? true : someSelected ? 'mixed' : false}
                onClick={() => {
                  setSelected((prev) => {
                    if (prev.length > 0) return []
                    return periods?.data || []
                  })
                }}
              />
              <TableHeaderCell>Periodo</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods?.data.map((item) => (
              <Item
                key={item.id}
                setSelected={setSelected}
                selected={selected}
                item={item}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
