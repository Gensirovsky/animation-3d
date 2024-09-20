<template>
  <div class="default-layout">
    <div class="page">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts" />

<style lang="scss" scoped>
.default-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: #FFC221;

  .page {
    display: flex;
    flex: 1;

    & > * {
      width: 100%;
    }
  }
}
</style>
