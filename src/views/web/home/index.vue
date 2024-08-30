<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { type ApiResponse, getAllMessages, connectWebSocket, type Message } from '@/api/message'

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
    // console.log(messages.value)
    window.api.receiveFromWebsocket(handleWebSocketMessage);
  } catch (error) {
    console.error(error)
  }
})
onBeforeUnmount(() => {
  window.api.disconnectWebSocket();
});
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>主頁</h1>
      </el-header>
      <el-container>
        <el-aside width="400px">
          <el-row class="tac">
            <el-col :span="15">
              <h4 class="mb-2">功能</h4>
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
              >
                <el-menu-item index="1">
                  <span>Navigator Two</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <span>Navigator Three</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <span>Navigator Four</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <el-card>
            <ul>
              <li v-for="message in messages" :key="message.id" class="message-item">
                <el-divider></el-divider>
                <div class="message-content">
                  <div class="message-header">
                    <el-tag type="info" class="message-date">{{ message.date }}</el-tag>
                    <el-tag type="success" class="message-title">{{ message.title }}</el-tag>
                  </div>
                  <p class="message-body">{{ message.message }}</p>
                </div>
              </li>
            </ul>
            <!--            <el-button @click="getAllMessagesWebsocket">checkWebsocket</el-button>-->
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss"></style>
