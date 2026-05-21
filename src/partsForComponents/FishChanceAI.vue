<!-- Fish Chance AI  -->
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
        <source src="/images/bg/animation/sea/0.mp4 " type="video/mp4" />
      </video>

      <div class="content">
        <!-- Title-->
        <v-card-title class="text-center">
          <div class="title-badge">Риби Шанс - <span class="label-title"> AI Calc </span></div>
        </v-card-title>

        <!-- -----------(((Divider Lent)))----------------------     -->
        <v-divider :thickness="3" class="neon-glow-red border-opacity-100 mx-auto" color="light-blue-accent-2" inset width="170"></v-divider>

        <!-- Update Time-->
        <v-card-text class="text-center mt-n2">
          <div class="update-badge">
            <span class="pulse" style="z-index: 2">&#8986; </span>
            Обновено: {{ AIUpdatedAt }} ч.
          </div>
        </v-card-text>

        <!-- Image -->
        <div class="mt-0 mb-4">
          <v-img
            class="mx-auto pointer border-double img-hover fish-wrap"
            style=""
            cover
            max-width="230"
            min-width="230"
            min-height="150"
            max-height="150"
            :src="imageByIndex || '/public/images/fish/bg0.png'"
            @click="imageByIndex = '/public/images/fish/bg0.png'"
            lazy-src="/public/images/logo/1.png"
            alt="image">
            <div class="bubbles"></div>
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="red-lighten-1" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-img>
        </div>

        <!-- Grid Tiles -->
        <div class="tiles-grid">
          <v-card
            v-for="(metric, index) in metrics"
            :key="index"
            class="forecast-tile"
            :style="metric.style"
            elevation="16"
            hover
            @mouseenter="onHover(index)"
            @mouseleave="onLeave(index)"
            @click="onClick(index)">
            <v-progress-circular
              @hover="1"
              key=""
              :model-value="allFishes?.[index]?.split(':')[1] || 0"
              :size="100"
              :width="6"
              bg-color="rgba(255,255,255,0.06)"
              class="ma-1 progress-glow"
              :color="metric.color"
              reveal
              rounded>
              <v-avatar :size="70">
                <div class="text-center">
                  <div>
                    <v-card-text class="text-purple-lighten-5 font-weight-medium" :class="`text-${metric.color || 'primary'}`">
                      {{ metric.label || "Loading" }}
                    </v-card-text>

                    <v-card-text class="my-n4 pt-1" :class="`text-${metric.color || 'primary'}`">
                      {{ allFishes?.[index]?.split(":")[1] || Math.floor(Math.random() * (45 - 3 + 1)) + 3 }}%
                    </v-card-text>
                  </div>
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


import { ref, computed, watch, } from "vue";

//bg video effect
const video = ref(null);
const card = ref(null);
useVideoVisibility(video, card, { threshold: 0.6 });

const { now } = useDataTimeNow();
const store = useGeneralStore();

const allFishes = ref([]);
let imageByIndex = ref(null);

const onClick = index => {
  const fishName = allFishes.value[index]?.split(":")[0].trim();
  imageByIndex.value = `/images/fish/${fishName}.png`;
};

const onHover = index => {
  imageByIndex.value = `/public/images/fish/${allFishes.value[index]?.split(":")[0]}.png`;
};

const onLeave = index => {
  imageByIndex.value = `/public/images/fish/${allFishes.value[index]?.split(":")[0]}.png`; //  '/public/images/fish/bg0.png'
};

const short = computed(() => store.currentData?.weather?.updatedAt || null);

const AIUpdatedAt = ref(new Date().toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })); // Updated
const rating = computed(() => 0); // dayRating

const colors = ["indigo-darken-1", "green", "yellow-darken-1", "orange-darken-2", "red-lighten-1"];
const ratingFish = ref(0);

// watch rating
watch(
  () => rating.value,
  newVal => {
    ratingFish.value = Math.round((rating.value / 100) * 5);
  }
);

// Get data
const currentWeatherData = computed(() => {
  if (!short.value) return null;

  return {
    isDay: store.currentData?.weather?.data?.current?.is_day
  };
});

//---------------------((GET Fishing Chance ))------------------------

// Start function to get data  and  last Time updated
let timerOne = null;
watch(short, () => {
  clearTimeout(timerOne);
  timerOne = setTimeout(() => {
    //---get data fish from LS
    const data = JSON.parse(localStorage.getItem("allFishesData"));
    if (!data) return;
    allFishes.value = data;

    // ---update Time
    AIUpdatedAt.value = new Date().toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
  }, 2000);
});

