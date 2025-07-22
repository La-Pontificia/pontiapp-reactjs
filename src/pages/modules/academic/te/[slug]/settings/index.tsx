/* eslint-disable react-refresh/only-export-components */
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogContent,
  Button,
  DialogActions,
  DialogTrigger
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
        <DialogSurface className="!max-w-[95svw] !p-0 !overflow-hidden !bg-violet-50 dark:!bg-[#201d25]">
          <DialogBody className="!flex flex-col !grow xl:h-[800px] max-h-[95svh]">
            <p className="p-1 pb-0 text-xs text-stone-500 dark:text-stone-400">
              Por favor evite agregar preguntas combinadas, agrupe preguntas de
              tipo "Selección simple" y de tipo "Texto".
            </p>
            <DialogContent className="grow [&>div]:pt-0 grid grid-cols-12">
              <div className="p-2 pr-0 col-span-3 grow flex flex-col">
                <Categories />
              </div>
              <div className="p-2 pr-0 col-span-3 grow flex flex-col">
                <Blocks />
              </div>
              <Questions />
              <Options />
            </DialogContent>
            <DialogActions className="p-2 !hidden justify-end pt-0">
              <DialogTrigger disableButtonEnhancement>
                <Button size="small">Cerrar</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </Context.Provider>
  )
}
