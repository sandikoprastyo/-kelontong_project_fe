<template>
  <button @click="handleLogout" type="button" class="btn btn-outline-danger btn-sm">Logout</button>
  <button @click="handleCreateNew" type="button" class="btn btn-outline-primary btn-sm m-2">
    New
  </button>
  <div class="dashboard">
    <h1>List Products</h1>

    <div class="container mt-4">
      <div class="mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Search"
          v-model="searchQuery"
          @input="setSearchQuery"
        />
      </div>

      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="fw-bold">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Width</th>
              <th>Length</th>
              <th>image</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="productsStore.products.length === 0">
              <td colspan="11" class="text-center">No data found</td>
            </tr>
            <tr v-for="product in productsStore.products" :key="product.id" v-else>
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.sku }}</td>
              <td>{{ product.description }}</td>
              <td>{{ product.weight }}</td>
              <td>{{ product.height }}</td>
              <td>{{ product.width }}</td>
              <td>{{ product.length }}</td>
              <td>
                <img :src="product.image" alt="image" width="50" height="50" />
              </td>
              <td>{{ product.price }}</td>
              <td>
                <button class="btn btn-primary btn-sm" @click="editProduct(product.id)">
                  Edit
                </button>
                <button class="btn btn-danger btn-sm ms-2" @click="confirmDelete(product.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: productsStore.currentPage === 1 }">
            <a class="page-link" @click.prevent="changePage(productsStore.currentPage - 1)" href="#"
              >Prev</a
            >
          </li>
          <li
            class="page-item"
            :class="{ active: productsStore.currentPage === page }"
            v-for="page in productsStore.totalPages"
            :key="page"
          >
            <a class="page-link" @click.prevent="changePage(page)" href="#">{{ page }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: productsStore.currentPage === productsStore.totalPages }"
          >
            <a class="page-link" @click.prevent="changePage(productsStore.currentPage + 1)" href="#"
              >Next</a
            >
          </li>
        </ul>
      </nav>
    </div>

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
import { useAuthStore } from '../stores/auth'
import { useProductsStore } from '../stores/product'
import { useRouter } from 'vue-router'

const productsStore = useProductsStore()
const authStore = useAuthStore()
const router = useRouter()
const searchQuery = ref('')
const notificationMessage = ref('')

const fetchProducts = async () => {
  try {
    const data: any = await productsStore.fetchProducts()
    if (data.status == 401) {
      router.push('/')
    }
  } catch (error) {
    notificationMessage.value = 'error'
    showNotification()
  }
}

const setSearchQuery = () => {
  productsStore.setSearchQuery(searchQuery.value)
}

const changePage = (page: number) => {
  productsStore.changePage(page)
}

const editProduct = (id: number) => {
  return router.push(`/dashboard/${id}`)
}

const confirmDelete = (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProduct(id)
  }
}

const deleteProduct = async (id: number) => {
  try {
    await productsStore.deleteProduct(id)
    productsStore.fetchProducts() // Refresh product list
    notificationMessage.value = 'Product deleted successfully'
    showNotification()
  } catch (error) {
    console.error('Failed to delete product:', error)
    notificationMessage.value = 'Failed to delete product'
    showNotification()
  }
}

const showNotification = () => {
  const modalElement = document.getElementById('notificationModal')
  if (modalElement) {
    const modal = new (window as any).bootstrap.Modal(modalElement)
    modal.show()
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const handleCreateNew = () => {
  router.push('/dashboard/new')
}

onMounted(() => {
  fetchProducts()
})
</script>

<style>
.dashboard {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table {
  width: 100%;
  max-width: 1200px;
}

.pagination {
  margin-top: 20px;
}
</style>
