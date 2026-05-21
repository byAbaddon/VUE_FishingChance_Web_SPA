<!-- MAP   -->
<template>
  <div>
    <!-- card     ref="mapContainer"   -->
    <v-card
      max-width="360"
      min-width="360"
      max-height="600"
      min-height="600"
      color="indigo-darken-3"
      elevated
      style="background-image: url(&quot;/images/bg/bgForestDaily.png&quot;); background-size: cover; background-position: center"
      ref="card"
      class="map-container weather-card fancy-card">
      <div class="rotating-gradient"></div>
      <div class="content">
        <!-- Title-->
        <v-card-title class="text-center">
          <div class="title-badge">Карта - <span class="ml-1 text-orange-lighten-3"> GPS </span></div>
        </v-card-title>

        <!-- Divider Lent-->
        <v-divider :thickness="3" class="neon-glow-blue border-opacity-100 mx-auto" color="" inset width="170"></v-divider>

        <!-- Data Time-->
        <v-card-text class="mt-n2 text-center">
          <div class="datetime-badge">
            <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
            {{ now.toLocaleDateString("bg-BG") }}
            <span class="mx-1"></span>
            <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
            {{ now.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" }) }}
          </div>
        </v-card-text>

        <!-- Image -->
        <div class="mt-2 pa-1">
          <v-img
            class="mx-auto pointer border-double"
            image-class="transition-400 hover:scale-110 hover:rotate-2"
            min-height="246"
            max-height
            with
            cover
            lazy-src="/images/logo/1.png"
            src=""
            alt="image">
            <!-- Map -->
            <v-card height="394" class="pa-1">
              <div ref="mapContainer" class="map leaflet-container pa"></div>
            </v-card>

            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="red-lighten-1" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-img>
        </div>

        <!-- Label   Second-->
        <div class="text-center mt-2 mb-4">
          <v-card-text class="datetime-badge font-weight-bold">
            <span class="pr-1" >&#128204; </span> <span class="text-blue-grey-lighten-3"  >  {{ currentData.cityBG }} </span> 
            
            <span class="ml-6 mr-1 ">&#128225;</span>
            <span class="text-teal-lighten-2 mr-1">GPS:</span>
            <span  class="text-indigo-lighten-4" >
              {{ currentData?.gps?.lat.toString().slice(0,5) || "Loading..." }} |
              {{ currentData?.gps?.lng.toString().slice(0,5) || "Loading..." }}
            </span>
            </v-card-text
          >
        </div>

        <!-- Divider  Second Lent-->
        <v-divider :thickness="2" inset width="280" class="neon-glow-blue border-opacity-100 mx-auto mb-5" color=""></v-divider>

        <!-- Grid Tiles -->
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { useDataTimeNow } from "@/composables/useDateTime";
import { useGeneralStore } from "@/stores/generalStore";
import { ref, onMounted, watch, nextTick, computed } from "vue";

const { now } = useDataTimeNow();
const { currentData } = useGeneralStore();

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const mapContainer = ref(null);
let map = null;
let marker = null;

onMounted(async () => {
  await nextTick();
  if (!mapContainer.value) return;

  map = L.map(mapContainer.value, { attributionControl: false }).setView([currentData.gps.lat, currentData.gps.lng], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    showLabel: true, // показва координатни етикети
    dashArray: [2, 4], // тънки пунктирни линии
    color: "#000", // цвят на линиите
    weight: 1, // дебелина на линиите
    opacity: 1, // прозрачност
    font: "12px Arial", // шрифт за етикетите
    zoomInterval: [
      { start: 0, end: 3 },
      { start: 4, end: 7, interval: 10 },
      { start: 8, end: 20, interval: 1 }
    ],

    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  marker = L.marker([currentData.gps.lat, currentData.gps.lng]).addTo(map).bindPopup("Текуща локация").openPopup().closePopup();

  const popup = L.popup();
  map.on("click", e => {
    popup
      .setLatLng(e.latlng)
      .setContent(`GPS: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`)
      .openOn(map);
  });
});

// Watcher for change coords

const coords = computed(() => [currentData.gps.lat, currentData.gps.lng]);

watch(
  () => currentData.gps,
  newJps => {
    if (marker && map) {
      marker.setLatLng([newJps.lat, newJps.lng]);
      map.setView([newJps.lat, newJps.lng], 13);
    }
  },
  { deep: true }
);
</script>

<style scoped>


.v-card {
  position: relative;
  overflow: hidden;
}

.rotating-gradient {
  position: absolute;
  inset: -40%;
  background: conic-gradient(
    from 0deg,
    rgba(120, 90, 255, 0.15),
    rgba(0, 200, 255, 0.10),
    rgba(0, 0, 0, 0),
    rgba(120, 90, 255, 0.15)
  );

  animation: spin 2s linear infinite;
  filter: blur(60px);
  opacity: 0.6;
  pointer-events: none;
}

@keyframes spin {
  0% {
    transform: rotate(0deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1.2);
  }
}


/*  -----  End Bg Animation*/




/*  map */
.map {
  height: 100%;
  width: 100%;
}

.leaflet-container {
  height: 100%;
  width: 100%;
}

.pa {
  padding: 4px;
  padding-block-end: 10px;
}

/**/

::v-deep(.transition-400) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
::v-deep(.hover\:scale-90:hover) {
  scale: 90%;
}
::v-deep(.hover\:scale-110:hover) {
  scale: 110%;
  cursor: pointer;
}

/* card effect*/
.fancy-card {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05); /* леко по-видимо */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  border: 1px dotted rgba(255, 255, 255, 0.2);
}

.fancy-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 14px;
  box-shadow: inset 0 0 40px rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.fancy-card:hover {
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.7),
    0 0 20px rgba(255, 255, 255, 0.05);
}

/* dark bg for night  */

.weather-card {
  position: relative;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 2;
}

.weather-card.night .night-overlay {
  background: rgba(0, 0, 0, 0.6); /* night */
}



.title-badge {
  display: inline-flex;
  align-items: center;
  margin-top: -4px;
  padding: 6px 10px;
  font-weight: 600;
  text-shadow:
    0 0 4px rgba(255, 255, 255, 0.1),
    0 0 8px rgba(255, 255, 255, 0.1);
}

.datetime-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.update-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  font-size: 13px;
  color: #a5f3a1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.forecast-container {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 600px;
  background-image: url("/images/forecast/bg.png");
  background-size: cover;
  background-position: center;
  position: relative;
  padding-top: 60px;
  animation: subtleWave 15s ease-in-out infinite alternate;
}

