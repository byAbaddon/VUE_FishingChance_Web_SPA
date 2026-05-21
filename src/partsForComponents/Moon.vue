<!-- Moon   -->
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
      style="background-image: url(&quot;/images/moon/bg.png&quot;); background-size: cover; background-position: center"
      ref="card"
      class="map-container weather-card fancy-card"
      :class="{ night: currentMoonData?.isDay === 0 }">
      <!-- add Night Layer-BG if not Day -->
      <div class="night-overlay"></div>

      <!-- ((( Video BG  ))) -->
      <video ref="video" autoplay muted loop playsinline preload="metadata" poster="" class="bg-video">
        <source src="/images/bg/animation/forecast/skyTunder1.mp4" type="video/mp4" />
      </video>

      <div class="content">
        <!-- Title-->
        <v-card-title class="text-center">
          <div class="title-badge">Фаза на Луната</div>
        </v-card-title>

        <!-- Divider Lent-->
        <v-divider :thickness="3" class="neon-glow-blue border-opacity-100 mx-auto" color="primary" inset width="170"></v-divider>

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
            Обновено: {{ currentMoonData?.updatedAt }} ч.
          </div>
        </v-card-text>

        <!-- Image   :src="`/images/forecast/svg/${weatherCodeToIcon()}.svg`"-->
        <v-img max-width="240" max-height="172" class="mx-auto pulse-slow" 
        lazy-src="/images/logo/1.png"
         :src="`/images/moon/moonPhase/${short?.moonPhase ?? short?.moon_phase}.png`" alt="forecast image">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="red-lighten-1" indeterminate></v-progress-circular>
            </div>
          </template>
        </v-img>

        <!-- Label Moon Phase  Second-->
        <div class="text-center mt-4 mb-4">
          <v-card-text class="datetime-badge font-weight-bold">{{ bgMoon[short.moonPhase] ?? bgMoon[short?.moon_phase] ?? "Loading..." }}</v-card-text>
        </div>

        <!-- Divider  Second Lent-->
        <v-divider :thickness="2" inset width="280" class="neon-glow-blue border-opacity-100 mx-auto mb-5" color="primary"></v-divider>

        <!-- Grid Tiles -->
        <div class="tiles-grid">
          <v-card v-for="(metric, index) in metrics" :key="index" class="forecast-tile" :style="metric.style" elevation="16" hover>
            <template v-if="metric.svg">
              <img :src="metric.svg" style="margin: -14px; width: 70px" :class="[{}]" />
            </template>

            <v-icon v-else large :color="metric.color" class="tile-icon" :class="[{ pulse: metric.pulse, rotate: metric.rotate }]">
              {{ metric.icon }}
            </v-icon>

            <div class="tile-value gradient-text">{{ metric.value || '~'}}</div>
            <div class="tile-label">{{ metric.label}}</div>
          </v-card>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { GeoMoon, Ecliptic } from "astronomy-engine";
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
const currentMoonZodiac = ref(getMoonZodiac());

// Check moon name First and Last
const bgMoon = {
  "New Moon": "Новолуние",
  "Waxing Crescent": "Нарастваща Луна",
  "First Quarter": "Първа четвърт",
  "Waxing Gibbous": "Нарастваща полупълна",
  "Full Moon": "Пълнолуние",
  "Waning Gibbous": "Намаляваща полупълна",
  "Last Quarter": "Последна четвърт",
  "Waning Crescent": "Намаляваща Луна"
};

//Get Moon current zodiac sign    = .sign .mdi  .symbol .degree
function getMoonZodiac() {
  const timeNow = new Date();

  const moon = GeoMoon(timeNow);
  const ecliptic = Ecliptic(moon);

  const lambda = ecliptic.elon;

  const zodiacSigns = {
    Овен: { mdi: "mdi-zodiac-aries", symbol: "♈" },
    Телец: { mdi: "mdi-zodiac-taurus", symbol: "♉" },
    Близнаци: { mdi: "mdi-zodiac-gemini", symbol: "♊" },
    Рак: { mdi: "mdi-zodiac-cancer", symbol: "♋" },
    Лъв: { mdi: "mdi-zodiac-leo", symbol: "♌" },
    Дева: { mdi: "mdi-zodiac-virgo", symbol: "♍" },
    Везни: { mdi: "mdi-zodiac-libra", symbol: "♎" },
    Скорпион: { mdi: "mdi-zodiac-scorpio", symbol: "♏" },
    Стрелец: { mdi: "mdi-zodiac-sagittarius", symbol: "♐" },
    Козирог: { mdi: "mdi-zodiac-capricorn", symbol: "♑" },
    Водолей: { mdi: "mdi-zodiac-aquarius", symbol: "♒" },
    Риби: { mdi: "mdi-zodiac-pisces", symbol: "♓" }
  };

  const signsArray = Object.keys(zodiacSigns);
  const signIndex = Math.floor((lambda % 360) / 30);
  const signName = signsArray[signIndex];

  return {
    sign: signName,
    mdi: zodiacSigns[signName].mdi,
    symbol: zodiacSigns[signName].symbol,
    degree: lambda
  };
}

const short = computed(() => store.currentData?.moon?.data || null);

