/* eslint-disable @typescript-eslint/no-explicit-any */
import { EdaObjetive } from '@/types/eda-objetive'
import parse from 'html-react-parser'
import React from 'react'
import ObjetiveForm from './form'
import { DeleteRegular, EyeRegular, PenRegular } from '@fluentui/react-icons'
import { Tooltip } from '@fluentui/react-components'

export default function EdaObjetiveItem({
  objetive,
  setObjetives,
  setDeletedObjetives,
  hasDelete,
  hasEdit
}: {
  objetive: EdaObjetive
  setObjetives: React.Dispatch<React.SetStateAction<EdaObjetive[]>>
  setDeletedObjetives: React.Dispatch<React.SetStateAction<EdaObjetive[]>>
  hasEdit: boolean
  hasDelete: boolean
}) {
  const [openEdit, setOpenEdit] = React.useState(false)

  const handleRemove = () => {
    setDeletedObjetives((prev) => [...prev, objetive])
    setObjetives((prev) => prev.filter((i) => i.id !== objetive.id))
    // reorder
    setObjetives((prev) =>
      prev.map((i, index) => ({
        ...i,
        order: index + 1
      }))
    )
  }

  return (
    <>
      <ObjetiveForm
        open={openEdit}
        disabled={!hasEdit}
        setOpen={setOpenEdit}
        defaultObjetive={objetive}
        onUpdate={(objetive) => {
          setObjetives((prev) =>
            prev.map((i) =>
              i.id === objetive.id
                ? {
                  ...i,
                  ...objetive
                }
                : i
            )
          )
        }}
      />
      <tr className="[&>td]:p-2 even:bg-stone-200/60 even:dark:bg-stone-500/10 [&>td]:py-3">
        <td className="text-center rounded-l-lg font-bold opacity-70 align-top">
          <div className="px-2">#{objetive.order}</div>
        </td>
        <td className="font-semibold align-top">
          <Tooltip
            positioning={{
              align: 'start',
              autoSize: true,
              matchTargetSize: true as any,
              position: 'below'
            }}
            withArrow
            content={objetive.title}
            relationship="inaccessible"
          >
            <p className=" line-clamp-3">{objetive.title}</p>
          </Tooltip>
        </td>
        <td className="align-top max-md:hidden">
          <Tooltip
            positioning={{
              align: 'start',
              autoSize: true,
              matchTargetSize: 'width',
              position: 'below'
            }}
            withArrow
            content={
              <div className="tiptap-renderer">
                {parse(objetive.description)}
              </div>
            }
            relationship="inaccessible"
          >
            <div className="tiptap-renderer line-clamp-3 opacity-70">
              {parse(objetive.description)}
            </div>
          </Tooltip>
        </td>
        <td className="align-top max-xl:hidden">
          <Tooltip
            positioning={{
              align: 'start',
              autoSize: true,
              matchTargetSize: 'width',
              position: 'below',
              strategy: 'fixed',
              flipBoundary: 'window'
            }}
            withArrow
            content={
              <div className="tiptap-renderer">
                {parse(objetive.indicators)}
              </div>
            }
            relationship="inaccessible"
          >
            <div className="tiptap-renderer line-clamp-3 opacity-70">
              {parse(objetive.indicators)}
            </div>
          </Tooltip>
        </td>
        <td className="text-center align-top">
          <div className="font-semibold opacity-70">{objetive.percentage}%</div>
        </td>
        <td className="text-center align-top rounded-r-lg">
          <div className="flex px-4 gap-3">
            <button
              onClick={() => setOpenEdit(true)}
              className="flex items-center relative gap-1"
            >
              {hasEdit ? (
                <PenRegular className="opacity-60" fontSize={20} />
              ) : (
                <EyeRegular className="opacity-60" fontSize={20} />
              )}
              <p className="max-lg:hidden">{hasEdit ? 'Editar' : 'Ver'}</p>
            </button>
            {hasDelete && (
              <button
                onClick={handleRemove}
                className="flex items-center relative gap-1"
              >
                <DeleteRegular className="opacity-60" fontSize={20} />
                <p className="max-lg:hidden">Eliminar</p>
              </button>
            )}
          </div>
        </td>
      </tr>
    </>
  )
}
