<!-- Fish Chance Solunar  -->
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
      style="background-image: url(&quot;/images/bg/bgRedFish.png&quot;); background-size: cover; background-position: center"
      ref="card"
      class="map-container weather-card fancy-card"
      :class="{ night: currentWaterData?.isDay === 0 }"
      >


      <!-- add Night Layer-BG if not Day -->
      <div class="night-overlay"></div>

      <!-- ((( Video BG   No Video ))) -->
      <video ref="video" autoplay muted loop playsinline preload="metadata" poster="" class="bg-video" >
        <source src="/images/bg/animation/sea/2.mp4 " type="video/mp4" />
      </video>

      <div class="content">
        <!-- Title-->
        <v-card-title class="text-center">
          <div class="title-badge">Риболов Шанс - <span class="ml-1 text-red-lighten-2"> AI Solunar </span></div>
        </v-card-title>

        <!-- -----------(((Divider Lent)))----------------------     -->
        <v-divider :thickness="3" class="neon-glow-red border-opacity-100 mx-auto" color="cyan-lighten-4" inset width="170"></v-divider>

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
            Обновено: {{ SolunarUpdatedAt }} ч.
          </div>
        </v-card-text>

        <!--  Gauge Speedometer-->

        <v-container class="">
          <div class="gauge five level3 mx-auto">
            <div class="needle" :style="{ transform: `translateX(-50%) rotate(${angle + wobble}deg)` }"></div>

            <div class="gauge-center">
              <div class="label">SOLUNAR</div>
              <div class="number">{{ rating || 0 }} / 5</div>
            </div>

            <svg class="labels" viewBox="0 0 200 100">
              <defs>
                <path id="arc" d="M 10 100 A 90 90 0 0 1 190 100" />
              </defs>

              <text><textPath href="#arc" startOffset="10%">Слаб</textPath></text>
              <text><textPath href="#arc" startOffset="30%">Добър</textPath></text>
              <text><textPath href="#arc" startOffset="50%">Среден</textPath></text>
              <text><textPath href="#arc" startOffset="70%">Отличен</textPath></text>
              <text><textPath href="#arc" startOffset="90%">Супер</textPath></text>
            </svg>
          </div>
        </v-container>

        <!--  Rating-->
        <div class="text-center mb-3">
          <v-rating readonly hover  v-model="ratingStars">
            <template v-slot:item="props">
              <v-icon :color="props.isFilled ? colors[props.index] : 'grey-lighten-1'" size="large">
                {{ props.isFilled ? "mdi-star-circle" : "mdi-star-circle-outline" }}
              </v-icon>
            </template>
          </v-rating>
        </div>

        <!-- Divider  Second Lent-->
        <v-divider :thickness="2" inset width="280" class="neon-glow-red border-opacity-100 mx-auto mb-5" color="yellow-darken-3"></v-divider>

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
import { useFishingCalcChance } from "@/composables/useFishingCalcChance.js"
import { ref, computed, watch, onMounted, onUnmounted} from "vue";



//bg video effect
const video = ref(null);
const card = ref(null);
useVideoVisibility(video, card, { threshold: 0.6 });


const { now } = useDataTimeNow();
const store = useGeneralStore();

const short = computed(() => store.currentData?.water?.data?.hourly || null);
const { chance } = useFishingCalcChance(store)

const rating = computed(() => store.currentData?.moon?.data?.dayRating  ?? chance.value  ?? 0); // dayRating

const SolunarUpdatedAt = computed(() => store.currentData?.moon?.updatedAt?.slice(11, 16) || null); // lastUpdated
const needleAnimation  = ref(null)
const angle = ref(0);
const wobble = ref(0);
const ratingToAngle = [-85, -72, -36, 0, 36, 72];

const colors = ["indigo-darken-1", "green", "yellow-darken-1", "orange-darken-2", "red-lighten-1"];
const ratingStars = ref(0);


let timerOne = null
watch(() => rating.value, (newVal) => {

clearTimeout(timerOne)
timerOne =  setTimeout(() => {
    const target = ratingToAngle[newVal] ?? 0

    angle.value = target
    ratingStars.value = newVal

    if (needleAnimation.value) {
      clearInterval(needleAnimation.value)
    }

    needleAnimation.value = setInterval(() => {
      wobble.value = (Math.random() - 0.5) * 3
    }, 500)

  }, 300)
}, { immediate: true })



onUnmounted(() => {
  if (needleAnimation.value) {
    clearInterval(needleAnimation.value)
  }
})


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


