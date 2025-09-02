<script setup lang="ts">
import { ref, computed } from "vue";
import type {Place} from "@/types/places.ts";
import {useModal} from "@/composables/useModal.ts";

type Prop = {
  type: "yami" | "place",
  place: Place
}
defineOptions({
  name: "MapMarker",
})
const prop = defineProps<Prop>()
const { place, type } = prop;

const isPlaceClick = ref(false);
const markerPin = ref<HTMLElement | null>(null);

function placeClick(e: MouseEvent) {
  if(type !== "place") return;
  e.stopPropagation();


  const modal = useModal();
  const $parent = markerPin.value?.parentElement as HTMLElement | null;

  isPlaceClick.value = !isPlaceClick.value;

  if ($parent) {
    $parent.style.zIndex = isPlaceClick.value ? "100" : "0";
  }

  if(isPlaceClick.value) {
    modal.open('place', place,'#mapWrap');
  } else {
    modal.close();
  }
}

const markerClasses = computed(() => {
  if (type === 'yami') {
    return [
      'relative block h-4 w-4 cursor-pointer rounded-full border-[3px] border-white bg-[#1E90FF] shadow-[0_6px_16px_rgba(0,0,0,0.35)] will-change-[filter,box-shadow,transform] animate-[meBreath_5s_ease-in-out_infinite]',
      'before:content-[\'\'] before:absolute before:left-1/2 before:top-1/2 before:h-5 before:w-5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:animate-[mePulse2_2.8s_ease-out_infinite]',
      'after:content-[\'\'] after:absolute after:left-1/2 after:top-1/2 after:h-5 after:w-5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:animate-[mePulse2_2.8s_ease-out_infinite] after:[animation-delay:0.6s]'
    ];
  }
  if (type === 'place') {
    return 'block h-[42px] w-[29px] cursor-pointer bg-[url("src/assets/images/icon/marker-place.svg")] bg-center bg-[length:100%_auto] bg-no-repeat';
  }
  return '';
});

</script>

<template>
  <div v-if="type" ref="markerPin" class="relative">
    <span
        :class="markerClasses"
        v-bind="type == 'place' ? { 'yami-rest': place.place_name ?? '' } : {}"
        @click="placeClick"></span>
  </div>
</template>

<style scoped>
@keyframes meBreath {
  0%,100% { filter: brightness(1);    box-shadow: 0 6px 16px rgba(0,0,0,.35); }
  50%     { filter: brightness(1.35); box-shadow: 0 8px 20px rgba(0,0,0,.45); }
}

@keyframes mePulse2 {
  0%   { box-shadow: 0 0 0 0   rgba(30,144,255,0.45); }
  60%  { box-shadow: 0 0 0 10px rgba(30,144,255,0); }
  100% { box-shadow: 0 0 0 0   rgba(30,144,255,0); }
}

@keyframes meBump {
  0%   { transform: translateY(0) scale(1); }
  40%  { transform: translateY(-10px) scale(1.18); }
  100% { transform:  translateY(0) scale(1); }
}
</style>
