import React from 'react'

interface ExpiryStatusRendererProps {
  from: Date
  durationInMilliseconds?: number
  children?: React.ReactNode
}

const ExpiryStatusRenderer: React.FC<ExpiryStatusRendererProps> = ({
  from,
  durationInMilliseconds = 1209600000,
  children
}) => {
  const isExpired = from.getTime() + durationInMilliseconds < Date.now()

  if (isExpired) return null
  return children as React.ReactElement
}

export default ExpiryStatusRenderer
