<template>
  <div class="product-detail">
    <h1>Product Detail</h1>

    <form @submit.prevent="saveProduct">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input id="name" type="text" class="form-control" v-model="product.name" required />
      </div>
      <div class="mb-3">
        <label for="price" class="form-label">Price</label>
        <input id="price" type="number" class="form-control" v-model="product.price" required />
      </div>
      <div class="mb-3">
        <label for="sku" class="form-label">SKU</label>
        <input id="sku" type="text" class="form-control" v-model="product.sku" />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea id="description" class="form-control" v-model="product.description"></textarea>
      </div>
      <div class="mb-3">
        <label for="weight" class="form-label">Weight</label>
        <input id="weight" type="number" class="form-control" v-model="product.weight" />
      </div>
      <div class="mb-3">
        <label for="width" class="form-label">Width</label>
        <input id="width" type="number" class="form-control" v-model="product.width" />
      </div>
      <div class="mb-3">
        <label for="length" class="form-label">Length</label>
        <input id="length" type="number" class="form-control" v-model="product.length" />
      </div>
      <div class="mb-3">
        <label for="height" class="form-label">Height</label>
        <input id="height" type="number" class="form-control" v-model="product.height" />
      </div>
      <div class="mb-3">
        <label for="image" class="form-label">Image URL</label>
        <input id="image" type="text" class="form-control" v-model="product.image" />
      </div>
      <div class="mb-3">
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-secondary ms-2" @click="cancelEdit">Cancel</button>
      </div>
    </form>

    <!-- Toast Notification -->
    <div id="notificationToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Notification</strong>
        <small>Just now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{ notificationMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/product'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

interface Product {
  id: number
  name: string
  price: number
  sku: string
  description: string
  weight: number
  width: number
  length: number
  height: number
  image: string
  CategoryId?: number
  categoryName?: string
}

const product = ref<Product>({
  id: 0,
  name: '',
  price: 0,
  sku: '',
  description: '',
  weight: 0,
  width: 0,
  length: 0,
  height: 0,
  image: '',
  CategoryId: 0,
  categoryName: ''
})

const notificationMessage = ref('')

const fetchProduct = async () => {
  const id = Number(route.params.id)
  try {
    await productsStore.getProductDetail(id)
    const prod = productsStore.product as unknown as Product
    product.value = { ...prod }
  } catch (error) {
    console.error('Failed to fetch product:', error)
    notificationMessage.value = 'Failed to fetch product'
    showNotification()
  }
}

const saveProduct = async () => {
  try {
    await productsStore.updateProduct(product.value)
    notificationMessage.value = 'Product updated successfully'
    showNotification()
    router.push('/dashboard')
  } catch (error) {
    console.error('Failed to update product:', error)
    notificationMessage.value = 'Failed to update product'
    showNotification()
  }
}

const cancelEdit = () => {
  router.push('/dashboard')
}

const showNotification = () => {
  alert(notificationMessage.value)
  const toastElement = document.getElementById('notificationToast')
  // console.log(toastElement)

  // const toast = new (window as any).bootstrap.Toast(toastElement)
  // toastElement.show()

  console.error('Toast element not found.')
}

onMounted(() => {
  fetchProduct()
})
</script>

<style>
.product-detail {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  width: 100%;
  max-width: 600px;
}

.toast {
  display: none; /* Hide by default */
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
</style>
