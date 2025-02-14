/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { modalities, scales, SecondRecord } from './state'
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  InfoLabel
} from '@fluentui/react-components'
import { Dismiss24Regular, TableRegular } from '@fluentui/react-icons'

export default function SecondRubric({
  secondGrade,
  secondQualification,
  secondTotal,
  secondER,
  setSecondER,
  readOnly
}: {
  secondER: SecondRecord
  setSecondER: React.Dispatch<React.SetStateAction<SecondRecord>>
  secondGrade: number
  secondQualification: string
  secondTotal: number
  readOnly: boolean
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        icon={<TableRegular />}
        className="w-full"
      >
        Abrir rúbrica 02
      </Button>
      <Dialog modalType="modal" open={open} onOpenChange={() => setOpen(false)}>
        <DialogSurface className="min-w-[100vw]">
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              Rúbrica 02
            </DialogTitle>
            <DialogContent>
              <table className="w-full">
                <thead>
                  <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:uppercase">
                    <th>Competencias</th>
                    <th>Indicador</th>
                    <th>Modalidad</th>
                    <th>Aspectos a observar</th>
                    <th>
                      Escala
                      <InfoLabel
                        info={
                          <>
                            <p>
                              <b>(No logrado)</b>: Nunca o casi nunca realiza la
                              acción.
                              <br />
                              <b>(Proceso)</b>: Algunas veces realiza la acción.
                              <br />
                              <b>(Logrado)</b>: Casi siempre realiza la acción.
                              <br />
                              <b>(Destacado)</b>: Siempre realiza la acción.
                            </p>
                          </>
                        }
                      ></InfoLabel>
                    </th>
                    <th>PESP</th>
                    <th className="text-nowrap">Obtenido (%)</th>
                  </tr>
                </thead>
                <tbody className="">
                  {Object.entries(secondER).map(([ak, a]) =>
                    Object.entries(a.indicators).map(([bk, b]) =>
                      Object.entries(b.aspects).map(([ck, c]) => {
                        return (
                          <React.Fragment key={ck}>
                            <tr className="border [&>td]:p-2 [&>td]:px-2">
                              {ak === bk && bk === ck && (
                                <td
                                  className="border text-center font-semibold border-stone-500/70"
                                  rowSpan={8}
                                >
                                  {a.title}
                                </td>
                              )}
                              {bk === ck && (
                                <td
                                  className="border text-center font-semibold border-stone-500/70"
                                  rowSpan={Object.entries(b.aspects).length}
                                >
                                  {b.title}
                                </td>
                              )}
                              <td className="border border-stone-500/70">
                                <select
                                  disabled={readOnly}
                                  className="bg-transparent dark:bg-[#2f2e2b]"
                                  value={c.modality}
                                  onChange={(e) => {
                                    setSecondER((prev) => ({
                                      ...prev,
                                      [ak]: {
                                        ...prev[ak],
                                        indicators: {
                                          ...prev[ak].indicators,
                                          [bk]: {
                                            ...prev[ak].indicators[bk],
                                            aspects: {
                                              ...prev[ak].indicators[bk]
                                                .aspects,
                                              [ck]: {
                                                ...prev[ak].indicators[bk]
                                                  .aspects[ck],
                                                modality: e.target.value
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }))
                                  }}
                                >
                                  {modalities.map((modality) => (
                                    <option key={modality} value={modality}>
                                      {modality}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="border border-stone-500/70">
                                {c.title}
                              </td>
                              <td className="border border-stone-500/70">
                                <select
                                  className="bg-transparent dark:bg-[#2f2e2b]"
                                  value={c.scale}
                                  disabled={readOnly}
                                  onChange={(e) => {
                                    setSecondER((prev) => {
                                      const scale = Number(e.target.value)
                                      const pesp = (scale * a.pespVariable) / 4

                                      const newAspects = Object.entries(
                                        b.aspects
                                      ).map(([_kk, _a]) => ({
                                        ..._a,
                                        scale: _kk == ck ? scale : _a.scale,
                                        pesp: _kk == ck ? pesp : _a.pesp
                                      }))

                                      const obtained = Object.entries(
                                        newAspects
                                      )
                                        .reduce(
                                          (acc, [, acccc]) => acc + acccc.pesp,
                                          0
                                        )
                                        .toFixed(1)

                                      return {
                                        ...prev,
                                        [ak]: {
                                          ...(prev[ak] as any),
                                          indicators: {
                                            ...prev[ak].indicators,
                                            [bk]: {
                                              ...prev[ak].indicators[bk],
                                              obtained,
                                              aspects: {
                                                ...prev[ak].indicators[bk]
                                                  .aspects,
                                                [ck]: {
                                                  ...prev[ak].indicators[bk]
                                                    .aspects[ck],
                                                  pesp,
                                                  scale
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    })
                                  }}
                                >
                                  {Object.entries(scales).map(
                                    ([scale, value]) => (
                                      <option key={scale} value={scale}>
                                        {value}
                                      </option>
                                    )
                                  )}
                                </select>
                              </td>
                              <td className="border text-center border-stone-500/70">
                                {Number(c.pesp).toFixed(1)}%
                              </td>
                              {bk === ck && (
                                <td
                                  className="border text-center border-stone-500/70"
                                  rowSpan={Object.entries(b.aspects).length}
                                >
                                  {b.obtained}%
                                </td>
                              )}
                            </tr>
                          </React.Fragment>
                        )
                      })
                    )
                  )}
                  <tr className="[&>td]:p-2 [&>td]:px-2">
                    <td colSpan={4}></td>
                    <td
                      colSpan={2}
                      className="font-semibold text-white bg-blue-800 text-nowrap"
                    >
                      % TOTAL:
                    </td>
                    <td className="border text-center font-semibold border-stone-500/70">
                      {secondTotal}%
                    </td>
                  </tr>
                  <tr className=" [&>td]:p-2 [&>td]:px-2">
                    <td colSpan={4}></td>
                    <td
                      colSpan={2}
                      className="font-semibold text-white bg-blue-800 text-nowrap"
                    >
                      NOTA:
                    </td>
                    <td className="border text-center font-semibold border-stone-500/70">
                      {secondGrade}
                    </td>
                  </tr>
                  <tr className="[&>td]:p-2 [&>td]:px-2">
                    <td colSpan={4}></td>
                    <td
                      colSpan={2}
                      className="font-semibold text-white bg-blue-800 text-nowrap"
                    >
                      CLASIFICACIÓN:
                    </td>
                    <td className="border text-center font-semibold border-stone-500/70">
                      {secondQualification}
                    </td>
                  </tr>
                </tbody>
              </table>
            </DialogContent>
            <DialogActions className="pt-5">
              <DialogTrigger>
                <Button appearance="primary">Aceptar</Button>
              </DialogTrigger>
              <DialogTrigger>
                <Button appearance="outline">Cerrar</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
