/* eslint-disable @typescript-eslint/no-explicit-any */
import parse from 'html-react-parser'
import { Select, Tooltip } from '@fluentui/react-components'
import { EdaObjetiveEvaluation } from '@/types/eda-objetive-evaluation'
import React from 'react'

const qualifications = [1, 2, 3, 4, 5]

export default function EvaluationObjetiveItem({
  objetive,
  setObjetives,
  hasQualify,
  hasSelftQualify
}: // hasDelete,
  // hasEdit
  {
    objetive: EdaObjetiveEvaluation
    setObjetives: React.Dispatch<React.SetStateAction<EdaObjetiveEvaluation[]>>
    hasQualify: boolean
    hasSelftQualify: boolean
    // hasEdit: boolean
    // hasDelete: boolean
  }) {
  return (
    <>
      <tr className="[&>td]:p-2 even:bg-stone-200/60 even:dark:bg-stone-500/10 [&>td]:py-3">
        <td className="text-center rounded-l-lg font-bold opacity-70 align-top">
          <div className="px-2">#{objetive.objetive.order}</div>
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
            content={objetive.objetive.title}
            relationship="inaccessible"
          >
            <p className=" line-clamp-3">{objetive.objetive.title}</p>
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
                {parse(objetive.objetive.description)}
              </div>
            }
            relationship="inaccessible"
          >
            <div className="tiptap-renderer line-clamp-3 opacity-70">
              {parse(objetive.objetive.description)}
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
                {parse(objetive.objetive.indicators)}
              </div>
            }
            relationship="inaccessible"
          >
            <div className="tiptap-renderer line-clamp-3 opacity-70">
              {parse(objetive.objetive.indicators)}
            </div>
          </Tooltip>
        </td>
        <td className="text-center align-top">
          <div className="font-semibold opacity-70">
            {objetive.objetive.percentage}%
          </div>
        </td>
        <td className="align-top text-center">
          {hasSelftQualify ? (
            <Select
              onChange={(e) =>
                setObjetives((prev) =>
                  prev.map((item) =>
                    item.objetive.id === objetive.objetive.id
                      ? {
                        ...item,
                        selftQualification: parseInt(e.target.value)
                      }
                      : item
                  )
                )
              }
              value={objetive.selftQualification?.toString() ?? ''}
            >
              <option value="" disabled>
                -
              </option>
              {qualifications.map((qualification) => (
                <option key={qualification} value={qualification}>
                  {qualification}
                </option>
              ))}
            </Select>
          ) : (
            <div className="font-semibold p-1.5">
              {objetive.selftQualification}
            </div>
          )}
        </td>
        <td className="align-top rounded-r-lg text-center">
          {hasQualify ? (
            <Select
              onChange={(e) =>
                setObjetives((prev) =>
                  prev.map((item) =>
                    item.objetive.id === objetive.objetive.id
                      ? { ...item, qualification: parseInt(e.target.value) }
                      : item
                  )
                )
              }
              value={objetive.qualification?.toString() ?? ''}
            >
              <option value="" disabled>
                -
              </option>
              {qualifications.map((qualification) => (
                <option key={qualification} value={qualification}>
                  {qualification}
                </option>
              ))}
            </Select>
          ) : (
            <div className="font-semibold p-1.5">{objetive.qualification}</div>
          )}
        </td>
      </tr>
    </>
  )
}
