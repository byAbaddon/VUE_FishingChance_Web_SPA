<!-- WATER   -->
<template>
  <div>
    <!-- card   -->
    <v-card
      max-width="360"
      min-width="360"
      max-height="600"
      min-height="600"
      color="indigo-darken-3"
      elevated
      style="background-image: 
      url(&quot;/images/sea/null.png&quot;);
       background-size: cover; background-position: center"
      ref="card"
      class="map-container weather-card fancy-card"
      :class="{ night: currentWaterData?.isDay === 0 }">
      <!-- add Night Layer-BG if not Day -->
      <div class="night-overlay"></div>

      <!-- ((( Video BG   No Video ))) -->
      <video ref="video" autoplay muted loop playsinline preload="metadata" poster="" class="bg-video">
        <source src="/images/bg/animation/moon/2.mp4" type="video/mp4" />
      </video>

      <div class="content">
        <!-- Title-->
        <v-card-title class="text-center">
          <div class="title-badge">Данни за Водата</div>
        </v-card-title>

        <!-- Divider Lent-->
        <v-divider :thickness="3" class="neon-glow-red border-opacity-100 mx-auto" color="pink" inset width="170"></v-divider>

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

        <!-- Update Time-->
        <v-card-text class="text-center mt-n6">
          <div class="update-badge">
            <span class="pulse" style="z-index: 2">&#8986; </span>
            Обновено: {{ currentWaterData?.time }} ч.
          </div>
        </v-card-text>

        <!-- Image   -->
        <v-img max-width="240" max-height="172" class="mx-auto pulse-slow" lazy-src="/images/logo/1.png" src="/images/sea/water.png" alt="image">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="red-lighten-1" indeterminate></v-progress-circular>
            </div>
          </template>
        </v-img>

        <!-- Label Moon Phase  Second-->
        <div class="text-center mt-4 mb-4">
          <v-card-text class="datetime-badge font-weight-bold"
            >Температура и вълнeние: {{ "&nbsp;" }}
            <v-icon class="pulse">{{ currentWaterData?.isDay ? "mdi-waves" : "mdi-waves" }}</v-icon>
          </v-card-text>
        </div>

        <!-- Divider  Second Lent-->
        <v-divider :thickness="2" inset width="280" class="neon-glow-red border-opacity-100 mx-auto mb-5" color="pink"></v-divider>

        <!-- Grid Tiles -->
        <div class="tiles-grid">
          <v-card v-for="(metric, index) in metrics" :key="index" class="forecast-tile" :style="metric.style" elevation="16" hover>
            <template v-if="metric.svg">
              <img :src="metric.svg" style="margin: -14px; width: 70px" :class="[{}]" />
            </template>

            <v-icon v-else large :color="metric.color" class="tile-icon" :class="[{ pulse: metric.pulse, rotate: metric.rotate }]">
              {{ metric.icon }}
            </v-icon>

            <div class="tile-value gradient-text">{{ metric.value }}</div>
            <div class="tile-label">{{ metric.label }}</div>
          </v-card>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { useDataTimeNow } from "@/composables/useDateTime";
import { useGeneralStore } from "@/stores/generalStore";
import { useVideoVisibility } from "@/composables/useVideoVisibility.js";
import { ref, computed, watch } from "vue";

//bg video effect
const video = ref(null);
const card = ref(null);
useVideoVisibility(video, card, { threshold: 0.6 });

const { now } = useDataTimeNow();
const store = useGeneralStore();

const showCompass = ref(false);

const short = computed(() => store.currentData?.water?.data?.hourly || null);

const currentWaterData = computed(() => {
  if (!short.value || !short.value.time) return null;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const nowLocalISO = `${year}-${month}-${day}T${hour}:00`;

  const index = short.value.time.findIndex(t => t === nowLocalISO);

  if (index === -1) return null;

  const directionDeg = short.value.wave_direction[index];
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const indexDirections = Math.round(directionDeg / 22.5) % 16;

  return {
    isDay: store.currentData?.weather?.data?.current?.is_day,
    updatedAt: now.toISOString().slice(11, 16),
    lat: store.currentData?.water?.data?.latitude?.toString().slice(0, 5),
    lng: store.currentData?.water?.data?.longitude?.toString().slice(0, 5),
    time: short.value.time[index].slice(11, 16),
    temperature: short.value.sea_surface_temperature[index],
    waveHeight: short.value.wave_height[index],
    wavePeriod: short.value.wave_period[index],
    waveDirection: directionDeg,
    labelWaveDirection: directions[indexDirections],
    directionDeg
  };
});

// save SEA data to localStorage
watch(
  () => [
    currentWaterData.value?.isDay,
    currentWaterData.value?.lat,
    currentWaterData.value?.lng,
    currentWaterData.value?.temperature,
    currentWaterData.value?.waveHeight,
    currentWaterData.value?.labelWaveDirection,

  ],
  ([isDay, lat,lng,temperature,waveHeight,labelWaveDirection, ]) => {
    const otherData = JSON.parse(localStorage.getItem("otherData") || "{}");

    otherData.currentSea = {
      isDay,
      lat,
      lng,
      temperature,
      waveHeight,
      labelWaveDirection,
     
    };

    localStorage.setItem("otherData", JSON.stringify(otherData));
  },
  { immediate: true }
);


