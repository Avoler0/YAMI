<script setup lang="ts">
import PlaceCard from "@/components/side/PlaceCard.vue";
import {usePlacesStore} from "@/stores/places.store.ts";


const { places } = usePlacesStore();

</script>

<template>
  <aside class="flex flex-col shrink-0 w-[28rem] p-6">
    <header class="flex items-center justify-between mb-2">
      <h1 class="font-semibold text-orange-500 text-3xl whitespace-nowrap align-top">🍽 YAMI</h1>
      <div class="utility flex space-x-1.5">
        <button type="button" class="bg-transparent rounded-full text-gray-500 cursor-pointer p-4 leading-[0] transition-all duration-300 hover:bg-gray-100 hover:text-gray-800">
          <span class="material-symbols-outlined">settings</span>
        </button>
        <button type="button" class="bg-transparent rounded-full text-gray-500 cursor-pointer p-4 leading-[0] transition-all duration-300 hover:bg-gray-100 hover:text-gray-800">
          <span class="material-symbols-outlined">person</span>
        </button>
      </div>
    </header>

    <div class="relative">
      <span class="material-symbols-outlined icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
      <input class="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pr-6 pl-12 text-gray-800 text-base font-medium leading-none outline-none" type="text" placeholder="맛집 YAMI 검색..." />
    </div>

    <div class="flex border-b border-gray-200 mt-2">
      <button class="flex-1 text-center py-5 border-b-2 border-orange-500 text-orange-500 font-semibold flex items-center justify-center gap-2 text-sm">
        <span class="material-symbols-outlined">explore</span>
        <span>주변 탐색</span>
      </button>
      <button class="flex-1 text-center py-5 text-gray-500 hover:text-orange-500 hover:border-b-2 hover:border-orange-200 flex items-center justify-center gap-2 text-sm">
        <span class="material-symbols-outlined">favorite_border</span>
        <span>찜 목록</span>
      </button>
      <button class="flex-1 text-center py-5 text-gray-500 hover:text-orange-500 hover:border-b-2 hover:border-orange-200 flex items-center justify-center gap-2 text-sm">
        <span class="material-symbols-outlined">auto_awesome</span>
        <span>AI 추천</span>
      </button>
    </div>

    <div class="flex flex-grow flex-col gap-4 min-h-0 mt-6 overflow-y-auto pr-2 pb-4">
      <PlaceCard :place="place" v-for="[id, place] in places" :key="id" />
    </div>

    <div class="bg-gradient-to-br from-orange-400 to-red-500 text-white p-5 rounded-xl mt-6">
      <strong class="flex items-center gap-x-3 text-white text-lg">
        <span class="material-symbols-outlined text-2xl">auto_awesome</span>
        AI 맞춤 맛집 추천
      </strong>
      <p class="text-white text-sm mt-3 mb-6 opacity-90">취향과 방문 기록을 분석해 완벽한 맛집을 찾아드려요!</p>
      <button type="button" class="w-full bg-white rounded-xl text-orange-500 text-base font-bold py-4 px-6">나만의 추천 받기</button>
    </div>
  </aside>
</template>



<style>

</style>

<!--
<aside class="flex flex-col shrink-0 min-w-96 p-6">
<header class="flex items-center justify-between mb-6">
  <h1 class=" font-semibold text-orange-500 text-[2.6rem] whitespace-nowrap align-top">🍽 YAMI</h1>
  <div class="utility flex space-x-1.5">
    <button type="button" class="bg-transparent rounded-full text-gray-500 cursor-pointer p-4 leading-[0] transition-all duration-300 hover:bg-gray-100 hover:text-gray-800">
      <span class="material-symbols-outlined">settings</span>
    </button>
    <button type="button" class="bg-transparent rounded-full text-gray-500 cursor-pointer p-4 leading-[0] transition-all duration-300 hover:bg-gray-100 hover:text-gray-800">
      <span class="material-symbols-outlined">person</span>
    </button>
  </div>
</header>

<div class="relative">
  <span class="material-symbols-outlined icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
  <input class="w-full rounded-full border border-gray-200 bg-gray-50 py-5 pr-6 pl-16 text-gray-800 text-[1.6rem] font-medium leading-none outline-none" type="text" placeholder="맛집 YAMI 검색..." />
</div>

<div class="flex border-b border-gray-200 mt-4">
  <button class="flex-1 text-center py-5 border-b-2 border-orange-500 text-orange-500 font-semibold flex items-center justify-center gap-2 text-[1.4rem]">
    <span class="material-symbols-outlined">explore</span>
    <span>주변 탐색</span>
  </button>
  <button class="flex-1 text-center py-5 text-gray-500 hover:text-orange-500 hover:border-b-2 hover:border-orange-200 flex items-center justify-center gap-2 text-[1.4rem]">
    <span class="material-symbols-outlined">favorite_border</span>
    <span>찜 목록</span>
  </button>
  <button class="flex-1 text-center py-5 text-gray-500 hover:text-orange-500 hover:border-b-2 hover:border-orange-200 flex items-center justify-center gap-2 text-[1.4rem]">
    <span class="material-symbols-outlined">auto_awesome</span>
    <span>AI 추천</span>
  </button>
</div>

<div class="flex flex-grow flex-col gap-4 min-h-0 mt-6 overflow-y-auto pr-5 pb-4">
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
  <PlaceCard />
</div>

<div class="bg-gradient-to-br from-orange-400 to-red-500 text-white p-5 rounded-xl mt-5">
  <strong class="flex items-center gap-x-3 text-white text-[1.8rem]">
    <span class="material-symbols-outlined text-[2.4rem]">auto_awesome</span>
    AI 맞춤 맛집 추천
  </strong>
  <p class="text-white text-[1.4rem] mt-3 mb-6 opacity-90">취향과 방문 기록을 분석해 완벽한 맛집을 찾아드려요!</p>
  <button type="button" class="w-full bg-white rounded-xl text-orange-500 text-[1.6rem] font-bold py-4 px-6">나만의 추천 받기</button>
</div>
</aside>-->
