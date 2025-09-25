<script setup lang="ts">
  import { useLoadingStore } from "@/stores/loading.store.ts"
  import { ref, onMounted, nextTick  } from 'vue';
  import { useGeoPosition } from "@/composables/useGeoPosition.ts";
  import {usePlaces} from "@/composables/usePlaces.ts";
  import {useKakaoMap} from "@/composables/useKakaoMap.ts";
  import {DEFAULT_POSITION,DEFAULT_ZOOM_LEVEL, PEOPLE_RADIUS} from "@/contants/map.ts";
  import {usePlacesStore} from "@/stores/places.store.ts";
  import {useMapStore} from "@/stores/map.store.ts";
  import {storeToRefs} from "pinia";
  import {makeGridCells} from "@/utils/gridUtils.ts";

  defineOptions({
    name: "MapView",
  })

  const loading = useLoadingStore();
  const mapContainer = ref<HTMLElement | null>(null);
  const { currentPosition } = useMapStore();
  const { createMap,moveMap,createPlacesMarker,createUserMarker  } = useKakaoMap();
  const placesStore = usePlacesStore();
  const { places } = storeToRefs(placesStore);
  const { loadPlaces } = usePlaces();
  const { getUserPosition } = useGeoPosition();

  onMounted(async () => {
    loading.start();

      await nextTick();
      if (!mapContainer.value) console.error("MapView initialized");

      const map = await createMap(
          mapContainer.value,
          { lat: DEFAULT_POSITION.lat, lng: DEFAULT_POSITION.lng },
          DEFAULT_ZOOM_LEVEL
      )

      if(map){
        try {
          const userCoords = await getUserPosition();
          const { setCurrentPosition } = useMapStore();

          setCurrentPosition({lat:userCoords.lat, lng:userCoords.lng});

          const onMapIdle = async () => {
            window.kakao.maps.event.removeListener(map, 'idle', onMapIdle);

            const center = map.getCenter();
            await loadPlaces(map);

            createUserMarker(userCoords);
            createPlacesMarker(places.value)

            const cells = await makeGridCells(map,200)

            console.log(cells)
            loading.stop();
          };

          // 4. 지도에 'idle' 이벤트 리스너 등록
          window.kakao.maps.event.addListener(map, 'idle', onMapIdle);

          // 지도 이동 시작 (이 명령 후에 onMapIdle 함수가 실행될 때까지 기다리게 됨)
          moveMap(map, userCoords);

        } catch(err) {
          console.error("카카오맵 초기화 실패:", err);
        } finally {
          loading.stop();
        }
      }
  });
</script>

<template>
  <div id="mapWrap" class="flex-1 h-full relative w-full">
    <div class="h-full left-0 absolute top-0 w-full" ref="mapContainer">

    </div>
    <div class="consult-map"></div>
  </div>
</template>

<style>

</style>