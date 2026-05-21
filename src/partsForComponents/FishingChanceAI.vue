<!-- Fish Chance AI -->
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
      :class="{ night: currentWeatherData?.isDay === 0 }">
      <!-- add Night Layer-BG if not Day -->
      <div class="night-overlay"></div>

      <!-- ((( Video BG   No Video ))) -->
      <video ref="video" autoplay muted loop playsinline preload="metadata" poster="" class="bg-video">
        <source src="/images/bg/animation/sea/1.mp4 " type="video/mp4" />
      </video>

      <div class="content">
        <!-- Title-->
        <v-card-title class="text-center">
          <div class="title-badge">Риболов Условия - <span class="label-title"> AI Calc </span></div>
        </v-card-title>

        <!-- -----------(((Divider Lent)))----------------------     -->
        <v-divider :thickness="3" class="neon-glow-red border-opacity-100 mx-auto" color="yellow-darken-3 " inset width="170"></v-divider>

        <!-- Data Time-->
        <v-card-text class="mt-n2 text-center">
          <div class="datetime-badge">
            <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
            {{ now.toLocaleDateString("bg-BG") }}
            <span class="mx-1"></span>
            <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
            {{ now.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" }) }}
            <div>
              <v-switch style="transform: scale(0.7); transform-origin: right; position: absolute; top: -1em; left: 14em" color="primary" hide-details v-model="noBG" />
            </div>
          </div>
        </v-card-text>

        <!-- Update Time-->
        <v-card-text class="text-center mt-n6">
          <div class="update-badge">
            <span class="pulse" style="z-index: 2">&#8986; </span>
            Обновено: {{ AIUpdatedAt }} ч.
          </div>
        </v-card-text>

        <!--  Gauge Speedometer-->

        <v-container class="">
          <div class="gauge five level3 mx-auto" :class="{ 'no-bg': noBG }">
            <div class="needle" :style="{ transform: `translateX(-50%) rotate(${angle + wobble}deg)` }"></div>

            <div class="gauge-center">
              <div class="label">AI - Calc</div>
              <div class="number">{{ rating || 0 }} / 100</div>
            </div>

            <svg class="labels" viewBox="0 0 200 100">
              <defs>
                <path id="arc" d="M 8.2 98.5 A 92.6 94 -1 0 1 193.1 102" />
              </defs>

              <text v-for="i in 11" :key="i" class="num">
                <textPath href="#arc" :startOffset="(i === 11 ? 97 : (i - 1) * 10) + '%'">
                  {{ (i - 1) * 10 }}
                </textPath>
              </text>

              <text v-for="i in 9" :key="'d' + i" class="dot">
                <textPath href="#arc" :startOffset="(i - 1) * 10 + 5 + '%'">•</textPath>
              </text>
            </svg>
          </div>
        </v-container>

        <!--  Rating-->
        <div class="text-center mb-1">
          <v-rating v-model="ratingFish" readonly hover :length="5" :size="36" :color="colors[ratingFish]">
            <template v-slot:item="props">
              <v-icon :color="props.isFilled ? colors[props.index] : 'grey-lighten-1'" size="large">
                {{ props.isFilled ? "mdi-fish" : "mdi-fishbowl-outline" }}
              </v-icon>
            </template>
          </v-rating>
        </div>

        <!-- Divider  Second Lent-->
        <v-divider :thickness="2" inset width="280" class="neon-glow-red border-opacity-100 mx-auto mb-5" color="yellow-darken-3"></v-divider>

        <!-- Grid Tiles -->
        <div class="tiles-grid">
          <v-card v-for="(metric, index) in metrics" :key="index" class="forecast-tile" :style="metric.style" elevation="16" hover>
            <v-progress-circular
              key=""
              :model-value="dataOtherLS.breakdown?.[index]?.value ?? 0"
              :size="100"
              :width="6"
              bg-color="rgba(255,255,255,0.06)"
              class="ma-1 progress-glow"
              :color="metric.color"
              reveal
              rounded>
              <v-avatar color="" size="70">
                <div class="text-center mt-n3">
                  <div class="mb-n1">
                    <template v-if="metric.svg">
                      <img :src="metric.svg" style="margin: 0px; width: 40px" :class="[{}]" />
                    </template>

                    <v-icon v-else size="22" :color="metric.color" class="tile-icon" :class="[{ pulse: metric.pulse, rotate: metric.rotate }]">
                      {{ metric.icon }}
                    </v-icon>
                  </div>
                  {{ dataOtherLS.breakdown?.[index]?.value ?? 0 }}%
                </div>
              </v-avatar>
            </v-progress-circular>
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
import { useFishingChance } from "@/composables/useFishingChance.js";

import { ref, reactive, computed, watch, onUnmounted } from "vue";


//bg video effect
const video = ref(null);
const card = ref(null);
useVideoVisibility(video, card, { threshold: 0.6 });

const noBG = ref(true);
const { now } = useDataTimeNow();
const store = useGeneralStore();

const dataOtherLS = reactive({
  overallChance: 0,
  breakdown: [],
  species: { pelagic: [], bottom: [] }
});

const short = computed(() => store.currentData?.weather?.updatedAt || null);

const AIUpdatedAt = ref(new Date().toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })); // Updated
const rating = computed(() => dataOtherLS.overallChance || 0); // dayRating
const needleAnimation = ref(null);
const angle = ref(0);
const wobble = ref(0);

