import { Spinner } from '@fluentui/react-components'

export default function RootLoading() {
  return (
    <div className="min-h-svh flex flex-col dark:bg-neutral-950">
      <div></div>
      <div className="flex-grow flex items-center justify-center">
        <Spinner size="large" />
      </div>
      <footer></footer>
    </div>
  )
}
