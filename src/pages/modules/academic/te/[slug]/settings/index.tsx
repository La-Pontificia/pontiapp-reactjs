/* eslint-disable react-refresh/only-export-components */
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogContent,
  Button
} from '@fluentui/react-components'
import React from 'react'
import Categories from './categories'
import Blocks from './blocks'
import Questions from './questions'
import { TeCategory } from '@/types/academic/te-category'
import { TeBlock } from '@/types/academic/te-block'
import { TeQuestion } from '@/types/academic/te-question'
import Options from './options'
import { TeGroup } from '@/types/academic/te-group'

type State = {
  group: TeGroup
  category: TeCategory | null
  setCategory: (category: TeCategory | null) => void

  block: TeBlock | null
  setBlock: (block: TeBlock | null) => void

  question: TeQuestion | null
  setQuestion: (question: TeQuestion | null) => void
}

const Context = React.createContext<State>({} as State)

export const useSettingContext = () => {
  const context = React.useContext(Context)
  if (!context) {
    throw new Error('useSettingContext must be used within a SettingProvider')
  }
  return context
}

export default function SettingDialog({
  open,
  onOpenChange,
  group
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: TeGroup
}) {
  const [category, setCategory] = React.useState<TeCategory | null>(null)
  const [block, setBlock] = React.useState<TeBlock | null>(null)
  const [question, setQuestion] = React.useState<TeQuestion | null>(null)

  return (
    <Context.Provider
      value={{
        category,
        setCategory,
        group,
        block,
        setBlock,
        question,
        setQuestion
      }}
    >
      <Dialog open={open} onOpenChange={(_, { open }) => onOpenChange(open)}>
        <DialogSurface className="!max-w-[95svw] w-[1400px] !p-0">
          <DialogBody className="!flex flex-col !grow xl:h-[800px] max-h-[95svh]">
            <p className="p-1 pb-0 text-xs text-stone-500 dark:text-stone-400">
              Por favor evite agregar preguntas combinadas, agrupe preguntas de
              tipo "Selección simple" y de tipo "Texto".
            </p>
            <DialogContent className="grow [&>div]:p-4 [&>div]:pb-0  divide-x dark:divide-stone-500/30 grid grid-cols-12">
              <Categories />
              <Blocks />
              <Questions />
              <Options />
            </DialogContent>
            <div className="p-2 flex justify-end pt-0">
              <Button size="small" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </div>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </Context.Provider>
  )
}
