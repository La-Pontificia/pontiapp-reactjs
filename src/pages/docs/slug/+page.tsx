import React from 'react'
import Markdown from 'react-markdown'
import { useLocation } from 'react-router'
import remarkGfm from 'remark-gfm'

export default function SlugDocsPage() {
  const [content, setContent] = React.useState('')
  const { pathname } = useLocation()

  React.useEffect(() => {
    import(
      `/src/pages/docs/content/${pathname.split('/').slice(2).join('/')}.md?raw`
    ).then((module) => {
      setContent(module.default)
    })
  }, [pathname])

  return (
    <Markdown
      className="prose max-w-[90ch] mx-auto dark:prose-invert"
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </Markdown>
  )
}
