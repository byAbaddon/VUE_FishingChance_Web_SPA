<!-- SUN  -->
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
      style="background-image: url(&quot;/images/moon/bg.png&quot;); background-size: cover; background-position: center"
      ref="card"
      class="map-container weather-card fancy-card"
      :class="{ night: currentSunData?.isDay === 0 }">
      <!-- add Night Layer-BG if not Day -->
      <div class="night-overlay"></div>

      <!-- ((( Video BG  ))) -->
      <video ref="video" autoplay muted loop playsinline preload="metadata" poster="" class="bg-video">
        <source src="/images/bg/animation/forecast/2.mp4" type="video/mp4" />
      </video>

      <div class="content">
        <!-- Title-->
        <v-card-title class="text-center">
          <div class="title-badge">Фаза на Слънцето</div>
        </v-card-title>

        <!-- Divider Lent-->
        <v-divider :thickness="3" class="sun-glow border-opacity-100 mx-auto" color="" inset width="170"></v-divider>

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
            Обновено: {{ currentSunData?.updatedAt }} ч.
          </div>
        </v-card-text>

        <!-- Image   -->
        <v-img max-width="240" max-height="172" class="mx-auto pulse-slow" lazy-src="/images/logo/1.png" :src="`/images/sun/${currentSunData.isDay}.png` || 'Loading...'">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="red-lighten-1" indeterminate></v-progress-circular>
            </div>
          </template>
        </v-img>

        <!-- Label Moon Phase  Second-->
        <div class="text-center mt-4 mb-4">
          <v-card-text class="datetime-badge font-weight-bold"
            >Част от денонощието: {{ "&nbsp;" }}
            <v-icon class="pulse">{{ currentSunData?.isDay ? "mdi-white-balance-sunny" : "mdi-weather-night" }}</v-icon>
          </v-card-text>
        </div>

        <!-- Divider  Second Lent-->
        <v-divider :thickness="2" inset width="280" class="sun-glow border-opacity-100 mx-auto mb-5" color=""></v-divider>

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

const currentSunZodiac = ref(getCurrentZodiac()); // currentSunZodiac .name .mdi  .symbol
const currentSeason = ref(getSeason());

//Get Zodiac
function getCurrentZodiac(date = new Date()) {
  const zodiacSignsArray = [
    {
      name: "Овен",
      mdi: "mdi-zodiac-aries",
      symbol: "♈",
      start: "03-21",
      end: "04-19"
    },
    {
      name: "Телец",
      mdi: "mdi-zodiac-taurus",
      symbol: "♉",
      start: "04-20",
      end: "05-20"
    },
    {
      name: "Близнаци",
      mdi: "mdi-zodiac-gemini",
      symbol: "♊",
      start: "05-21",
      end: "06-20"
    },
    {
      name: "Рак",
      mdi: "mdi-zodiac-cancer",
      symbol: "♋",
      start: "06-21",
      end: "07-22"
    },
    {
      name: "Лъв",
      mdi: "mdi-zodiac-leo",
      symbol: "♌",
      start: "07-23",
      end: "08-22"
    },
    {
      name: "Дева",
      mdi: "mdi-zodiac-virgo",
      symbol: "♍",
      start: "08-23",
      end: "09-22"
    },
    {
      name: "Везни",
      mdi: "mdi-zodiac-libra",
      symbol: "♎",
      start: "09-23",
      end: "10-22"
    },
    {
      name: "Скорпион",
      mdi: "mdi-zodiac-scorpio",
      symbol: "♏",
      start: "10-23",
      end: "11-21"
    },
    {
      name: "Стрелец",
      mdi: "mdi-zodiac-sagittarius",
      symbol: "♐",
      start: "11-22",
      end: "12-21"
    },
    {
      name: "Козирог",
      mdi: "mdi-zodiac-capricorn",
      symbol: "♑",
      start: "12-22",
      end: "01-19"
    },
    {
      name: "Водолей",
      mdi: "mdi-zodiac-aquarius",
      symbol: "♒",
      start: "01-20",
      end: "02-18"
    },
    {
      name: "Риби",
      mdi: "mdi-zodiac-pisces",
      symbol: "♓",
      start: "02-19",
      end: "03-20"
    }
  ];

  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (let z of zodiacSignsArray) {
    let [startMonth, startDay] = z.start.split("-").map(Number);
    let [endMonth, endDay] = z.end.split("-").map(Number);

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return z;
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return z;
    }
  }
  return null;
}

const short = computed(() => store.currentData?.moon?.data || null);

const currentSunData = computed(() => {
  if (!short.value) return {};
  return {
    updatedAt: store.currentData?.moon?.updatedAt?.slice(11, 16),
    isDay: store.currentData?.weather?.data?.current?.is_day,

    sunRise: short.value?.sunRise ??  short.value?.sunrise,
    sunSet: short.value?.sunSet ??  short.value?.sunset,
    sunTransit: short.value?.sunTransit ??  getTopTransit(short.value?.sunrise , short.value?.sunset),
  };
});