const colors = ["indigo-darken-1", "green", "yellow-darken-1", "orange-darken-2", "red-lighten-1"];
const ratingFish = ref(0);


function ratingToAngle(rating) {
  const min = -88;
  const max = 87;
  return min + (rating / 100) * (max - min);
}

// watch rating
let timerOne = null
watch(() => rating.value, newVal => {
  
  clearTimeout(timerOne)
  timerOne =  setTimeout(() => {
      const target = ratingToAngle(newVal) ?? 0;

      angle.value = target;
      ratingFish.value = Math.round((rating.value / 100) * 5);

      if (needleAnimation.value) {
        clearInterval(needleAnimation.value);
      }

      needleAnimation.value = setInterval(() => {
        wobble.value = (Math.random() - 0.5) * 3;
      }, 1500);
    }, 1300);
  },
  { immediate: true }
);

onUnmounted(() => {
  if (needleAnimation.value) {
    clearInterval(needleAnimation.value);
  }
});

// Get data
const currentWeatherData = computed(() => {
  if (!short.value) return null;
  return {
    isDay: store.currentData?.weather?.data?.current?.is_day,
  }
});

// Tiles settings
const metrics = computed(() => {
  
  const base = [
    {
      label: "Час",
      svg: "/images/forecast/svg/rainbow-clear.svg",
      icon: "mdi-clock-outline",
      color: "#00e5ff",
      style: {
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        boxShadow: "0 0 25px rgba(0,229,255,0.25)",
        border: "1px solid rgba(0,229,255,0.15)"
      }
    },

    {
      label: "Вятър",
      icon: "mdi-weather-windy",
      svg: "/images/forecast/svg/wind.svg",
      color: "#7c9cff",
      style: {
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        boxShadow: "0 0 25px rgba(124,156,255,0.35)",
        border: "1px solid rgba(124,156,255,0.2)"
      }
    },

    {
      label: "Облачност",
      svg: "/images/forecast/svg/partly-cloudy-day.svg",
      color: "#ffb74d",
      style: {
        background: "linear-gradient(135deg, #232526, #414345)",
        boxShadow: "0 0 25px rgba(255,183,77,0.35)",
        border: "1px solid rgba(255,183,77,0.2)"
      }
    },

    {
      label: "Вълнение",
      svg: "/images/forecast/svg/code-red.svg",
      icon: "mdi-waves",
      color: "#00b4ff",
      style: {
        background: "linear-gradient(135deg, #000428, #004e92)",
        boxShadow: "0 0 30px rgba(0,180,255,0.35)",
        border: "1px solid rgba(0,180,255,0.2)"
      }
    },

    {
      label: "Налягане",
      icon: "mdi-arrow-up",
      svg: "/images/forecast/svg/barometer.svg",
      color: "#a78bfa",
      style: {
        background: "linear-gradient(135deg, #1f1c2c, #928dab)",
        boxShadow: "0 0 25px rgba(167,139,250,0.35)",
        border: "1px solid rgba(167,139,250,0.2)"
      }
    },

    {
      label: "Луна",
      svg: "/images/forecast/svg/starry-night.svg",
      color: "#e0e0ff",
      style: {
        background: "linear-gradient(135deg, rgba(10,10,30,0.9), rgba(30,30,60,0.6))",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 35px rgba(200,200,255,0.2)",
        border: "1px solid rgba(255,255,255,0.1)"
      }
    }
  ];
  return base;
});

