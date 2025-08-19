<script setup lang="ts">
  import { useLoadingStore } from "@/stores/loading"
  import { loadKakaoMap } from "@/utils/loadKakaoMap.js";
  import { ref, onMounted, nextTick  } from 'vue';
  import {useGeoPosition,DEFAULT_POSITION } from "@/composables/useGeoPosition.js";
  import {usePlaces} from "@/composables/usePlaces.js";
  import {useKakaoMap} from "@/composables/useKakaoMap.js";
  import {PEOPLE_RADIUS} from "@/contants/map.js";

  defineOptions({
    name: "MapView",
  })

  const loading = useLoadingStore();
  const mapContainer = ref<HTMLElement | null>(null);
  const { renderMarker ,position } = useKakaoMap();
  const { fetchNearbyPlaces, places } = usePlaces();

  async function initMapView() {
    loading.start();
    try {
      await nextTick();
      if (!mapContainer.value) console.error("MapView initialized");

      const kakaoMap = useKakaoMap();

      await kakaoMap.init(mapContainer.value,{
        level: 1,
        defaultCenter: { lat: DEFAULT_POSITION.lat, lng: DEFAULT_POSITION.lng },
      })

     console.log("표지션",position.value.lat, position.value.lng)


      await fetchNearbyPlaces(
        Number(position.value.lat),
        Number(position.value.lng),
          PEOPLE_RADIUS
      )

      renderMarker(places.value.documents)
      console.log(places.value.meta)

    } catch(err) {
      console.error("카카오맵 초기화 실패:", err);
    } finally {
      loading.stop();
    }
  }

  onMounted(async () => {
    await initMapView();

  });
</script>

<template>
  <div class="map-wrap">
    <div  ref="mapContainer" id="mapView">

    </div>
    <div class="consult-map"></div>
  </div>
</template>

<style>
  .map-wrap {
    width: 100%;
    height: 100%;
  }

  #mapView { height: 100%; left: 0; position: absolute; top: 0; width: 100%; }

</style>