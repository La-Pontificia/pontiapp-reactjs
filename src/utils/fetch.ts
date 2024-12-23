import { VITE_APIRENIEC_HOST, VITE_APIRENIEC_TOKEN } from '~/config/env'

type Person = {
  firstNames: string
  lastNames: string
  documentId: string
}

export async function getPersonByDocumentId(
  documentId: string
): Promise<Person> {
  const cacheKey = `person-${documentId}`
  const cachedPerson = localStorage.getItem(cacheKey)
  if (cachedPerson) {
    return JSON.parse(cachedPerson)
  }

  const response = await fetch(
    `${VITE_APIRENIEC_HOST}/queries/dni?number=${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${VITE_APIRENIEC_TOKEN}`
      }
    }
  )

  const data = await response.json()
  const person = {
    documentId: data.credentials.numeroDocumento,
    firstNames: data.credentials.nombres
      .split(' ')
      .map(
        (name: string) =>
          name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      )
      .join(' '),
    lastNames:
      data.credentials.apellidoPaterno.charAt(0).toUpperCase() +
      data.credentials.apellidoPaterno.slice(1).toLowerCase() +
      ' ' +
      data.credentials.apellidoMaterno.charAt(0).toUpperCase() +
      data.credentials.apellidoMaterno.slice(1).toLowerCase()
  }

  if (data.status === true) {
    localStorage.setItem(cacheKey, JSON.stringify(person))
  }
  return person
}
