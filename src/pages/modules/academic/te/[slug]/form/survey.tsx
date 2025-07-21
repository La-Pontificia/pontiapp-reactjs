/* eslint-disable @typescript-eslint/no-explicit-any */
import { SectionCourse } from '@/types/academic/section-course'
import {
  Button,
  Dialog,
  DialogBody,
  DialogSurface,
  Radio,
  RadioGroup,
  Spinner,
  Textarea
} from '@fluentui/react-components'
import { useSlug } from '../+layout'
import { TeGroup } from '@/types/academic/te-group'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { TeQuestion } from '@/types/academic/te-question'
import React from 'react'

export default function Survey({
  open,
  setOpen,
  sectionCourse,
  answers,
  setValue
}: {
  open: boolean
  setOpen: (open: boolean) => void
  sectionCourse: SectionCourse
  setValue: any
  answers: any
}) {
  const { group } = useSlug()
  const [virtualAnswers, setVirtualAnswers] = React.useState<
    Array<{
      questionId: string
      answer: string
    }>
  >(answers ?? [])
  const {
    data: full,
    isLoading,
    refetch
  } = useQuery<TeGroup | null>({
    queryKey: ['academic/te/gro', group],
    enabled: !!group && open,
    queryFn: async () => {
      const res = await api.get<TeGroup>(
        'academic/te/gro/' + group?.id + '/full'
      )
      if (!res.ok) return null
      return res.data ? new TeGroup(res.data) : null
    }
  })

  const handleChange = (question: TeQuestion, value: string) => {
    const already = answers?.find(
      (answer: any) => answer.questionId === question.id
    )
    const answerValue = question.type === 'text' ? value : Number(value)
    if (already) {
      setVirtualAnswers((prev) =>
        prev.map((answer) =>
          answer.questionId === question.id
            ? {
                ...answer,
                answer: String(answerValue)
              }
            : {
                ...answer
              }
        )
      )
    } else {
      setVirtualAnswers((prev) => [
        ...prev,
        {
          questionId: question.id,
          answer: String(answerValue)
        }
      ])
    }
  }

  const onSubmit = () => {
    setValue('answers', virtualAnswers)
    setOpen(false)
  }

  const counts = React.useMemo(() => {
    let answered = 0
    let questions = 0
    full?.categories.forEach((category) => {
      category.blocks.forEach((block) => {
        block.questions.forEach((question) => {
          questions += 1
          if (virtualAnswers?.some((a: any) => a.questionId === question.id)) {
            answered += 1
          }
        })
      })
    })
    return { answered, questions }
  }, [full, virtualAnswers])

  const questionsSelectable = React.useMemo(() => {
    return full?.categories.reduce((acc, category) => {
      return (
        acc +
        category.blocks.reduce((blockAcc, block) => {
          return (
            blockAcc +
            block.questions.filter((question) => question.type !== 'text')
              .length
          )
        }, 0)
      )
    }, 0)
  }, [full])

  React.useEffect(() => {
    if (open) {
      setVirtualAnswers(answers ?? [])
      refetch()
    }
  }, [open, answers, refetch])

  return (
    <>
      <Dialog open={open} onOpenChange={(_, { open }) => setOpen(open)}>
        <DialogSurface className="min-w-[700px] !p-0 !overflow-hidden !bg-violet-50 dark:!bg-[#110f15]">
          <DialogBody className="!p-0">
            <div className="space-y-2 flex flex-col overflow-y-auto w-full col-span-3">
              {isLoading ? (
                <div className="p-2 !min-h-[600px] grid place-content-center">
                  <Spinner size="small" />
                  <p className="text-sm pt-5 mx-auto text-center opacity-60">
                    Cargando encuesta...
                  </p>
                </div>
              ) : (
                open && (
                  <>
                    <div className="p-7 pb-0">
                      <div className="bg-white dark:text-violet-100 text-violet-950 dark:bg-violet-950 p-4 rounded-lg border-t-8 shadow-md border-violet-500">
                        <p className="text-2xl tracking-tight font-semibold">
                          Encuesta
                        </p>
                        <p>
                          de{' '}
                          <span className="font-semibold">
                            {sectionCourse?.teacher?.fullName}
                          </span>{' '}
                          en el curso{' '}
                          <span className="font-semibold">
                            {sectionCourse?.planCourse?.name}
                          </span>{' '}
                        </p>
                        <p className="pt-3 opacity-70">
                          Completada{' '}
                          <span className="font-semibold">
                            {counts.answered} de {counts.questions}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="overflow-y-auto px-7">
                      <div className="">
                        {full?.categories.map((category) => (
                          <div key={category.id} className="py-3">
                            <p className="text-lg tracking-tight">
                              <span className="opacity-60 text-sm">
                                {category.order}.{' '}
                              </span>
                              {category.name}
                            </p>
                            <div className="flex flex-col gap-2">
                              {category.blocks.map((block) => (
                                <div key={block.id}>
                                  <div className="py-2">
                                    <span className="opacity-60">
                                      {category.order}.{block.order}.{' '}
                                    </span>
                                    {block.name}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    {block.questions.map((question) => {
                                      const value = virtualAnswers?.find(
                                        (answer: any) =>
                                          answer.questionId === question.id
                                      )?.answer

                                      return (
                                        <div
                                          key={question.id}
                                          className="p-3 flex flex-col bg-white shadow-sm dark:bg-violet-100/10 border rounded-xl border-violet-900/10"
                                        >
                                          <div className="text-base pb-2">
                                            <span className="opacity-60">
                                              {category.order}.{block.order}.
                                              {question.order}.{' '}
                                            </span>
                                            {question.question}
                                          </div>
                                          {question.type === 'text' ? (
                                            <div className="pt-2 w-full">
                                              <Textarea
                                                defaultValue={value}
                                                onChange={(e) => {
                                                  handleChange(
                                                    question,
                                                    e.target.value
                                                  )
                                                }}
                                                className="w-full"
                                              />
                                            </div>
                                          ) : (
                                            <div className="flex pt-1 w-full">
                                              <RadioGroup
                                                onChange={(_, data) => {
                                                  handleChange(
                                                    question,
                                                    data.value
                                                  )
                                                }}
                                                defaultValue={String(value)}
                                                layout="vertical"
                                              >
                                                {question.options.map(
                                                  (option) => (
                                                    <Radio
                                                      key={option.value}
                                                      className="[&>label]:p-0"
                                                      value={String(
                                                        option.value
                                                      )}
                                                      label={option.name}
                                                    />
                                                  )
                                                )}
                                              </RadioGroup>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-7 py-3">
                      <Button
                        className="w-full"
                        appearance="primary"
                        disabled={
                          counts.answered < (questionsSelectable ?? 0) ||
                          isLoading ||
                          !full
                        }
                        onClick={onSubmit}
                      >
                        Culminar encuesta
                      </Button>
                    </div>
                  </>
                )
              )}
            </div>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
