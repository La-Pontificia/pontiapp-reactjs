import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { api } from '~/lib/api'
import { format } from '~/lib/dayjs'
import { fdb } from '~/lib/firebase'
import { TicketExtend } from '~/pages/modules/attentions/answer-tickets/slug/page'
import { AttentionPosition } from '~/types/attention-position'
import { FirebaseAttentionTicket } from '~/types/attention-ticket'

export const createTicket = async (
  data: Omit<
    FirebaseAttentionTicket,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'displayName'
    | 'created_at_date'
    | 'state'
    | 'transferReason'
    | 'waitedUntil'
  >
): Promise<boolean> => {
  try {
    await setDoc(doc(fdb, 'tickets', crypto.randomUUID()), {
      ...data,
      state: 'pending',
      created_at_date: format(new Date(), 'MM/DD/YYYY'),
      created_at: format(new Date(), 'MM/DD/YYYY HH:mm:ss'),
      updated_at: null
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const updateTicket = async (
  id: string,
  data: Partial<FirebaseAttentionTicket>
): Promise<boolean> => {
  try {
    await setDoc(
      doc(fdb, 'tickets', id),
      {
        ...data,
        updated_at: format(new Date(), 'MM/DD/YYYY HH:mm:ss')
      },
      { merge: true }
    )
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const deleteTicket = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(fdb, 'tickets', id))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// callTicket function
export const callTicket = async (id: string) => {
  try {
    await updateTicket(id, { state: 'calling' })
  } catch (error) {
    return error
  }
}

// attendTicket function
export const attendTicket = async (id: string) => {
  try {
    await updateTicket(id, {
      state: 'attending',
      waitedUntil: format(new Date(), 'MM-DD-YYYY HH:mm:ss')
    })
  } catch (error) {
    return error
  }
}

// finishTicket function
export const finishTicket = async (
  values: TicketExtend,
  attentionDescription: string
) => {
  try {
    const res = await api.post('attentions', {
      data: JSON.stringify({
        attentionPositionId: values.ticket.attentionPositionId,
        personDocumentId: values.ticket.personDocumentId,
        personFirstnames: values.ticket.personLastNames,
        personLastnames: values.ticket.personFirstNames,
        personCareer: values.ticket.personCareer,
        personPeriodName: values.ticket.personPeriodName,
        personGender: values.ticket.personGender,
        personEmail: values.ticket.personEmail,
        startAttend: values.startAt,
        finishAttend: new Date(),
        ticket: {
          id: values.ticket.id,
          createdAt: values.ticket.created_at,
          waitedUntil: values.ticket.waitedUntil
        },
        attentionDescription
      })
    })

    if (!res.ok) {
      throw new Error('Error al guardar la atención')
    }

    await updateTicket(values.ticket.id, {
      state: 'attended'
    })
  } catch (error) {
    return error
  }
}

// cancelTicket function
export const cancelTicket = async (id: string) => {
  try {
    await updateTicket(id, {
      state: 'cancelled',
      waitedUntil: format(new Date(), 'MM/DD/YYYY HH:mm:ss')
    })
  } catch (error) {
    return error
  }
}

// transferTicket function
export const transferTicket = async (
  id: string,
  attentionPosition: AttentionPosition,
  transferReason: string
) => {
  try {
    await updateTicket(id, {
      state: 'transferred',
      attentionPositionId: attentionPosition.id,
      attentionPositionName: attentionPosition.name,
      attentionPositionBusinessId: attentionPosition.business.id,
      attentionPositionBusinessName: attentionPosition.business.name,
      transferReason
    })
  } catch (error) {
    return error
  }
}