function getTopTransit (rise, set) {
  if (!rise || !set) return null

  const parse = (t) => {
    if (!t) return 0

    let [time, mod] = t.split(' ')
    let [h, m] = time.split(':').map(Number)

    if (mod === 'PM' && h !== 12) h += 12
    if (mod === 'AM' && h === 12) h = 0

    return h * 60 + m
  }

  const r = parse(rise)
  const s = parse(set)

  const top = Math.trunc((r + s) / 2)

  const h = Math.trunc(top / 60)
  const m = top % 60

  return `${h}:${String(m).padStart(2, '0')}`
}


const getDayLength = computed(() => {
  const sr = short.value?.sunRise;
  const ss = short.value?.sunSet;

  if (!sr || !ss) return "";

  const [srH, srM] = sr.split(":").map(Number);
  const [ssH, ssM] = ss.split(":").map(Number);

  const diff = ssH * 60 + ssM - (srH * 60 + srM);

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`; // hours:minutes
});


function getSeason(date = new Date()) {
  const year = date.getUTCFullYear();

  const spring = new Date(Date.UTC(year, 2, 20));
  const summer = new Date(Date.UTC(year, 5, 21));
  const autumn = new Date(Date.UTC(year, 8, 23));
  const winter = new Date(Date.UTC(year, 11, 21));

  if (date >= spring && date < summer) return "Пролет";
  if (date >= summer && date < autumn) return "Лято";
  if (date >= autumn && date < winter) return "Есен";
  return "Зима";
}


// save Sun data to localStorage
watch(
  () => [
    currentSunData.value?.isDay,
   formatMoonTime( currentSunData.value?.sunRise),
    formatMoonTime(currentSunData.value?.sunSet),
    getSeason(),
    new Date(),
  ],
  ([isDay, sunRise, sunSet, season, dataTimeNow]) => {
    const otherData = JSON.parse(localStorage.getItem("otherData") || "{}");

    otherData.currentSun = {
      isDay,
      sunRise,
      sunSet,
      season,
      dataTimeNow,
    };

    localStorage.setItem("otherData", JSON.stringify(otherData));
  },
  { immediate: true }
);



function formatMoonTime(timeStr) {
  if (!timeStr) return ""

  let [time, mod] = timeStr.includes("AM") || timeStr.includes("PM")
    ? timeStr.split(" ")
    : [timeStr, null]

  let [h, m] = time.split(":").map(Number)

  if (mod) {
    if (mod === "PM" && h !== 12) h += 12
    if (mod === "AM" && h === 12) h = 0
  }

  if (h >= 24) h -= 24

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}



const metrics = computed(() => {
  const base = [
    {
      label: "Сезон",
      value: currentSeason.value || null,
      icon: "mdi-stretch-to-page-outline",
      svg: currentSeason.value == "Пролет" ? "/images/forecast/svg/pollen-grass.svg" : currentSeason.value === "Лято" ? "/images/forecast/svg/pollen-tree.svg" : "/images/forecast/svg/beanie.svg",
      pulse: false,
      rotate: false,
      color: "primary",
      style: {
        background: "linear-gradient(-165deg, #d4f8e8, #a8e6cf, #ff8c42)",
        color: "#1f2d2b"
      }
    },
    {
      label: "Зодия",
      value: currentSunZodiac.value?.name,
      icon: currentSunZodiac.value?.mdi,
      // svg: "/images/forecast/svg/calendar.svg",
      rotate: false,
      pulse: true,
      style: {
        background: "linear-gradient(135deg, #1e1a77, #ffb377, #128c77)"
      }
    },

    {
      label: "Светла част",
      value: getDayLength.value,
      icon: "mdi-clock-time-eight-outline",
      svg: "/images/forecast/svg/dust-day.svg",
      pulse: false,
      rotate: false,
      color: "secondary",
      style: {
        background: "linear-gradient(135deg, #fff4cc, #ffe082, #ff8c42)"
      }
    },

    {
      label: "Изгрев",
      value: formatMoonTime(currentSunData.value?.sunRise),
      icon: "mdi-weather-sunset-up",
      svg: "/images/forecast/svg/sunrise.svg",
      rotate: false,
      pulse: false,
      color: "primary",
      style: {
        background: "linear-gradient(135deg, #1e2a44, #ffb347, #ff8c42)"
      }
    },

    {
      label: "Top",
      value: currentSunData.value?.sunTransit,
      icon: "mdi-arrow-up-bold-outline",
      svg: "/images/forecast/svg/sun-hot.svg",
      rotate: false,
      pulse: false,
      color: "error",
      style: {
        background: "linear-gradient(135deg, #1c1f2b, #ffcc00, #ff7a00)"
      }
    },

    {
      label: "Залез",
    value: formatMoonTime(currentSunData.value?.sunSet),
      icon: "mdi-weather-sunset-down",
      svg: "/images/forecast/svg/sunset.svg",
      rotate: false,
      pulse: false,
      color: "warning",
      style: {
        background: "linear-gradient(135deg, #FF5E3A, #FF2A68, #8B1E3F)",
        color: "#fff"
      }
    }
  ];

  return base;
});

</script>

<style scoped>
/*


*/

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
  font-weight: 500;
  opacity: 0.85;
  margin-top: -2px;
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
