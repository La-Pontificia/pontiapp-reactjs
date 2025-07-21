import UserHoverInfo from '@/components/user-hover-info'
import { api } from '@/lib/api'
import { format } from '@/lib/dayjs'
import { EvaluationDetails, Tevaluation } from '@/types/academic/te-evaluation'
import { Avatar, Divider, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'

export default function ItemDetails({
  evaluation
}: {
  evaluation: Tevaluation
}) {
  const { data: full, isLoading } = useQuery<EvaluationDetails | null>({
    queryKey: ['academic/te', evaluation],
    queryFn: async () => {
      const res = await api.get<EvaluationDetails>(
        'academic/te/' + evaluation.id
      )
      if (!res.ok) return null
      return res.data ? new EvaluationDetails(res.data) : null
    }
  })

  return (
    <div className="col-span-3 flex flex-col  overflow-y-auto">
      {isLoading ? (
        <div className="p-2 !min-h-[600px] grid place-content-center">
          <Spinner size="small" />
          <p className="text-sm pt-5 mx-auto text-center opacity-60">
            Cargando detalles de la evaluación...
          </p>
        </div>
      ) : (
        <>
          <div className="p-7 pb-0">
            <div className="flex gap-5 bg-white dark:text-violet-100 text-violet-950 dark:bg-violet-950 p-4 rounded-lg border-t-8 shadow-md border-violet-500">
              <Avatar
                size={128}
                image={{ src: full?.teacher?.photoURL }}
                name={full?.teacher?.fullName}
                color="colorful"
                className="[&>span]:!text-5xl"
              />
              <div>
                <p className="text-3xl">{full?.teacher?.fullName}</p>
                <UserHoverInfo slug={full?.teacher?.id}>
                  <p className="pt-2 opacity-60">@{full?.teacher?.username}</p>
                </UserHoverInfo>
                <div className="pt-2">
                  <span className="opacity-70">Curso:</span>
                  <p className="font-semibold">
                    <span className="opacity-90">
                      {full?.sectionCourse?.planCourse?.course?.code}{' '}
                    </span>
                    {full?.sectionCourse?.planCourse?.course?.name}
                  </p>
                </div>
                <div>
                  <span className="opacity-70">Fecha y hora:</span>
                  <p className="font-semibold">
                    {format(full?.trackingTime, 'DD [de] MMM, YYYY : hh:mm A')}
                  </p>
                </div>
                <div>
                  <span className="opacity-70">Evaluado por:</span>
                  <p className="font-semibold">
                    {full?.evaluator?.displayName}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex flex-col">
            <div className="px-6 py-3">
              <Divider>Puntuaciones</Divider>
            </div>
            <div className="overflow-y-auto px-7 pb-6">
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
                                  <div>
                                    {question.option || question.answer ? (
                                      <p className="bg-violet-500/20 text-violet-800 dark:bg-violet-500/20 text-sm font-semibold dark:text-violet-300 p-1 px-2 rounded-md w-fit">
                                        {question.option?.name ??
                                          question.answer?.answer ??
                                          'Sin respuesta'}
                                      </p>
                                    ) : (
                                      <p className="text-sm text-red-500">
                                        Sin respuesta
                                      </p>
                                    )}
                                  </div>
                                  {/* {question.type === 'text' ? (
                                <div className="pt-2 w-full">
                                  <Textarea
                                    defaultValue={value}
                                    onChange={(e) => {
                                      handleChange(question, e.target.value)
                                    }}
                                    className="w-full"
                                  />
                                </div>
                              ) : (
                                <div className="flex pt-1 w-full">
                                  <RadioGroup
                                    onChange={(_, data) => {
                                      handleChange(question, data.value)
                                    }}
                                    defaultValue={String(value)}
                                    layout="vertical"
                                  >
                                    {question.options.map((option) => (
                                      <Radio
                                        key={option.value}
                                        className="[&>label]:p-0"
                                        value={String(option.value)}
                                        label={option.name}
                                      />
                                    ))}
                                  </RadioGroup>
                                </div>
                              )} */}
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
          </div>
        </>
      )}
    </div>
  )
}
