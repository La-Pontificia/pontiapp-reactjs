import { Tooltip } from '@fluentui/react-components'
import { PersonFeedbackRegular } from '@fluentui/react-icons'

export default function UserFeedback() {
  return (
    <>
      <Tooltip content="Envia un error o sugerencia" relationship="label">
        <button>
          <PersonFeedbackRegular fontSize={23} />
        </button>
      </Tooltip>
    </>
  )
}
