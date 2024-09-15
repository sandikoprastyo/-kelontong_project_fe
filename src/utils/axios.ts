import axios from 'axios'
import router from '../router'

// axios Interceptor
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.response.use(
  (response) => {
    // Jika respons sukses, kembalikan respons tersebut
    return response
  },
  (error) => {
    // Cek jika respons memiliki status code 401
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, redirecting to login...')

      // Cek jika pengalihan sudah dilakukan
      if (!sessionStorage.getItem('redirected')) {
        // Tandai bahwa pengalihan telah dilakukan
        sessionStorage.setItem('redirected', 'true')

        // Arahkan pengguna ke halaman root ('/')
        router.push('/').then(() => {
          // Hapus status pengalihan setelah pengalihan selesai
          sessionStorage.removeItem('redirected')
        })
      }
    }
    // Lanjutkan error ke caller
    return Promise.reject(error)
  }
)

export default axiosInstance
