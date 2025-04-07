/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  InfoLabel,
  Checkbox
} from '@fluentui/react-components'
import { Dismiss24Regular, TableRegular } from '@fluentui/react-icons'

export default function FirstRubric({
  firstER,
  setFirstER,
  readOnly
}: {
  setFirstER: any
  firstER: any
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
        Abrir rúbrica 01
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
              Rúbrica 01
            </DialogTitle>
            <DialogContent>
              <table className="w-full border-stone-500/70">
                <thead className="">
                  <tr className="[&>th]:px-3 [&>th]:uppercase [&>th]:py-2">
                    <th>Competencia</th>
                    <th>Aspectos a observar</th>
                    <th className="text-center text-nowrap">
                      Escala{' '}
                      <InfoLabel
                        info={
                          <p className="text-left">
                            ✅ Cumple <br />❌ No cumple
                          </p>
                        }
                      ></InfoLabel>
                    </th>
                    <th>Obtenido</th>
                  </tr>
                </thead>
                <tbody className="[&>tr>td]:p-2 [&>tr]:divide-x border-t border-stone-500/70 [&>tr]:dark:divide-stone-500/70 [&>tr]:divide-stone-300 [&>tr]:">
                  <tr>
                    <td
                      className="border-x border-b border-stone-500/70"
                      rowSpan={3}
                    >
                      {typeof firstER.title === 'string' ? firstER.title : ''}
                    </td>
                  </tr>
                  <tr className="border-b border-stone-500/70">
                    <td>{firstER.a.description}</td>
                    <td className="text-center">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          disabled={readOnly}
                          onChange={() => {
                            setFirstER((prev: any) => ({
                              ...prev,
                              a: {
                                ...prev.a,
                                scale: !prev.a.scale,
                                obtained: prev.a.scale ? 0 : 50
                              }
                            }))
                          }}
                          checked={firstER.a.scale}
                        />
                      </div>
                    </td>
                    <td className="text-center">{firstER.a.obtained}%</td>
                  </tr>
                  <tr className="border-b border-stone-500/70">
                    <td>{firstER.b.description}</td>
                    <td className="text-center">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          disabled={readOnly}
                          onChange={() => {
                            setFirstER((prev: any) => ({
                              ...prev,
                              b: {
                                ...prev.b,
                                scale: !prev.b.scale,
                                obtained: prev.b.scale ? 0 : 50
                              }
                            }))
                          }}
                          checked={firstER.b.scale}
                        />
                      </div>
                    </td>
                    <td className="text-center">{firstER.b.obtained}%</td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="border-b border-stone-500/70">Total:</td>
                    <td className="text-center border-b border-stone-500/70">
                      {firstER.a.obtained + firstER.b.obtained}%
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className=""></td>
                    <td className="border-b border-stone-500/70">Nota:</td>
                    <td className="text-center border-b border-stone-500/70">
                      {((firstER.a.obtained + firstER.b.obtained) / 100) * 20}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="border-b border-stone-500/70">
                      Clasificación:
                    </td>
                    <td
                      data-approved={
                        firstER.a.obtained + firstER.b.obtained >= 51
                          ? ''
                          : undefined
                      }
                      className="font-semibold border-b border-stone-500/70 dark:text-red-400 text-red-700 data-[approved]:dark:text-green-400 data-[approved]:text-green-700 text-center"
                    >
                      {firstER.a.obtained + firstER.b.obtained >= 51
                        ? 'Aprobado'
                        : 'Desaprobado'}
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
