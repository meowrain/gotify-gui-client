import WebSocket from 'ws'
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
    const url = await api.getData('ws_url')
    await api.connectWebSocket(url)
  } catch (error) {
    console.error('错误:', error)
  }
}

//推送消息
// 推送消息函数
export async function pushMessage(message: string) {
  try {
    const response = await window.api.pushMessage(message)
    return response
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}
