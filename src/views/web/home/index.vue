<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { type ApiResponse, getAllMessages, connectWebSocket, type Message, pushMessage } from '@/api/message'
import { ElMessage, ElMessageBox } from 'element-plus'
let messages = ref<Message[]>([])
let apiResponse = ref<ApiResponse>()
let newMessage = ref<Message>()
async function receiveFromWebsocket(){
  const api = window.api
  api.receiveFromWebsocket(newMessage)
}
// 函数用于处理 WebSocket 消息
const handleWebSocketMessage = (message: string) => {
  const newMessage = JSON.parse(message) as Message;
  messages.value = [newMessage, ...messages.value];
};
onMounted(async () => {
  try {
    // console.log(import.meta.env)
    await connectWebSocket()
    let data: ApiResponse = await getAllMessages()
    apiResponse.value = data
    messages.value = apiResponse.value.messages
    window.api.receiveFromWebsocket(handleWebSocketMessage);
  } catch (error) {
    console.error(error)
  }
})
onBeforeUnmount(() => {
  window.api.disconnectWebSocket();
});

const open = () => {
  ElMessageBox.prompt('请输入要提交的信息:', 'Push', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    inputType: 'textarea',
    inputPlaceholder: '请输入你要提交的信息',
    inputValidator: (value) => {
      if (!value) {
        return '内容不能为空';
      }
      return true;
    },
    center: true
  })
    .then(({ value }) => {
      pushMessage(value).then((response) => {
        if(response.id !== 0) {
          ElMessage({
            type: 'success',
            message: '信息提交成功',
          })
        }
      }).catch((err)=>{
        console.log(err)
      })

    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
</script>
<template>
  <div>
      <el-container>
        <el-main>
          <el-card>
            <el-button type="primary" @click="open">推送信息</el-button>
            <ul>
              <li v-for="message in messages" :key="message.id" class="message-item">
                <el-divider></el-divider>
                <div class="message-content">
                  <div class="message-header">
                    <el-tag type="info" >{{ message.date }}</el-tag>
                    <el-tag type="success">{{ message.title }}</el-tag>
                  </div>
                  <p class="message-body">{{ message.message }}</p>
                </div>
              </li>
            </ul>
          </el-card>
        </el-main>
      </el-container>
  </div>
</template>
<style lang="scss">
.message-item {
  margin-bottom: 10px;
}

.message-content {
  padding: 10px;
}

.message-header {
  display: flex;
  justify-content: space-between;
}

.message-body {
  margin-top: 10px;
}
</style>
