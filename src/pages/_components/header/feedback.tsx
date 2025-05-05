import { Tooltip } from '@fluentui/react-components'
import { PersonFeedbackRegular } from '@fluentui/react-icons'
import React from 'react'
import Feedback from '@/components/feedback'

export default function UserFeedback() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Tooltip content="Envia un error o sugerencia" relationship="label">
        <button className="feedback" onClick={() => setOpen(true)}>
          <PersonFeedbackRegular fontSize={23} />
        </button>
      </Tooltip>
      <Feedback onOpenChange={setOpen} open={open} />
    </>
  )
}