const currentMoonData = computed(() => {
  if (!short.value) return {};
  return {
    updatedAt: store.currentData?.moon?.updatedAt?.slice(11, 16),
    isDay: store.currentData?.weather?.data?.current?.is_day,
    moonRise: short.value?.moonRise  ?? short.value?.moonrise,
    moonSet: short.value?.moonSet   ?? short.value?.moonset,
    moonTransit: short.value?.moonTransit ?? getTopTransit(short.value?.moonrise,short.value?.moonset),
    moonPhase: short.value?.moonPhase  ?? short.value?.moon_phase,
    // percentMoonIllumination: Math.round((short.value?.moonIllumination || 0) * 100),
    // moonPositionInDays: Math.round((short.value?.moonIllumination || 0) * 29.53),
    percentMoonIllumination: Math.round((short.value?.moonIllumination ?? (short.value?.moon_illumination / 100) ?? 0) * 100),
    moonPositionInDays: Math.round((Math.round((short.value?.moonIllumination ?? (short.value?.moon_illumination / 100) ?? 0) * 100) / 100) * 29.53),

  };
});





// save Moon data to localStorage
watch(
  () => [
    currentMoonData.value?.moonPhase,
    currentMoonData.value?.percentMoonIllumination,
    formatMoonTime(currentMoonData.value?.moonRise),
    formatMoonTime(currentMoonData.value?.moonSet),
    currentMoonData.value?.moonPositionInDays,
  

  ],
  ([moonPhase, percentMoonIllumination,moonRise,moonSet,moonPositionInDays]) => {
    const otherData = JSON.parse(localStorage.getItem("otherData") || "{}");

    otherData.currentMoon = {
      moonPhase,
      percentMoonIllumination,
      moonRise,
      moonSet,
      moonPositionInDays,
    };

    localStorage.setItem("otherData", JSON.stringify(otherData));
  },
  { immediate: true }
);


 function getTopTransit(rise, set) {

  if (!rise || !set || rise.includes("No") || set.includes("No"))  return null


  const parse = (t) => {
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

  const result = `${h}:${String(m).padStart(2, '0')}`

  store.currentData.moon.data.moon_transit = result

  return result
}



// Dynamic change color BG
const colorForMetric = metric => {
  // console.log(metric.label, metric.value);
  switch (metric?.label) {
    case "Осветеност":
      const lumen = +metric?.value || 0;
      const alpha = 0.05 + (lumen / 100) * 0.6;
      return `rgba(180, 200, 255, ${alpha})`;

    case "Температура":
      const temp = +metric?.value || 0;

      if (temp > 75) return "#d50000"; // very big
      if (temp > 50) return "#f50057"; // big
      if (temp > 25) return "#ff9100"; // small
      return "#00e676"; // very small

    default:
      return "rgba(255,255,255,0.1)";
  }
};



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
      label: "Лунен ден",
      value: currentMoonData.value?.moonPositionInDays,
      icon: "mdi-lightbulb-on-outline",
      svg: "/images/forecast/svg/clear-night.svg",
      pulse: false,
      rotate: false,
      color: "red-lighten-1",
      style: { background: "rgba(255,155,255,0.1)" }
    },
    {
      label: "Лунна Зодия",
      value: currentMoonZodiac.value?.sign.toLowerCase(),
      icon: currentMoonZodiac.value?.mdi,
      // svg: "/images/forecast/svg/calendar.svg",
      rotate: false,
      pulse: true,
      color: "purple-lighten-1",
      style: { background: "dodgerblue" }
    },

    {
      label: "Осветеност",
      value: currentMoonData.value?.percentMoonIllumination + "%",
      icon: "mdi-lightbulb-on-outline",
      svg: "/images/forecast/svg/solar-eclipse.svg",
      pulse: false,
      rotate: false,
      color: "red-lighten-1",
      style: { background: colorForMetric({ label: "Осветеност", value: currentMoonData.value?.percentMoonIllumination }) }
    },

    {
      label: "Изгрев",
      value: currentMoonData.value?.moonRise?.includes('No') ? '' : formatMoonTime(currentMoonData.value?.moonRise),
      icon: "mdi-arrow-up-bold",
      svg: "/images/forecast/svg/falling-stars.svg",
      rotate: false,
      pulse: false,
      color: "blue-lighten-1",
      style: { background: colorForMetric({ label: "Дъжд", value: currentMoonData.value?.rain + "%" }) }
    },

    {
      label: "Top",
      value: currentMoonData.value?.moonTransit,
      icon: "mdi-arrow-down-bold",
      svg: "/images/forecast/svg/dust-night.svg",
      rotate: false,
      pulse: false,
      color: "cyan-lighten-1",
      style: { background: "linear-gradient(135deg, rgba(20,30,60,0.65), rgba(20,30,60,0.25))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }
    },

    {
      label: "Залез",
      value: currentMoonData.value?.moonSet?.includes('No') ? '' : formatMoonTime(currentMoonData.value?.moonSet),
      icon: "mdi-weather-night",
      svg: "/images/forecast/svg/starry-night.svg",
      rotate: false,
      pulse: false,
      color: "purple-lighten-1",
      style: { background: "darkslateblue" }
    }
  ];

  // check season is Winter, to change icon pressure to snow

  return base;
});


</script>

<style scoped>
/**/

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
  margin-top: 4px
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
