


<script setup lang="ts">
import {onMounted, ref} from "vue";
import PlaceDetail from "@/components/map/PlaceDetail.vue";
import type {Place} from "@/types/places.ts";

type Prop = {
  type: "me" | "place",
  place: Place
}
defineOptions({
  name: "MapMarker",
})
const prop = defineProps<Prop>()
const { place, type } = prop;

const isPlaceClick = ref(false);
const markerPin = ref<HTMLElement | null>(null);
const className = type == "me" ? "marker-me" : "marker-place"

function placeClick(e: MouseEvent) {
  if(type !== "place") return;
  e.stopPropagation();

  const $parent = markerPin.value?.parentElement as HTMLElement | null;

  if(isPlaceClick.value) {
    $parent.style.zIndex = "0";
    isPlaceClick.value = false;
  }else{
    $parent.style.zIndex = "100";
    isPlaceClick.value = true;
  }
}

</script>

<template>
  <div v-if="type" ref="markerPin" class="marker-pin" :style="{ zIndex: isPlaceClick ? 100 : 0 }">
    <span
        :class="className"
        v-bind="type == 'place' ? { 'yami-rest': place.place_name } : {}"
        @click="placeClick"></span>
    <PlaceDetail  v-if="type == 'place' && isPlaceClick" :isShow="isPlaceClick" :place="place" />
  </div>
</template>

<style scoped>

.marker-pin { position: relative; }


@keyframes meBreath {
  0%,100% { filter: brightness(1);    box-shadow: 0 6px 16px rgba(0,0,0,.35); }
  50%     { filter: brightness(1.35); box-shadow: 0 8px 20px rgba(0,0,0,.45); }
}

@keyframes mePulse2 {
  0%   { box-shadow: 0 0 0 0   rgba(30,144,255,0.45); }
  60%  { box-shadow: 0 0 0 10px rgba(30,144,255,0); }
  100% { box-shadow: 0 0 0 0   rgba(30,144,255,0); }
}

.marker-me { animation: meBreath 5s ease-in-out infinite; background-color: #1E90FF; border: 3px solid #fff; border-radius: 999px; box-shadow: 0 6px 16px rgba(0,0,0,.35); cursor: pointer; display: block; height: 16px; position: relative; width: 16px; will-change: filter, box-shadow, transform; }

.marker-me::before,
.marker-me::after { box-shadow: 0 0 0 0 rgba(30,144,255,0.45); border-radius: 999px; content: ""; height: 20px; left: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%); width: 20px; }
.marker-me::before { animation: mePulse2 2.8s ease-out infinite; }
.marker-me::after  { animation: mePulse2 2.8s ease-out .6s infinite; }

.marker-me.bump {
  animation: meBump .5s cubic-bezier(.2,.8,.2,1) 0.1s;
}
@keyframes meBump {
  0%   { transform: translateY(0) scale(1); }
  40%  { transform: translateY(-10px) scale(1.18); }
  100% { transform:  translateY(0) scale(1); }
}

.marker-place { background: url("src/assets/images/icon/marker-place.svg") center / 100% auto no-repeat; cursor: pointer; display: block; height: 42px; width: 29px; }
</style>