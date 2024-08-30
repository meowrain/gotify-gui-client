/*
*
* */
interface User {
  admin: boolean
  id: number
  name: string
}

interface ErrorInfo {
  error: string
  errorCode: number
  errorDescription: string
}

export async function getAllUsers(): Promise<User[] | string | undefined> {
  const api = window.api
  let requestUrl = await api.getData('url')
  const token: string = await api.getData('token')
  requestUrl = requestUrl + '/user' + `?token=${token}`
  try {
    const response = await fetch(requestUrl)
    if (response.ok) {
      const data = await response.json()
      return data as User[]
    } else {
      const errorData = await response.json()
      return (errorData as ErrorInfo).errorDescription
    }
  } catch (error) {
    console.error(error)
    return 'Network Error: Unable to fetch data'
  }
}
