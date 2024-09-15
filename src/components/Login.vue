<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h2 v-if="!authStore.isRegis" class="text-center text-dark text-bold fw-bold">Login</h2>
        <h2 v-else class="text-center text-dark text-bold fw-bold">Register</h2>
        <form>
          <div class="form-group text-bold">
            <label for="text">Username</label>
            <input
              type="text"
              id="text"
              v-model="email"
              class="form-control"
              placeholder="Enter your username"
            />
          </div>
          <div class="form-group mt-3">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              placeholder="Enter your password"
            />
          </div>
          <div class="form-check mt-3" v-if="!authStore.isRegis">
            <input type="checkbox" id="rememberMe" v-model="rememberMe" class="form-check-input" />
            <label for="rememberMe" class="form-check-label">Remember me</label>
          </div>
          <button @click="handleSubmit('login')" type="button" class="btn btn-primary w-100 mt-2">
            Login
          </button>
          <button @click="handleSubmit('regis')" type="button" class="btn btn-secondary w-100 mt-2">
            Register
          </button>
        </form>
        <p class="fs-6 text-danger">
          {{ responseMsg }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const responseMsg = ref('')

const handleSubmit = async (type: string) => {
  if (type === 'regis') {
    authStore.isRegis = true
  } else {
    authStore.isRegis = false
  }

  if (!email.value) {
    responseMsg.value = 'Username is required'
    return
  }
  if (!password.value) {
    responseMsg.value = 'Password is required'
    return
  }

  try {
    responseMsg.value = ''
    if (type === 'regis') {
      // Handle register
      const response = await authStore.signup(email.value, password.value)
      responseMsg.value = response.message
      authStore.isRegis = false
    } else {
      // Handle login
      const response = await authStore.login(email.value, password.value)
      if (response?.data?.token?.access_token) {
        await localStorage.setItem('access_token', response.data.token.access_token)
        router.push('/dashboard')
      } else {
        responseMsg.value = 'Failed to get access token'
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return (responseMsg.value = 'An unknown error occurred')
    }
    return (responseMsg.value = 'An unknown error occurred')
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<style scoped>
.container {
  max-width: 400px;
  background-color: #3fb883;
  border-radius: 10px;
  padding: 20px;
}
</style>
