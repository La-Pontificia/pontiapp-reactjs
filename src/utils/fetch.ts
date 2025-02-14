type Person = {
  firstNames: string
  lastNames: string
  documentId: string
  fullName: string
}

export async function getPersonByDocumentId(
  documentId: string
): Promise<Person | null> {
  try {
    const response = await fetch(
      `https://graphperu.daustinn.com/api/query/${documentId}`
    )
    const data = await response.json()

    const person = {
      documentId: data.documentId,
      firstNames: data.surnames,
      lastNames: data.names,
      fullName: data.fullName
    }

    return person
  } catch (error) {
    console.error(error)
    return null
  }
}