@keyframes subtleWave {
  0% {
    background-position: center top;
  }
  50% {
    background-position: center 5px;
  }
  100% {
    background-position: center top;
  }
}

.title-font {
  font-family: "Montserrat ExtraBold", sans-serif;
  font-size: clamp(1.8em, 2vw, 2.5em);
  color: #ff80ab;
  text-shadow:
    0 0 8px #ff80ab,
    0 0 16px #ff4081;
}

.subtitle-font {
  font-family: "Roboto Mono Bold", monospace;
  font-size: clamp(1.1em, 1.5vw, 1.4em);
  color: #ffe0b2;
  text-shadow: 0 0 4px #ffb74d;
}

/*-------------------------------Tiles Grid  */
.tiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 14px;
  justify-items: center;
  margin-top: 0px;
  padding: 0 10px;
}

.forecast-tile {
  width: 96px;
  height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  border-radius: 18px;
  box-shadow:
    0 6px 25px rgba(0, 0, 0, 0.5),
    0 0 10px rgba(255, 255, 255, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  color: #fff;
  text-align: center;
  position: relative;
  overflow: hidden;
  opacity: 0.95;
}

.forecast-tile:hover {
  transform: translateY(-8px) rotateX(3deg);
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.7),
    0 0 25px rgba(255, 128, 171, 0.8);
}

.tile-icon {
  font-size: 2em;
  margin-bottom: 4px;
  margin-top: 4px;
}

.tile-value {
  font-size: 1em;
  font-weight: 800;
  /*color:lightcyan; */
}

.tile-label {
  font-size: 0.85em;
  font-weight: 600;
  opacity: 0.85;
  margin-top: -2px;
  color: white;
}

/*------------------------------- EDN    Tiles Grid  */

.gradient-text[data-v-920abe55] {
  background: linear-gradient(90deg, #ffffff, #e0e0e0, #bdbdbd, #ffffff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.98);
  animation: shine 5s linear infinite;
}

@keyframes shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.pulse {
  animation: pulse 1.6s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
}

.pulse-slow {
  animation: pulse-slow 6s infinite alternate ease-in-out;
}

@keyframes pulse-slow {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.rotate {
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.neon-glow-red {
  text-align: center;
  text-shadow:
    0 0 4px rgba(139, 0, 0, 0.8),
    /* тъмно червено */ 0 0 8px rgba(178, 34, 34, 0.6),
    /* firebrick червено */ 0 0 16px rgba(220, 20, 60, 0.4); /* crimson за дълбочина */
  box-shadow:
    0 0 8px rgba(139, 0, 0, 0.8),
    0 0 16px rgba(178, 34, 34, 0.6),
    0 0 24px rgba(220, 20, 60, 0.4);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.neon-glow-blue {
  text-align: center;
  text-shadow:
    0 0 4px #0ff,
    0 0 8px #0ff;
  box-shadow:
    0 0 8px #0ff,
    0 0 16px #0ff,
    0 0 24px #0ff;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.frosted-glow {
  border: 2px solid #fff;
  border-radius: 16px;
  width: 122px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  box-shadow: 0 6px 22px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(1px);
  color: white;
  font-weight: 600;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.frosted-glow:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 122px rgba(255, 255, 255, 0.4);
}

/*

*/
</style>
