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
    <div class="place-detail-top">
      <h3 class="place-name">{{place.place_name}}</h3>
      <span class="place-meter">{{place.distance}}m</span>
    </div>
    <div class="place-rating">
      <div class="rating-star">
        <span v-for="i in 5" :key="i" :class="['star', starValue(i)]"></span>
      </div>
      <strong class="rating-num">{{rating}}</strong>
    </div>
  </div>

</template>

<style scoped>

  .place-rating { align-items: center; display: flex; gap: 0 10px; }

  .place-detail-top { align-items: center; display: flex; gap: 0 20px; justify-content: space-between; }
  .place-detail { background-color: #FFF; box-shadow: 0 3px 10px 4px rgba(0,0,0,0.16); border-radius: 20px; bottom:100%; height: 200px; left: 50%; position: absolute; padding: 20px; transform: translateX(-50%); width: 250px; }

  .place-name { font-size: 20px; font-weight: 500; margin-bottom: 5px; }
  .place-meter { font-size: 14px; font-weight: 400; margin-bottom: 5px; }

  .rating-star { display: flex; gap: 0 3px; }
  .rating-num { font-size: 18px; font-weight: 500; }

  .star { background-position: center; background-repeat: no-repeat; background-size: cover; height: 20px; width: 20px; }
  .star.full { background-image: url("src/assets/images/icon/rating-star-fill.svg") }
  .star.half { background-image: url("src/assets/images/icon/rating-star-half.svg") }
  .star.empty { background-image: url("src/assets/images/icon/rating-star-empty.svg") }

</style>