<script setup lang="ts">
  import type {Place} from "@/types/places.ts";
  import {computed} from "vue";

  type Props = {
    isShow: boolean
    place: Place
  }
  defineOptions({
    name: "PlaceDetail",
  })

  const props = defineProps<Props>();
  const { place ,isShow } = props

  let rating = 4.3;

  function starValue(index: number){
    const diff = rating - (index - 1);

    if (diff >= 1) return "full";
    if( diff <= 0) return "empty";
    return "half"
  }

</script>

<template>

  <div v-if="isShow" class="place-detail">
    <h3 class="place-name">{{place.place_name}}</h3>
    <div class="place-rating">
      <div class="rating-star">
        <span v-for="i in 5" :key="i" :class="['star', starValue(i)]"></span>
      </div>
    </div>
  </div>

</template>

<style scoped>

  .place-detail { background-color: #FFF; box-shadow: 0 3px 10px 4px rgba(0,0,0,0.16); border-radius: 20px; bottom:100%; height: 200px; left: 50%; position: absolute; padding: 20px; transform: translateX(-50%); width: 250px; }

  .place-name { font-size: 20px; }
</style>