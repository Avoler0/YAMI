<script setup lang="ts">

import type {Place} from "@/types/places.ts";
import {useModal} from "@/composables/useModal.ts";
import {usePlacesStore} from "@/stores/places.store.ts";

type Props = {
  place: Place;
}

const { modalProps,close } = useModal();
const { getPlace } = usePlacesStore();
const placeId = modalProps.value.id;
const placeData = getPlace(placeId);

const { place_name,place_url,address_name,category_name } = placeData;

const cateSplit = category_name.split(">")
const category = cateSplit[cateSplit.length - 1].replace(',','・');

</script>

<template>
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] flex flex-col">
    <div class="relative">
      <img alt="Grilled ribs with vegetables" class="w-full h-52 object-cover rounded-t-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ8P8CAiIpyyixlwr8bmTczS6Ufb4fS71rfJun91Qf4KBzvTGxgh-t-qBckZ5F1Y6c_ghg81i3smPAy1vfvRDTPsYkQgEmVmEFBv924ejeDD9GqdgCJrGXM0__eQeLn5IszheonOE-UOWOS-INiJ6wQRbI4y8QnvTTmtyU-ZrYMHqnpKFTWamqlWQV-ZcLtKrP0gxpJ7g5B9FDyaalTweFcoq_pjWNkPwep-a8U6lohonQFUwnLeh23A70GUM4-on05-KbmBHRmVE">
      <button class="absolute top-4 left-4 bg-white/80 p-2 rounded-full text-red-500 leading-[0] hover:bg-white backdrop-blur-sm">
        <span class="material-symbols-outlined fill">favorite</span>
      </button>
      <button @click="close" class="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70">
        <span class="material-symbols-outlined">close</span>
      </button>
      <span class="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-medium">{{ category }}</span>
    </div>
    <div class="p-6 flex-grow overflow-y-auto">
      <h2 class="text-2xl font-bold text-gray-800">
        <a :href="place_url">{{place_name}}</a>
      </h2>
      <div class="flex items-center mt-2 text-gray-600">
        <span class="material-symbols-outlined fill text-base text-yellow-400">star</span>
        <span class="ml-1 font-bold text-base text-gray-800">4.6</span>
        <span class="ml-1 text-sm text-gray-400">(234개 리뷰)</span>
      </div>
      <div class="flex items-center mt-3 text-sm text-gray-500">
        <span class="material-symbols-outlined text-base">location_on</span>
        <span class="ml-1">{{address_name}}</span>
        <a class="ml-auto text-orange-500 font-semibold" href="#">0.8km 길찾기</a>
      </div>
      <div class="bg-blue-50 border border-blue-100 p-4 rounded-lg my-6">
        <div class="flex justify-between items-center text-sm">
          <span class="font-semibold text-blue-800">내 방문 기록</span>
          <span class="font-medium text-blue-700">방문 4회</span>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="font-semibold text-base text-blue-800">내 평점:</span>
          <div class="flex text-yellow-400">
            <span class="material-symbols-outlined fill">star</span>
            <span class="material-symbols-outlined fill">star</span>
            <span class="material-symbols-outlined fill">star</span>
            <span class="material-symbols-outlined fill">star</span>
            <span class="material-symbols-outlined text-gray-300">star</span>
          </div>
        </div>
      </div>
      <div>
        <h3 class="font-bold text-lg mb-3">추천 메뉴</h3>
        <div class="flex space-x-3 text-center text-gray-800">
          <div>
            <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <span class="text-4xl">🍖</span>
            </div>
            <span class="text-sm mt-1.5 block font-medium">한우 갈비</span>
          </div>
          <div>
            <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <span class="text-4xl">🥓</span>
            </div>
            <span class="text-sm mt-1.5 block font-medium">삼겹살</span>
          </div>
          <div>
            <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <span class="text-4xl">🥩</span>
            </div>
            <span class="text-sm mt-1.5 block font-medium">목살</span>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <h3 class="font-bold text-lg mb-3 flex items-center gap-2 text-orange-500"><span class="material-symbols-outlined">auto_awesome</span> AI 리뷰 요약</h3>
        <p class="text-gray-600 leading-relaxed text-sm bg-orange-50/50 p-4 rounded-lg border border-orange-100">
          고기 품질이 정말 좋은 곳입니다. 한우 갈비는 입에서 녹고, 삼겹살도 두툼하고 맛있어요. 직원들이 친절하게 구워주셔서 편리합니다. 사이드 메뉴도 훌륭해서 재방문 의사 100%입니다!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>