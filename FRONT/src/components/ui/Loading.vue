<script setup lang="ts">
  import { useLoadingStore } from '@/stores/loading.store.ts';

  const loading = useLoadingStore();

  defineOptions({
    name: "Loading",
  })

  console.log(loading)
</script>

<template>
  <div v-if="loading.isLoading" class="loading">

  </div>
</template>

<style>
  .loading { height: 100vh; left: 0; position: fixed; top:0; width: 100vw; z-index: 1001; }
  .loading::before { background-color: rgba(0,0,0,0.6); height: 100%; left: 0; content: ""; position: absolute; top:0; width: 100%; z-index: 1; }
</style>