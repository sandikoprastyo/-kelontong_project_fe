import { defineStore } from 'pinia'
import axiosInstance from '../utils/axios'
import { ref } from 'vue'

interface Product {
  id: number
  CategoryId: number
  categoryName: string
  name: string
  price: number
  sku: string
  description: string
  weight: number
  width: number
  length: number
  height: number
  image: string
}

export const useProductsStore = defineStore('products', () => {
  const product = ref<any[]>([])
  const products = ref<any[]>([])
  const totalPages = ref<number>(1)
  const currentPage = ref<number>(1)
  const redirected = ref<Boolean>(false)
  const searchQuery = ref<string>('')
  const PATH = import.meta.env.VITE_API_HOST

  const fetchProducts = async (page = currentPage.value) => {
    try {
      const token = localStorage.getItem('access_token')

      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await axiosInstance.get(`${PATH}/products`, {
        params: {
          page,
          limit: 10,
          search: searchQuery.value
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      products.value = response.data.data
      totalPages.value = response.data.totalPages
      currentPage.value = page
      return response
    } catch (error) {
      redirected.value = true
      console.error('Failed to fetch products:', error)
      return error
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    fetchProducts()
  }

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    fetchProducts(page)
  }

  const deleteProduct = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token')
      await axiosInstance.delete(`${PATH}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      fetchProducts() // Refresh product list
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw error
    }
  }

  const getProductDetail = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axiosInstance.get(`${PATH}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      product.value = response.data
      return product
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw error
    }
  }

  const updateProduct = async (data: Product) => {
    try {
      const token = localStorage.getItem('access_token')

      const response = await axiosInstance.patch(`${PATH}/products/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    }
  }

  const addProduct = async (data: Product) => {
    try {
      const token = localStorage.getItem('access_token')

      const response = await axiosInstance.post(`${PATH}/products`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    }
  }

  return {
    product,
    products,
    totalPages,
    currentPage,
    searchQuery,
    redirected,
    fetchProducts,
    setSearchQuery,
    changePage,
    deleteProduct,
    getProductDetail,
    updateProduct,
    addProduct
  }
})
