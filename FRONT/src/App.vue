<script setup lang="ts">
import { defineStore } from 'pinia';
import MapView from "@/components/map/MapView.vue";
import Loading from "@/components/ui/Loading.vue";
import 'material-symbols';
// import 'material-symbols/outlined.css';

import ClusterSide from "@/components/side/ClusterSide.vue";


</script>

<template>
  <ClusterSide />
  <MapView />

  <Loading />
</template>

<style scoped>
 #app { display: flex; }
</style>
