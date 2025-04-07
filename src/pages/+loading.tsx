import { Spinner } from '@fluentui/react-components'

export default function RootLoading() {
  return (
    <div className="min-h-svh flex flex-col bg-white text-black dark:text-neutral-300 dark:bg-[#141414]">
      <div></div>
      <div className="flex-grow dark:text-cyan-500 flex  items-center justify-center">
        <Spinner size="huge" />
      </div>
      <footer></footer>
    </div>
  )
}
