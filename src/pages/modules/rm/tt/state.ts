import React from 'react'

export const modalities = ['Presecial 🏫', 'Virtual 🖥️', 'Híbrido 🔄']
export const scales = {
  1: 'No logrado 🚫',
  2: 'En proceso 🔄',
  3: 'Logrado 👍',
  4: 'Destacado 🎉'
}

export type SecondRecord = Record<
  string,
  {
    title: string
    pespVariable: number
    indicators: Record<
      string,
      {
        title: string
        obtained: number
        aspects: Record<
          string,
          {
            pesp: number
            title: string
            modality: string
            scale: number
          }
        >
      }
    >
  }
>

type FirstRecord = {
  title: string
  a: {
    description: string
    scale: boolean
    obtained: number
  }
  b: {
    description: string
    scale: boolean
    obtained: number
  }
}

type Props = {
  firstProp?: FirstRecord
  secondProp?: SecondRecord
}

const intializationSecondState = {
  a: {
    title: 'Pedagógicas',
    pespVariable: 7.5,
    indicators: {
      a: {
        obtained: 0,
        title: 'Planificar la sesión de aprendizaje',
        aspects: {
          a: {
            pesp: 1,
            title:
              'Inicia y culmina en la hora y/o las horas asignadas, respetando el horario.',
            modality: modalities[0],
            scale: 1
          },
          b: {
            pesp: 1,
            title:
              'Alinea los resultados de aprendizaje en función del sílabo.',
            modality: modalities[0],
            scale: 1
          },
          c: {
            pesp: 1,
            title:
              'Define con claridad la evaluación de la sesión de enseñanza-aprendizaje.',
            modality: modalities[0],
            scale: 1
          }
        }
      },
      b: {
        obtained: 0,
        title: 'Desarrollo de la Sesión de clases',
        aspects: {
          b: {
            pesp: 1,
            title:
              'El docente presenta el propósito de la clase de forma innovadora, ajustándose al desarrollo de competencias.',
            modality: modalities[0],
            scale: 1
          },
          c: {
            pesp: 1,
            title:
              'Durante la sesión, utiliza los materiales que están de acuerdo con las competencias que se han planificado.',
            modality: modalities[0],
            scale: 1
          },
          d: {
            pesp: 1,
            title:
              'El docente se preocupa por generar interacción, buscando activar la atención del estudiante.',
            modality: modalities[0],
            scale: 1
          },
          e: {
            pesp: 1,
            title:
              'Organiza su tiempo en función de las necesidades y características de los estudiantes.',
            modality: modalities[0],
            scale: 1
          },
          f: {
            pesp: 1,
            title:
              'Explica de manera sencilla los conceptos centrales, utilizando ejemplos u otras estrategias para facilitar la comprensión de los estudiantes.',
            modality: modalities[0],
            scale: 1
          }
        }
      }
    }
  },
  b: {
    title: 'Desarrollo personal',
    pespVariable: 5,
    indicators: {
      b: {
        obtained: 0,
        title: 'Respeto',
        aspects: {
          b: {
            pesp: 1,
            title:
              'El docente genera retroalimentación durante la clase para que los estudiantes logren comprender el objetivo y contenido de la clase.',
            modality: modalities[0],
            scale: 1
          },
          c: {
            pesp: 1,
            title:
              'El docente mantiene un trato respetuoso y cordial con todos los estudiantes.',
            modality: modalities[0],
            scale: 1
          },
          e: {
            pesp: 1,
            title:
              'El docente genera interacciones positivas que garantizan la atención y motivación permanente del estudiante.',
            modality: modalities[0],
            scale: 1
          }
        }
      },
      c: {
        obtained: 0,
        title: 'Comunicaciòn',
        aspects: {
          c: {
            pesp: 1,
            title:
              'Interactúa con los estudiantes a través de preguntas claras y pertinentes que buscan consolidar aprendizajes.',
            modality: modalities[0],
            scale: 1
          },
          d: {
            pesp: 1,
            title:
              'El docente responde con claridad las preguntas que realizan los estudiantes.',
            modality: modalities[0],
            scale: 1
          },
          e: {
            pesp: 1,
            title:
              'Se comunica de manera asertiva, utilizando un lenguaje formal, apropiado e inclusivo.',
            modality: modalities[0],
            scale: 1
          },
          f: {
            pesp: 1,
            title:
              'El docente utiliza una estrategia comunicativa que garantiza una correcta redacción y ortografía.',
            modality: modalities[0],
            scale: 1
          },
          g: {
            pesp: 1,
            title:
              'El docente evidencia buena postura, gestos adecuados al interactuar con los estudiantes y presentación personal.',
            modality: modalities[0],
            scale: 1
          }
        }
      }
    }
  }
}

const intializationFirstState = {
  title: 'Identificación institucional',
  a: {
    description: 'El aula se presenta sin papeles u otros objetos en el piso',
    scale: false,
    obtained: 0
  },
  b: {
    description: 'El aula se presenta con las carpetas ordenadas',
    scale: false,
    obtained: 0
  }
}

export const useER = (props?: Props) => {
  const { secondProp, firstProp } = props ?? {}
  const [firstER, setFirstER] = React.useState(
    firstProp ?? intializationFirstState
  )

  const [secondER, setSecondER] = React.useState<SecondRecord>(
    secondProp ?? intializationSecondState
  )

  // total is a sum of all the obtained values
  const secondTotal = parseFloat(
    Object.entries(secondER)
      .reduce((acc, [, a]) => {
        return (
          acc +
          Object.entries(a.indicators).reduce((acc, [, b]) => {
            return (
              acc +
              Object.entries(b.aspects).reduce((acc, [, c]) => {
                return acc + (c.scale * a.pespVariable) / 4
              }, 0)
            )
          }, 0)
        )
      }, 0)
      .toFixed(0)
  )

  const secondGrade = parseFloat(((secondTotal / 100) * 20).toFixed(0))

  const secondQualification =
    secondGrade >= 17
      ? 'Destacado'
      : secondGrade >= 14
      ? 'Logrado'
      : secondGrade >= 10
      ? 'En proceso'
      : 'No logrado'

  function resetState() {
    setFirstER(intializationFirstState)
    setSecondER(intializationSecondState)
  }

  return {
    secondTotal,
    secondGrade,
    secondQualification,
    firstER,
    setFirstER,
    secondER,
    setSecondER,
    resetState
  }
}
