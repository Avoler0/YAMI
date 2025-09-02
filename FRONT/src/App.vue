<script setup lang="ts">
import MapView from "@/components/map/MapView.vue";
import Loading from "@/components/ui/Loading.vue";
import 'material-symbols';
// import 'material-symbols/outlined.css';

import ClusterSide from "@/components/side/ClusterSide.vue";
import ModalIndex from "@/components/modal/ModalIndex.vue";


</script>

<template>
  <ClusterSide />
  <MapView />
  <ModalIndex />
  <Loading />
</template>

<style scoped>

</style>
