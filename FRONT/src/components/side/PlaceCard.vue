<script setup lang="ts">
// 동적인 데이터를 받을 수 있도록 props를 정의합니다.
defineProps({
  isBookmarked: {
    type: Boolean,
    default: false
  },
  waitingCount: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div
      class="p-6 border border-gray-200 rounded-[1.2rem] cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      :class="{ 'bmk': isBookmarked }"
  >
    <div class="flex justify-between">
      <div>
        <h3 class="text-[1.8rem] font-bold">맛있는 한식당</h3>
        <p class="mt-1 text-gray-500 text-[1.4rem] font-medium">한식</p>
      </div>
      <span
          class="material-symbols-outlined transition-colors"
          :class="isBookmarked ? 'text-red-500' : 'text-gray-300'"
      >
        local_fire_department
      </span>
    </div>

    <div class="flex items-center mt-5 space-x-1.5">
      <i class="material-symbols-outlined fill text-yellow-400 text-[1.8rem]">star</i>
      <span class="font-semibold text-gray-800 text-[1.4rem]">4.5</span>
      <span class="font-medium text-gray-400 text-[1.2rem]">(127)</span>

      <span class="mx-3 not-italic text-gray-300 text-[1.4rem]">|</span>

      <span class="font-medium text-gray-500 text-[1.4rem]">0.3km</span>

      <template v-if="waitingCount > 0">
        <span class="mx-3 not-italic text-gray-300 text-[1.4rem]">|</span>
        <span class="font-medium text-orange-500 text-[1.4rem]">대기 {{ waitingCount }}팀</span>
      </template>
    </div>

    <div class="mt-5 space-x-2.5">
      <span class="py-1 px-3 bg-gray-100 rounded-full text-gray-700 text-[1.2rem] font-medium">#한식</span>
      <span class="py-1 px-3 bg-gray-100 rounded-full text-gray-700 text-[1.2rem] font-medium">#먹자</span>
    </div>
  </div>
</template>