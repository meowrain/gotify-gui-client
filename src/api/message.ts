import WebSocket from 'ws';
interface ErrorInfo {
  error: string
  errorCode: number
  errorDescription: string
}

interface Extra {
  brightness?: number
  temperature?: number
}

export interface Message {
  appid: number
  date: string
  extras: {
    'home::appliances::lighting::on'?: Extra
    'home::appliances::thermostat::change_temperature'?: Extra
  }
  id: number
  message: string
  priority: number
  title: string
}

interface Paging {
  limit: number
  next: string
  since: number
  size: number
}

export interface ApiResponse {
  messages: Message[]
  paging: Paging
}

interface PostMessageBody {
  extras: Message.extras
  message: string
  priority: number
  title: string
}

//獲取所有消息
export async function getAllMessages(): Promise<ApiResponse | undefined> {
  const api = window.api
  let requestUrl = await api.getData('url')
  const token: string = await api.getData('token')
  requestUrl = requestUrl + '/message' + `?token=${token}`

  // requestUrl = '/api/message' + `?token=${token}`
  try {
    const response = await fetch(requestUrl)
    const data = await response.json()
    return data as ApiResponse
  } catch (error) {
    console.error(error)
  }
}

export async function connectWebSocket(): Promise<void> {
  const api = window.api
  try {
    const url = import.meta.env.VITE_API_WEBSOCKET_URL
   await api.connectWebSocket(url);
  } catch (error) {
    console.error('错误:', error);
  }
}

//推送消息
export async function pushMessage(message: string) {
  const api = window.api
  let requestUrl: string = await api.getData('url')
  const token: string = await api.getData('token')
  requestUrl = requestUrl + '/message' + `?token=${token}`
  let postBody: PostMessageBody
  postBody.message = message
  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody)
    })
    const data = await response.json()
    return data as ApiResponse
  } catch (error) {
    console.error(error)
  }
}
