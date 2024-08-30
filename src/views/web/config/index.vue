<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { checkServerStatus } from '@/utils/checkHealth'
import { ShowNotification } from '@/utils/notification'
import { reactive } from 'vue'

const api = window.api
console.log(api)

async function check() {
  let res = await checkServerStatus(form_url.url)
  if (res) {
    console.log('正常')
    ShowNotification('服務器驗證', '服務器驗證成功', 'success')
  } else {
    console.log('不正常')
    ShowNotification('服務器驗證', '服務器驗失敗', 'error')
  }
}

const form_url = reactive({
  url: ''
})
const form_login = reactive({
  username: '',
  password: ''
})

async function setData() {
  try {
    await api.setData('username', form_login.username)
    await api.setData('password', form_login.password)
    console.log('Data saved')
  } catch (error) {
    console.error('Error saving data', error)
  }
}

async function getData() {
  try {
    const value = await api.getData('username')
    console.log('Data retrieved:', value)
  } catch (error) {
    console.error('Error retrieving data', error)
  }
}

function loadData() {}
</script>
<template>
  <el-header>
    <h2>Gotify配置頁</h2>
  </el-header>
  <el-main class="container">
    <el-form :model="form_url" class="url-container">
      <el-form-item label="url">
        <el-input v-model="form_url.url"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" @click="check">驗證</el-button>
      </el-form-item>
    </el-form>
    <el-form :model="form_login">
      <el-form-item label="username">
        <el-input v-model="form_login.username"></el-input>
      </el-form-item>
      <el-form-item label="password">
        <el-input type="password" v-model="form_login.password"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" @click="setData">提交信息</el-button>
        <el-button type="primary" @click="getData">查看信息</el-button>
      </el-form-item>
    </el-form>
  </el-main>
  <el-footer></el-footer>
</template>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.url-container {
  display: flex;
  flex-direction: row;
}
</style>
