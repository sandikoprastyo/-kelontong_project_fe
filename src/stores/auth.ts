import { defineStore } from 'pinia'
import axiosInstance from '../utils/axios'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const tkn = Boolean(localStorage.getItem('access_token'))
  const isRegis = ref<boolean>(false)
  const isAuthenticated = ref<boolean>(tkn)

  const token = ref<string>('')
  const PATH = import.meta.env.VITE_API_HOST

  const signup = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post(`${PATH}/auth/signup`, {
        username,
        password
      })
      return response.data
    } catch (error) {
      isAuthenticated.value = false
      throw new Error(error)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post(`${PATH}/auth/login`, {
        username,
        password
      })

      token.value = response.data.token.access_token
      localStorage.setItem('access_token', token.value)
      isAuthenticated.value = true
      return response
    } catch (error) {
      isAuthenticated.value = false
      throw new Error(error)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    token.value = ''
    isAuthenticated.value = false
  }

  return {
    isRegis,
    isAuthenticated,
    token,
    login,
    signup,
    logout
  }
})
