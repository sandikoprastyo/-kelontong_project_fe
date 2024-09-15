<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you are looking for was not found.</p>
    <router-link to="/">Back to Dashboard</router-link>
  </div>
</template>
  
  <script>
export default {
  name: 'NotFoundPage'
}
</script>
  
  <style scoped>
.not-found {
  text-align: center;
  padding: 20px;
}
</style>
  