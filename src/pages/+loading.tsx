import { Spinner } from '@fluentui/react-components'

export default function RootLoading() {
  return (
    <div className="min-h-svh flex flex-col bg-white text-black dark:text-stone-300 dark:bg-[#1b1a19]">
      <div></div>
      <div className="flex-grow flex items-center justify-center">
        <Spinner size="huge" />
      </div>
      <footer></footer>
    </div>
  )
}
