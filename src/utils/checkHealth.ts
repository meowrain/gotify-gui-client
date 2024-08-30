interface HealthInfo {
  health: string
  database: string
}
export async function checkServerStatus(url?: string): Promise<boolean> {
  let requestUrl
  if (url !== '') {
    requestUrl = url + '/health'
  } else {
    requestUrl = '/api/health'
  }
  try {
    const response = await fetch(requestUrl)
    const data: HealthInfo = await response.json()
    if (response.ok && data.health == 'green' && data.database == 'green') {
      console.log(data)
      return true
    }
  } catch (error) {
    console.error(error)
  }
  return false
}
