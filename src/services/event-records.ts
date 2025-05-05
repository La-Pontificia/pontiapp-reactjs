import { doc, setDoc } from 'firebase/firestore'
import { format } from '@/lib/dayjs'
import { fdb } from '@/lib/firebase'
import { EventRecord } from '@/types/event-record'

export const createEventRecord = async (
  data: Omit<EventRecord, 'id' | 'created_at' | 'updated_at' | 'business'>
): Promise<boolean> => {
  try {
    await setDoc(doc(fdb, 'event-records', crypto.randomUUID()), {
      ...data,
      created_at: format(new Date(), 'MM/DD/YYYY HH:mm:ss'),
      updated_at: null
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