// Tiles settings
const metrics = computed(() => {
  const localOtherData = JSON.parse(localStorage.getItem("otherData"))
  const weatherImage = localOtherData?.currentWeather?.currentWeatherIcon || 'rainbow-clear' 

  const base = [
    {
      label: "Точка",
      value: store.currentData?.cityBG || null,
      icon: "mdi-city-variant",
      svg: "/images/forecast/svg/pollen-tree.svg",
      pulse: false,
      rotate: false,
      style: {
        background: "linear-gradient(135deg, #3a5c5a, #6b4e57, #4a7c78)"
      }
    },
 
   {
      label: "Времето",
      value: localOtherData?.currentWeather?.temp + "°C" || null,
      icon: null,
      svg: `/images/forecast/svg/${weatherImage}.svg`  ,
      pulse: false,
      rotate: false,
      style: {
          background: "linear-gradient(135deg, #a0c4ff, #6a8cff, #90e0ef)"
      }
    },

   
   {
      label: "Вятър ~ " + localOtherData.currentWeather.windDirection || null,
      value: localOtherData.currentWeather.windSpeed + " m/s",
      icon: "mdi-weather-windy",
      svg: "/images/forecast/svg/wind.svg",
      rotate: false,
     color: "cyan-lighten-1",
     style: {
       background: "linear-gradient(135deg, #1e2a44, #ffb347, #ff8c42)",
     }
    },

    {
      label: "Темп. вода",
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
      label: "Вис. вълна",
      value: currentWaterData.value?.waveHeight + " /m" || null,
      icon: "mdi-arrow-up",
      svg: "/images/forecast/svg/code-red.svg",
      rotate: false,
      pulse: true,
     style: { background: "royalblue" }
    },
    {
      label: "Пос. вълна",
      value: currentWaterData.value?.labelWaveDirection || null,
      icon: "mdi-arrow-up-bold-outline",
      svg: "/images/forecast/svg/compass.svg",
      rotate: false,
      pulse: false,
      style: { background: "linear-gradient(135deg, rgba(20,30,60,0.65), rgba(20,30,60,0.25))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" } 
    },

  ];

  return base;
});


</script>




<style scoped>
/*   */

.gauge {
  width: 300px;
  height: 150px;
  border-radius: 150px 150px 0 0;
  position: relative;
  overflow: hidden;

  /* 5 гладки сегмента */
  background: conic-gradient(from 270deg at 50% 100%, /* започва от ляво-долу */ #55242c 1deg, #106095 36deg, #1eaa59 36deg 72deg, #f1c40f 72deg 108deg, #e67e22 108deg 144deg, #e74c3c 144deg 180deg);

  box-shadow:
    inset 0 -8px 20px rgba(0, 0, 0, 0.6),
    0 -5px 15px rgba(0, 0, 0, 0.5);
}

/* лек гланц */

/* център */
.gauge-center {
  width: 65%;
  height: 65%;
  background: radial-gradient(circle at 50% 20%, #1f2f3f, #0b1118);
  border-radius: 150px 150px 0 0;
  position: absolute;
  bottom: 0;
  left: 17.5%;
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.6);
  text-align: center;
  color: #fff;
}


.label-title {
  margin-left:3px;
  letter-spacing: 1px;
    color: #38bdf8;
  text-shadow:
    0 0 2px rgba(56,189,248,0.7),
    0 0 5px rgba(56,189,248,0.5),
    0 0 8px rgba(56,189,248,0.3);
}

.label {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding-top: 16px;
  color:#e24e1c;

  text-shadow:
    0 0 4px rgba(56,189,248,0.7),
    0 0 10px rgba(56,189,248,0.5),
    0 0 18px rgba(56,189,248,0.3);

  margin-top: 14px;
}

.labels {
  position: absolute;
  left: 0;
  bottom: 4px;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.labels text {
  font-size: 9px;
  fill: white;
  text-anchor: middle;

  filter:
    drop-shadow(0 1px 1px rgba(0,0,0,0.8))
    drop-shadow(0 0 2px rgba(0,0,0,0.6));
}

.number {
  font-size: 22px;
  font-weight: bold;
}

.needle {
  width: 8px;
  height: 130px; /* дължина игла */
  background: #99c0e7;
  border-radius: 3px;
  border-bottom-left-radius: 100% !important;
  border-bottom-right-radius: 5px !important;
  border-top-left-radius: 100% !important;
  border-top-right-radius: 5px !important;

  position: absolute;
  bottom: 0;
  left: 50%;

  transform-origin: 50% 100%;
  transform: rotate(0deg);

  box-shadow: 0 2px 4px rgba(224, 218, 218, 0.38);
  box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.38);

  display: block;
  z-index: 0;

  transition: transform 0.5s ease-in-out; /* animation */

}

/* --------------------------------------------(((card effect))) --------------------------------------------------------*/
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
  background-image: url("/public/images/forecast/bg.png");
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
  .gauge {
    width: 250px !important;
    height: 144px !important;
    border-radius: 144px 144px 0 0 !important;
  }
}

@media (max-width: 480px) {
  .needle {
  width: 7px !important;
  height: 120px !important /* дължина игла */
}
}

.forecast-tile {
   height: 100x !important;
   max-width:100px !important;
}
@media (max-width: 480px) {
  .forecast-tile {
    height: 100px !important;
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
