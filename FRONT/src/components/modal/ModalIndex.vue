<script setup lang="ts">

import {defineAsyncComponent} from "vue";
import {useModal} from "@/composables/useModal.ts";

defineProps({
  target: {
    type: String,
    default: 'body', // 기본값은 body
  },
});

const { isOpen, modalKey,modalTargetId,modalProps, close } = useModal();

const modals = {
  place: defineAsyncComponent(() => import('@/components/modal/PlaceModal.vue')),
}

</script>

<template>
  <teleport :to="modalTargetId">
    <div
        class="inset-0 flex items-center justify-center bg-black/50 z-50"
        :class="[modalTargetId === 'body' ? 'fixed' : 'absolute']"
        v-if="isOpen"
        @click="close"
        id="yami-modal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-h-[95vh] w-fit flex flex-col" @click.stop>
        <component :is="modals[modalKey]" v-bind="modalProps" @close="close" />
      </div>
    </div>
  </teleport>
</template>

<style scoped>

</style>