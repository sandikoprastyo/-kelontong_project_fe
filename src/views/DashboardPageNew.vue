<template>
  <div class="product-detail">
    <h1>Create Product</h1>

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

    <!-- Notification Modal -->
    <div
      class="modal fade"
      id="notificationModal"
      tabindex="-1"
      aria-labelledby="notificationModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="notificationModalLabel">Notification</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            {{ notificationMessage }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/product'

const router = useRouter()
const productsStore = useProductsStore()

const product = ref({
  id: 0,
  CategoryId: 14,
  categoryName: 'es',
  name: '',
  price: 0,
  sku: '',
  description: '',
  weight: 0,
  width: 0,
  length: 0,
  height: 0,
  image: ''
})

const notificationMessage = ref('')

const saveProduct = async () => {
  try {
    await productsStore.addProduct(product.value)
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
}
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

.modal {
  display: none;
  align-items: center;
}
</style>