// Tiles settings
const metrics = computed(() => {
  const base = [
    // 🟦 passage
    {
      label: "Хамсия",
      svg: "/images/fish/хамсия.png",
      icon: "mdi-fish",
      color: "cyan-accent-3",
      style: {
        background: "linear-gradient(135deg, #001a2c, #003b5c)",
        boxShadow: "0 0 25px rgba(0,229,255,0.45)",
        border: "1px solid rgba(0,229,255,0.25)"
      }
    },

    {
      label: "Сафрид",
      svg: "/images/forecast/svg/wind.svg",
      icon: "mdi-weather-windy",
      color: "light-blue-lighten-1",
      style: {
        background: "linear-gradient(135deg, #0d1b2a, #1b263b)",
        boxShadow: "0 0 25px rgba(79,195,247,0.45)",
        border: "1px solid rgba(79,195,247,0.2)"
      }
    },

    {
      label: "Чернокоп",
      svg: "/images/forecast/svg/partly-cloudy-day.svg",
      icon: "mdi-lightning-bolt",
      color: "deep-orange-accent-2",
      style: {
        background: "linear-gradient(135deg, #1a1a1a, #3a3a3a)",
        boxShadow: "0 0 30px rgba(255,112,67,0.5)",
        border: "1px solid rgba(255,112,67,0.25)"
      }
    },

    {
      label: "Карагьоз",
      svg: "/images/forecast/svg/waves.svg",
      icon: "mdi-waves",
      color: "teal-accent-2",
      style: {
        background: "linear-gradient(135deg, #000428, #004e92)",
        boxShadow: "0 0 30px rgba(41,182,246,0.5)",
        border: "1px solid rgba(41,182,246,0.25)"
      }
    },

    {
      label: "Зарган",
      svg: "/images/forecast/svg/needle.svg",
      icon: "mdi-sword",
      color: "blue-darken-1",
      style: {
        background: "linear-gradient(135deg, #200000, #4a0000)",
        boxShadow: "0 0 30px rgba(255,82,82,0.45)",
        border: "1px solid rgba(255,82,82,0.25)"
      }
    },

    // 🟣 bottom fishes
    {
      label: "Попче",
      svg: "/images/forecast/svg/barometer.svg",
      icon: "mdi-arrow-down",
      color: "red-accent-3",
      style: {
        background: "linear-gradient(135deg, #1b1b2f, #3d2c5e)",
        boxShadow: "0 0 25px rgba(179,136,255,0.45)",
        border: "1px solid rgba(179,136,255,0.25)"
      }
    },

    {
      label: "Лихнус",
      svg: "/images/forecast/svg/moon.svg",
      icon: "mdi-moon-waning-crescent",
      color: "purple-lighten-1",
      style: {
        background: "linear-gradient(135deg, rgba(10,10,30,0.95), rgba(20,20,50,0.7))",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 35px rgba(200,200,255,0.25)",
        border: "1px solid rgba(255,255,255,0.12)"
      }
    },
    {
      label: "Скорпид",
      svg: "/images/forecast/svg/skull.svg",
      icon: "mdi-skull",
      color: "deep-purple-lighten-2",
      style: {
        background: "linear-gradient(135deg, #1a1a2e, #2e1a47)",
        boxShadow: "0 0 25px rgba(206,147,216,0.4)",
        border: "1px solid rgba(206,147,216,0.2)"
      }
    },

    {
      label: "Врана",
      svg: "/images/forecast/svg/star.svg",
      icon: "mdi-star",
      color: "yellow-accent-3",
      style: {
        background: "linear-gradient(135deg, #2c2c2c, #1a1a1a)",
        boxShadow: "0 0 35px rgba(255,213,79,0.4)",
        border: "1px solid rgba(255,213,79,0.25)"
      }
    }
  ];

  return base;
});
</script>

<style scoped>
/*   */

.fish-wrap {
  position: relative;
  overflow: hidden;
}

.bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.5) 2px, transparent 3px), radial-gradient(circle, rgba(255, 255, 255, 0.3) 1.5px, transparent 2.5px);
  background-size:
    40px 80px,
    30px 60px;
  animation: bubblesMove 6s linear infinite;
}

@keyframes bubblesMove {
  from {
    background-position:
      0 100%,
      20px 100%;
  }
  to {
    background-position:
      0 -100%,
      20px -100%;
  }
}

.bubbles::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;

  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.5) 1.5px, transparent 2.5px);
  background-size: 420px 90px;

  animation: bubblesUp 10s linear infinite;
  opacity: 0.9;
}
@keyframes bubblesUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(-100%);
  }
}

/* ---------------------------------------  end  animation bobbles */

.img-hover {
  transition: 0.1s;
  cursor: pointer;
}
.img-hover:hover {
  transform: scale(1.01);
  border-color: rgba(228, 100, 100, 0.541);
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
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}



/*  ------------------ (( Tiles )) ----------------------------  */


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
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 4px;
  justify-items: center;
  margin-top: 0px;
  padding: 0 10px;
}

.progress-glow {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
}

.forecast-tile {
   aspect-ratio: 1 / 1;
  width: 100px;
  height: 100px;
  max-width: 100px;
  max-height: 100%;
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
  height: 106px !important;
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