// Dynamic change color BG
const colorForMetric = metric => {
  switch (metric?.label) {
    case "notUsed":
      const lumen = +metric?.value || 0;
      const alpha = 0.05 + (lumen / 100) * 0.6;
      return `rgba(180, 200, 255, ${alpha})`;

    default:
      return "rgba(255,255,255,0.1)";
  }
};

// Tiles settings
const metrics = computed(() => {
  const base = [
    {
      label: "Точка",
      value: store.currentData?.cityBG || null,
      icon: "mdi-city-variant",
      svg: "/images/forecast/svg/pollen-tree.svg",
      pulse: false,
      rotate: false,
      style: {
        background: "linear-gradient(135deg, #a8edea, #fed6e3, #b0f4f1)"
      }
    },
    {
      label: "Координати",
      value: currentWaterData.value?.lat + " | " + currentWaterData.value?.lng || null,
      icon: "mdi-crosshairs-gps",
      //svg: "/images/forecast/svg/flag-small-craft-advisory.svg",
      rotate: false,
      pulse: true,
      style: {
        background: "linear-gradient(135deg, #ade6f0, #7fd1b9, #c3f0e8)"
      }
    },
    {
      label: "Температура",
      value: currentWaterData.value?.temperature + " °C" || null,
      icon: "mdi-waves",
      svg: "/images/forecast/svg/thermometer-water.svg",
      pulse: false,
      rotate: false,
      style: {
        background: "linear-gradient(5deg, rgb(22, 16, 199), rgba(145, 128, 226, 0.96), rgba(12, 31, 179, 0.91))"
      }
    },
    {
      label: "Височина",
      value: currentWaterData.value?.waveHeight + " /m" || null,
      icon: "mdi-arrow-up",
      svg: "/images/forecast/svg/code-red.svg",
      rotate: false,
      pulse: true,
      style: {
        background: "linear-gradient(135deg, #a0c4ff, #6a8cff, #90e0ef)"
      }
    },
    {
      label: "Посока",
      value: currentWaterData.value?.labelWaveDirection || null,
      icon: "mdi-arrow-up-bold-outline",
      svg: "/images/forecast/svg/compass.svg",
      rotate: false,
      pulse: false,
      style: {
        background: "linear-gradient(135deg, #1e2a44, #ffb347, #ff8c42)"
      }
    },
    {
      label: "Период",
      value: currentWaterData.value?.wavePeriod + " /s" || null,
      icon: "mdi-wave",
      svg: "/images/forecast/svg/glove.svg",
      rotate: false,
      pulse: false,
      style: {
        background: "linear-gradient(135deg, #89f7fe, #66a6ff, #bdb2ff)"
      }
    }
  ];

  return base;
});


</script>

<style scoped>
/*   */

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

.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  z-index: 0;
  pointer-events: none;
}

.night-overlay {
  position: absolute;
  background: rgba(0, 0, 0, 0); /* dey */
  transition: background 0.4s ease;
  pointer-events: none;
  inset: 0;
  z-index: 1;
}
.content {
  position: relative;
  z-index: 2;
}

.weather-card.night .night-overlay {
  background: rgba(0, 0, 0, 0.6); /* night */
}

/* all elements overlay 
.weather-card > *:not(.night-overlay) {
  position: relative;
  z-index: 2;
}
*/

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


/*   phone Responsibility  fix*/


@media (max-width: 480px) {
  .forecast-tile {
    height: 97px !important;
    max-width:100px !important;
  }
}
/*  END  phone Responsibility  fix*/




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

/*
.gradient-text {
	background: linear-gradient(45deg, #50252800, #fff, #e7e3e3ab);
	-webkit-background-clip: text;
	-webkit-text-fill-color: #44424209;
	animation: shine 2s infinite linear;
}

*/
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
    transform: scale(1.03);
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

@media screen and (max-width: 600px) {
  .tiles-grid {
    gap: 12px;
  }
  .forecast-tile {
    width: 120px;
    height: 120px;
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

.sun-glow {
  color: orange;
  text-align: center;
  text-shadow:
    0 0 4px #ffd700,
    /* ярко жълто за основното сияние */ 0 0 8px #ffb300,
    /* по-топло сияние */ 0 0 16px #ffa500; /* леко оранжево за дълбочина */
  box-shadow:
    0 0 8px #ffd700,
    0 0 16px #ffb300,
    0 0 24px #ffa500;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

/*
Този компонент включва вече:

Glassmorphism + neon glow + shadow
Dynamic background анимация
Gradient текст и иконки с shine
Pulse за важни плочки
Rotation за wind/compass
Rain drops animation за дъжд
Tooltip с допълнителни данни
Hover 3D tilt
Responsive grid (1–5 колони) за мобилни и ultra-wide (3440px)
svg - animated icons
*/
</style>
