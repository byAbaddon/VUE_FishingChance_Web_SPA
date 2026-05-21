<template>
  <div>
    <v-card
      max-width="360"
      min-width="360"
      max-height="600"
      min-height="600"
      color="indigo-darken-3"
      elevated
      style="background-image: url(&quot;/images/bg/bgRedFish.png&quot;); background-size: cover; background-position: center"
      ref="mapContainer"
      class="map-container weather-card fancy-card"
      :class="{ night: currentForecastData?.isDay === 0 }">
      <!-- add Night Layer-BG if not Day -->
      <div class="night-overlay"></div>

      <!-- ((( Video BG   No Video ))) -->
      <video ref="video" autoplay muted loop playsinline preload="metadata" poster="" class="bg-video">
        <source src="/images/bg/animation/forecast/sunRise1.mp4 " type="video/mp4" />
      </video>

      <div class="content">
        <!-- Title-->
        <v-card-title class="text-center mb-n1">
          <div class="title-badge">Пет дневна прогноза</div>
        </v-card-title>

        <v-divider :thickness="3" class="neon-glow border-opacity-100 mx-auto" color="pink-darken-1" inset width="170"></v-divider>

        <!-- Data Time-->
        <v-card-text class="mt-n2 text-center">
          <div class="datetime-badge">
            <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
            {{ now.getDate() + 1 || "oт" }}
            <span class="mx-1"> - </span>
            {{ now.getDate() + 5 || "до" }} {{ months[now.getMonth()] || "месец" }} {{ now.getFullYear() || "година" }}
            <div>
              <v-switch style="transform: scale(0.7); transform-origin: right; position: absolute; top: -1em; left: 12em" v-model="noBlur" color="warning" hide-details />
            </div>
          </div>
        </v-card-text>

        <!-- Grid Tiles -->

        <div class="d-flex flex-column ga-1">
          <v-card v-for="(day, dayIndex) in forecast" :key="dayIndex" class="forecast-tile" elevation="12">
            <div class="body-tiles-grid">
              <!-- HEADER -->
              <div class="tile-header">
                <img v-if="day.svg" :src="day.svg" style="width: 70px; margin-top: -15px" />

                <div class="tile-value gradient-text mt-n2">{{ day.day }}</div>
                <div class="tile-label font-weight-bold text-indigo-lighten-4">{{ day.date }}</div>
              </div>

              <!-- METRICS -->
              <v-card v-for="(metric, metricIndex) in day.metrics" :key="metricIndex" :style="metric.style" elevation="16" hover>
                <div class="mt-3">
                  <div class="tile-value">{{ metric.label }}</div>
                  <div class="tile-label" style="">
                    <span :class="`text-${metric.colors[0]} font-weight-medium`">
                      {{ metric.value.split(/ \||\//)[0].trim() }}
                    </span>
                    /
                    <span :class="`text-${metric.colors[1]} font-weight-medium`">
                      {{ metric.value.split(/ \||\//)[1].trim() }}
                    </span>
                  </div>

                  <template v-if="metric.svg">
                    <v-icon large :color="metric.color" class="tile-icon pulse" :class="[{ pulse: metric.pulse, rotate: metric.rotate }]">
                      {{ metric.icon }}
                    </v-icon>
                  </template>

                  <template v-else>
                    <img :src="metric.svg" style="margin: -14px; width: 70px" :class="[{}]" />
                  </template>
                </div>
              </v-card>
            </div>
          </v-card>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useDataTimeNow } from "@/composables/useDateTime";
import { useGeneralStore } from "@/stores/generalStore";
import { useVideoVisibility } from "@/composables/useVideoVisibility.js";

//bg video effect
const video = ref(null);
const card = ref(null);
useVideoVisibility(video, card, { threshold: 0.6 });

const { now } = useDataTimeNow();
const store = useGeneralStore();
const noBlur = ref(true);

// Watch за noBlur
watch(noBlur, async newVal => {
  await nextTick();
  const cards = document.querySelectorAll(".body-tiles-grid > .v-card");
  cards.forEach(card => {
    if (newVal) {
      card.classList.remove("transparent-mode");
    } else {
      card.classList.add("transparent-mode");
    }
  });
});

const months = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
const daysOfWeek = ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"];

const short = computed(() => store.currentData?.weather?.data?.daily || {});

const currentForecastData = computed(() => {
  const daily = short.value;
  if (!daily || !daily.time) return {};

  // take index 1 to 5 only
  const start = 1;
  const end = 5;

  return {
    isDay: store.currentData?.weather?.data?.current?.is_day,
    dateArr: daily.time.slice(start, end + 1),
    dateStartEnd: start + " - " + end,
    weatherCodeArr: daily.weather_code.slice(start, end + 1),
    temperatureMaxArr: daily.temperature_2m_max.slice(start, end + 1),
    temperatureMinArr: daily.temperature_2m_min.slice(start, end + 1),
    windSpeedArr: daily.wind_speed_10m_max.slice(start, end + 1),
    windDirectionArr: daily.wind_direction_10m_dominant.slice(start, end + 1),
    rainPrecipitationArr: daily.precipitation_sum.slice(start, end + 1),
    rainArr: daily.rain_sum.slice(start, end + 1),
    snowfallArr: daily.snowfall_sum.slice(start, end + 1),
    snowArr: daily.showers_sum.slice(start, end + 1)
  };
});

const forecast = computed(() => {
  const data = currentForecastData.value;

  if (!data || !data.dateArr) return [];

  return data.dateArr.map((dateStr, i) => {
    const date = new Date(dateStr);

    return {
      day: daysOfWeek[date.getDay()],
      date: `${date.getDate()} ${months[date.getMonth()]}`,
      svg: `/images/forecast/svg/${weatherCodeToIcon(data.weatherCodeArr[i])}.svg`,
      metrics: [
        {
          label: "Темп",
          value: `${data.temperatureMinArr[i]}°C / ${data.temperatureMaxArr[i]}°C`,
          svg: "/images/forecast/svg/thermometer-warmer.svg",
          icon: "mdi-thermometer",
          color: "red-lighten-1",
          pulse: true,
          rotate: false,
          colors: ["cyan-accent-1", "pink-lighten-3", ]
          // style: { background: "linear-gradient(135deg, rgba(20,30,60,0.65), rgba(20,30,60,0.25))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }
        },
        {
          label: "Вятър",
          value: `${data.windSpeedArr[i]} ms /  ${getWindDirection(data.windDirectionArr[i])}`,
          svg: "/images/forecast/svg/wind.svg",
          icon: "mdi-weather-windy",
          color: "blue-lighten-1",
          pulse: true,
          rotate: false,
          colors: ["yellow-accent-3", "green-lighten-4"]
          // style: { background: colorForMetric({ label: "Дъжд", value: currentForecastData.value.humidity + "%" }) }
        },

        {
          label: "Валеж",
          value: `${data.rainPrecipitationArr[i]} % | ${data.rainArr[i]} mm `,
          svg: "/images/forecast/svg/rain.svg",
          icon: "mdi-weather-rainy",
          color: "blue-darken-1",
          pulse: true,
          rotate: false,
          colors: ["teal-lighten-3", "orange-accent-2"]
          // style: { color: colorForMetric({ label: "Дъжд", value: currentForecastData.value.humidity + "%" }) }
        }
      ]
    };
  });
});

function getWindDirection(deg) {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.floor((deg + 11.25) / 22.5) % 16;
  return directions[index];
}

//-------------------(((Forecast icons)))----------------
const weatherCodeToIcon = code => {
  const iconMap = {
    0: "clear-day",
    1: "partly-cloudy-day",
    2: "partly-cloudy-day",
    3: "cloudy",
    45: "mist",
    48: "mist",
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    56: "drizzle",
    57: "drizzle",
    61: "rain",
    63: "rain",
    65: "rain",
    66: "rain",
    67: "rain",
    71: "snow",
    73: "snow",
    75: "snow",
    77: "snow",
    80: "partly-cloudy-day-rain",
    81: "partly-cloudy-day-rain",
    82: "partly-cloudy-day-rain",
    85: "partly-cloudy-day-snow",
    86: "partly-cloudy-day-snow",
    95: "thunderstorms-day-rain",
    96: "thunderstorms-day-rain",
    99: "thunderstorms-day-rain"
  };

  // fallback Icon Rainbow for Unknown codes
  let icon = iconMap[code] || "rainbow";

  //change icon Day or Night
  if (!currentForecastData.value?.isDay) {
    if (icon.includes("day")) {
      // some icon no other version - stay same
      icon = icon.replace("day", "night");
    }
  }

  return icon;
};


</script>

<style scoped>
.mdi-weather-windy::before {
  content: "\F059D";
  color: gold;
}

div.elevation-12:nth-child(6) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) {
  content: "\F059D";
  color: rgb(248, 194, 210);
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
  display: flex;
  flex-direction: column; /* хоризонтални редове по дни */
  gap: 10px;
  padding: 0 10px;
}

.tile-header {
  min-width: 70px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* вертикално центриране */
  align-items: center;
  text-align: center;
  margin-left: 6px;
}

/*-------------------------------  second boxes tile */
/* make same tile  .body-tiles-grid same width height with header tile */
.body-tiles-grid > .v-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 80px;
  min-height: 80px; /* същото като .tile-header */
  padding: 0;
}

/* fix grid cols */
.body-tiles-grid {
  display: grid;
  grid-template-columns: 1.2fr repeat(4, 1fr);
  gap: 9px;
  align-items: stretch; /* така всички клетки се напасват по височина */
  row-gap: 14px; /* vertical gap между метриките */
  align-items: stretch;
}
/* cols of rows*/
.forecast-tile {
  margin-left: 5px;
  width: 21.8em;
  height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  border-radius: 10px;
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
  opacity: 0.9;
}


/*   phone Responsibility  fix*/

@media (max-width: 480px) {
  .forecast-tile   {
    height: 95px !important;
    width: 21.8em !important;
  }

}
/*  END  phone Responsibility  fix*/


/* нечетни редове */
.forecast-tile:nth-child(odd) {
  background: linear-gradient(135deg, rgba(255, 23, 68, 0.2), rgba(41, 121, 255, 0.3), rgba(255, 145, 0, 0.2), rgba(255, 128, 171, 0.2));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.25s ease;
}

/* четни редове */
.forecast-tile:nth-child(even) {
  background: linear-gradient(135deg, rgba(255, 128, 171, 0.2), rgba(255, 145, 0, 0.2), rgba(41, 121, 255, 0.3), rgba(255, 23, 68, 0.4));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.25s ease;
}

/* hover ефект */

.forecast-tile:hover {
  transform: translateY(-0.5px) rotateX(3deg);
  box-shadow:
    0 6px 17px rgba(0, 0, 0, 0.7),
    0 0 5px rgba(255, 128, 171, 0.8);
}




.body-tiles-grid > .v-card {
  box-shadow: none;
}
.tile-label {
  font-size: 0.65em;
  opacity: 1;
}

.tile-icon {
  font-size: 1.4em;
  margin-bottom: 12px;
}

.tile-value {
  font-size: 13px;
  font-weight: 800;
}

.body-tiles-grid > .v-card {
  border: none;
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
    transform: scale(1.02);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.85;
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

.neon-glow {
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

/* Гъзарски тъмен фон с прозрачност и gradient */

.body-tiles-grid > .v-card:nth-child(even) {
  background: #5170cccc;
    background: #183079cc;
  background-size: 300% 300%;
  border-radius: 100px;
  backdrop-filter: blur(10px);
}

.body-tiles-grid > .v-card:nth-child(odd) {
  background: #3f65d7d3;
    background: #183aa0d3;
  border-radius: 100px;
  backdrop-filter: blur(8px);
   
}

.body-tiles-grid > .v-card.transparent-mode {
  background: transparent !important;
}


</style>
