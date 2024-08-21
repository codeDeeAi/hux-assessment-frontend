<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layouts/AppHeader.vue'
</script>

<template>
  <main class="!w-screen !h-screen bg-white">
    <AppHeader />
    <RouterView class="!h-full overflow-auto" />
  </main>
</template>

<style scoped></style>