//---------------------((GET Fishing Chance ))------------------------

function updateSpot() {
  const raw = localStorage.getItem("otherData");
  if (!raw) return;

  const data = JSON.parse(raw);
  if (!data) return;

  const { result } = useFishingChance(data);

  const val = result.value;

  dataOtherLS.overallChance = val.overallChance;
  dataOtherLS.species = val.species;
  dataOtherLS.breakdown = val.breakdown;
  const { pelagic, bottom } = dataOtherLS.species
  
  // save array fish chance to local storage
  let allFishes = [...pelagic.map(x => `${x.name}: ${x.chance}`), ...bottom.map(x => `${x.name}: ${x.chance}`)]
  localStorage.setItem("allFishesData", JSON.stringify(allFishes))
   
}

// Start function to get data  and  last Time updated
let timerTwo = null

watch(short, () => {
  clearTimeout(timerTwo)
  timerTwo = setTimeout(() => {
      updateSpot();
      AIUpdatedAt.value = new Date().toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
  }, 700)
})




  
  // const { pelagic, bottom } = dataOtherLS.species
  // console.log(pelagic.map(x => `${x.name}: ${x.chance}%`))
  // console.log(bottom.map(x => `${x.name}: ${x.chance}%`))
  // console.log(dataOtherLS.breakdown.map(x => `${x.name}: ${x.value}%`));


</script>

<style scoped>
/*   */

.gauge {
  width: 300px;
  height: 156px;
  border-radius: 150px 150px 0 0;
  position: relative;
  overflow: hidden;

  background:
    radial-gradient(circle at 50% 100%, transparent 56%, #0b1118 61% /* вътрешно запълване */),
    conic-gradient(from 271.4deg at 50% 100%, #55242c 1deg, #106095 36deg, #1eaa59 36deg 72deg, #f1c40f 72deg 108deg, #e67e22 108deg 144deg, #e74c3c 144deg 150deg, #55242c 190deg);

  backdrop-filter: blur(8px);
  box-shadow:
    inset 0 -8px 20px rgba(0, 0, 0, 0.6),
    0 -5px 15px rgba(0, 0, 0, 0.5);
}

.no-bg {
  background: none !important;
  opacity: 0.8;
}
/* център */

.gauge-center {
  width: 65%;
  height: 65%;
  background: radial-gradient(circle at 50% 20%, #1f2f3f, #0b1118);
  border-radius: 150px 150px 0 0;
  position: absolute;
  bottom: 0;
  left: 17.5%;
  z-index: 10;
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #fff;
}

.label-title {
  margin-left: 3px;
  letter-spacing: 1px;
  color: #38bdf8;
  text-shadow:
    0 0 2px rgba(56, 189, 248, 0.7),
    0 0 5px rgba(56, 189, 248, 0.5),
    0 0 8px rgba(56, 189, 248, 0.3);
}

.label {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding-top: 16px;
  color: #38bdf8;

  text-shadow:
    0 0 4px rgba(56, 189, 248, 0.7),
    0 0 10px rgba(56, 189, 248, 0.5),
    0 0 18px rgba(56, 189, 248, 0.3);

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

.labels text:nth-child(odd) {
  opacity: 0.8;
}
.labels text {
  font-size: 9px;
  fill: white;
  text-anchor: middle;

  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 2px rgba(0, 0, 0, 0.6));
}

.num:nth-child(1n) textPath {
  fill: #c6b4fa;
  fill: #def79a;
}
.num:nth-child(2n) textPath {
  fill: #ccc1ec;
  fill: rgba(250, 141, 141, 0.959);
}

.dot textPath {
  fill: #9be2e2;
  font-size: 10px;
}

.number {
  font-size: 22px;
  font-weight: bold;
}

.needle {
  width: 8px;
  height: 130px; /* дължина игла */
  background: #d1221c;
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
  backdrop-filter: blur(2px);
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
  margin-top: -4px;
  padding: 0 10px;
}

.progress-glow {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
}

.forecast-tile {
  width: 100px;
  height: 100px;
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
  filter: drop-shadow(0 0 6px currentColor);
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
