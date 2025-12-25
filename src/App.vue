<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { initBackground } from './utils/background'

onMounted(() => {
  initBackground()
})
</script>

<style lang="less" scoped>
#app {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}
</style>
