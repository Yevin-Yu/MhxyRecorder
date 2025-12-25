<template>
  <div class="layout-container">
    <div class="main-content">
      <div class="content-wrapper fade-in-up">
        <router-view />
      </div>
    </div>
    <BackgroundSwitcher />
  </div>
</template>

<script setup>
import BackgroundSwitcher from './BackgroundSwitcher.vue'
</script>

<style lang="less" scoped>
@import '../styles/variables.less';
.layout-container {
  min-height: 100vh;
  background: transparent;
  padding: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  position: relative;
}

.content-wrapper {
  width: 100%;
  min-height: 100%;
  padding: 0;
  transition: all @transition-normal cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-up {
  animation: fadeInUp @transition-slow ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
