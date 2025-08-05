import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Tooltip
} from '@fluentui/react-components'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@/components/table'

import { AddFilled } from '@fluentui/react-icons'
import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '@/commons/search-box'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ResponsePaginate } from '@/types/paginate-response'
import Item from './item'
import Pagination from '@/commons/pagination'
import { Link } from 'react-router'
import { toast } from 'anni'
import { TableContainer } from '@/components/table-container'
import { useDebounce } from 'hothooks'
import Form from './form'
import { TeGroup } from '@/types/academic/te-group'
import { useAuth } from '@/store/auth'
import { ExcelColored } from '@/icons'
import { handleError } from '@/utils'

export type Filter = {
  q: string | null
}

export default function TeGroupsGroup() {
  const [openReport, setOpenReport] = React.useState(false)
  const [selected, setSelected] = React.useState<TeGroup[]>([])
  const [openForm, setOpenForm] = React.useState(false)
  const [filters, setFilters] = React.useState<Filter>({
    q: null
  })

  const { user } = useAuth()
  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    if (filters.q) uri += `&q=${filters.q}`
    return uri
  }, [filters])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const {
    data: evaluations,
    isLoading,
    refetch
  } = useQuery<ResponsePaginate<TeGroup[]> | null>({
    queryKey: ['academic/te/gro', query],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<TeGroup[]>>(
        'academic/te/gro' + query
      )
      if (!res.ok) return null
      return {
        ...res.data,
        data: res.data.data.map((data) => new TeGroup(data))
      }
    }
  })

  const queryReport = React.useMemo(() => {
    const selectedGroups = selected.map((i) => i.id).join(',')
    return `?groupIds=${selectedGroups}`
  }, [selected])

  const { mutate: handleReport, isPending: reporting } = useMutation({
    mutationFn: () =>
      api.post(`academic/te/report${queryReport}`, {
        alreadyHandleError: false
      }),
    onSuccess: (data) => {
      if (data.ok) {
        window.open(String(data.data), '_blank')
        setOpenReport(false)
        setSelected([])
      }
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  const allSelected = React.useMemo(() => {
    return selected.length === evaluations?.data.length
  }, [evaluations, selected])

  const someSelected = React.useMemo(() => {
    return selected.length > 0 && !allSelected
  }, [allSelected, selected])

  return (
    <>
      <Helmet>
        <title>Grupo de evaluaciones y seguimiento a docentes | PontiApp</title>
      </Helmet>

      <TableContainer
        isLoading={isLoading}
        isEmpty={!evaluations?.data?.length}
        footer={evaluations && <Pagination state={evaluations} />}
        nav={
          <nav className="flex items-center gap-3 flex-wrap w-full">
            <h1 className="font-semibold flex-grow text-xl">
              Grupo de evaluaciones
            </h1>
            <button
              disabled={
                !user.hasPrivilege('academic:teacherEvaluation:groups:write')
              }
              className="flex disabled:opacity-50 disabled:grayscale font-semibold items-center gap-1"
              onClick={() => setOpenForm(true)}
            >
              <AddFilled
                fontSize={20}
                className="dark:text-blue-600 text-blue-700"
              />
              Nuevo
            </button>

            <Form
              refetch={refetch}
              open={openForm}
              onOpenChange={setOpenForm}
              defaultProp={null}
            />
            <Tooltip
              content={
                selected.length === 0
                  ? 'Selecciona al menos un grupo para generar el reporte'
                  : 'Exportar excel'
              }
              relationship="description"
            >
              <button
                className="flex disabled:grayscale disabled:opacity-50 font-semibold items-center gap-1"
                onClick={() => setOpenReport(true)}
                disabled={selected.length === 0}
              >
                <ExcelColored size={20} />
                Excel
                {selected.length > 0 && (
                  <Badge color="brand" appearance="tint" size="small">
                    {selected.length}
                  </Badge>
                )}
              </button>
            </Tooltip>

            <SearchBox onSearch={setValue} placeholder="Filtrar " />
          </nav>
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
                    return evaluations?.data || []
                  })
                }}
                type="radio"
              />
              <TableHeaderCell>Nombre</TableHeaderCell>
              <TableHeaderCell className="max-md:!hidden">
                Registrado por
              </TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations?.data?.map((item) => (
              <Item
                setSelected={setSelected}
                selected={selected}
                refetch={refetch}
                key={item.id}
                item={item}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openReport}
        onOpenChange={(_, e) => setOpenReport(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              Verifica los filtros seleccionados antes de generar el reporte.
            </DialogTitle>
            <DialogContent>
              <p className="w-full">
                Por favor espere un momento, tambien puedes cerrar esta alerta,
                igualmente enviaremos un correo del link de descarga o tambien
                puedes descargarlo desde la sección de{' '}
                <Link
                  to="/m/academic/report-files"
                  target="_blank"
                  className="underline"
                >
                  archivo de reportes
                </Link>{' '}
                del módulo.
              </p>

              <div className="pt-4">
                <p className="font-semibold">Grupos seleccionados</p>
                <ul className="list-disc list-inside">
                  {selected.map((item) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={() => handleReport()}
                disabled={reporting}
                icon={reporting ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                Exportar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
