import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function DocsPage() {
  const [content, setContent] = React.useState<string>('')

  React.useEffect(() => {
    import('/src/pages/docs/content.md?raw').then((module) => {
      setContent(module.default)
    })
  }, [])
  
  return (
    <Markdown className="prose dark:prose-invert" remarkPlugins={[remarkGfm]}>
      {content}
    </Markdown>
  )
}
