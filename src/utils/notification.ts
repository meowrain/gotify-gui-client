import { ElNotification } from 'element-plus'
export function ShowNotification(
  title: string,
  message: string,
  type: 'success' | 'info' | 'warning' | 'error', // 限制 type 为特定字符串字面量类型
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left' // 限制 position 为特定字符串字面量类型
) {
  ElNotification({
    title: title,
    message: message,
    type: type,
    position: position
  })
}
