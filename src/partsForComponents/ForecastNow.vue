<template>
  <div>
    <v-card
      max-width="360"
      min-width="360"
      max-height="600"
      min-height="600"
      color="indigo-darken-3"
      elevated
      style="background-image: url(&quot;/images/forecast/null.png&quot;); background-size: cover; background-position: center"
      ref="mapContainer"
      class="map-container weather-card fancy-card"
      :class="{ night: currentForecastData.isDay === 0 }">
      <!-- add Night Layer-BG if not Day -->
      <div class="night-overlay"></div>

      <!-- ((( Video BG   No Video ))) -->
      <video ref="video" autoplay muted loop playsinline preload="metadata" poster="" class="bg-video">
        <source src="/images/bg/animation/forecast/sunRise0.mp4 " type="video/mp4" />
      </video>

      <div class="content">
        <!-- Title-->
        <v-card-title class="text-center">
          <div class="title-badge">Времето в момента</div>
        </v-card-title>

        <!-- Divider-->
        <v-divider :thickness="3" class="neon-glow border-opacity-100 mx-auto" color="pink-darken-1" inset width="170"></v-divider>

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
            Обновено: {{ currentForecastData?.updatedAt }} ч.
          </div>
        </v-card-text>

        <!-- Image -->
        <v-img max-width="240" max-height="172" class="mx-auto mt-n8" lazy-src="/images/logo/1.png" :src="`/images/forecast/svg/${weatherCodeToIcon}.svg`" alt="forecast image">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="red-lighten-1" indeterminate></v-progress-circular>
            </div>
          </template>
        </v-img>

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
import { ref, computed, watch } from "vue";
import { useDataTimeNow } from "@/composables/useDateTime";
import { useGeneralStore } from "@/stores/generalStore";
import { useVideoVisibility } from "@/composables/useVideoVisibility.js";

//bg video effect
const video = ref(null);
const card = ref(null);
useVideoVisibility(video, card, { threshold: 0.6 });

const { now } = useDataTimeNow();
const store = useGeneralStore();

const showCompass = ref(false);
const short = computed(() => store.currentData?.weather?.data?.current || null);



const currentForecastData = computed(() => {
  if (!short.value) return {};
  const directionDeg = short.value.wind_direction_10m;
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const indexDirections = Math.floor((directionDeg + 11.25) / 22.5) % 16;

  return {
    updatedAt: short.value.time?.slice(11, 16),
    temperature: short.value.temperature_2m,
    apparentTemperature: short.value.apparent_temperature,
    windSpeed: short.value.wind_speed_10m,
    windGustsMt: short.value.wind_gusts_10m,
    windDirection: directionDeg,
    labelDirection: directions[indexDirections],

    rain: short.value.rain,
    cloudCover: short.value.cloud_cover,
    snowfall: short.value.snowfall,
    pressure: short.value.pressure_msl,
    humidity: short.value.relative_humidity_2m,

    weatherCode: short.value.weather_code,
    isDay: short.value.is_day
  };
});

// save Weather data to localStorage
watch(
  () => [
    currentForecastData.value?.temperature,
    currentForecastData.value?.apparentTemperature,
    currentForecastData.value?.windSpeed,
    currentForecastData.value?.labelDirection,
    currentForecastData.value?.pressure,
    currentForecastData.value?.rain,
    currentForecastData.value?.cloudCover,

  ],
  ([temp, appTemp, windSpeed, windDirection, pressure, rain, cloudCover]) => {
    const otherData = JSON.parse(localStorage.getItem("otherData") || "{}");

    otherData.currentWeather = {
      temp,
      appTemp,
      windSpeed,
      windDirection,
      pressure,
      rain,
      cloudCover,
    };

    localStorage.setItem("otherData", JSON.stringify(otherData));
  },
  { immediate: true }
);

// Dynamic change color BG
const colorForMetric = metric => {
  switch (metric.label) {
    case "Температура":
      return `linear-gradient(135deg, ${metric.value.replace("°C", "") > 25 ? "#ff1744" : metric.value.replace("°C", "") < 10 ? "#2979ff" : "#ff9100"}, #ff80ab)`;

    case "Дъжд":
      return "#2196f3";

    case "Вятър":
      const speed = parseFloat(metric.value.replace(" m/s", ""));
      const gust = metric.windGustM || 0;

      if (gust > 12) return "#d50000"; // много силни пориви
      if (gust > 8) return "#f50057"; // силни пориви
      if (speed > 6) return "#ff9100"; // умерен към силен
      return "#00e676"; // слаб

    default:
      return "rgba(255,255,255,0.1)";
  }
};

const metrics = computed(() => {
  const isWinter = () => {
    const month = new Date().getMonth() + 1; // 1-12
    return month === 12 || month === 1 || month === 2 || month === 3;
  };

  const base = [
    {
      label: "Температура",
      value: currentForecastData.value.temperature + "°C",
      icon: "mdi-thermometer",
      svg: "/images/forecast/svg/thermometer-warmer.svg",
      pulse: false,
      color: "red-lighten-1",
      style: { background: colorForMetric({ label: "Температура", value: currentForecastData.value.temperature + "°C" }) }
    },

    {
      label: "Усеща се",
      value: currentForecastData.value.apparentTemperature + "°C",
      icon: "mdi-thermometer-lines",
      svg: "/images/forecast/svg/thermometer-colder.svg",
      color: "deep-orange-lighten-3",
      style: {
        background: "linear-gradient(235deg, rgba(85, 44, 199, 0.8)"
        // background: "rgba(25,95,25,0.70)" }
      }
    },

    {
      label: "Дъжд",
      value: currentForecastData.value.rain + "%",
      icon: "mdi-weather-rainy",
      svg: "/images/forecast/svg/rain.svg",
      pulse: false,
      color: "blue-lighten-1",
      style: { background: colorForMetric({ label: "Дъжд", value: currentForecastData.value.rain + "%" }) }
    },

    {
      label: "Вятър",
      value: currentForecastData.value.windSpeed + " m/s",
      icon: "mdi-weather-windy",
      svg: "/images/forecast/svg/wind.svg",
      rotate: false,
      color: "cyan-lighten-1",
      style: { background: "linear-gradient(135deg, rgba(20,30,60,0.65), rgba(20,30,60,0.25))", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }
    },

    {
      label: "Посока",
      value: currentForecastData.value.labelDirection,
      icon: "mdi-compass",
      svg: "/images/forecast/svg/compass.svg",
      rotate: false,
      color: "purple-lighten-1",
      style: {
        background: "linear-gradient(135deg, #1e2a44, #ffb347, #ff8c42)"
      }
    },

    {
      label: "Пориви",
      value: currentForecastData.value.windGustsMt + " m/s",
      icon: "mdi-weather-windy-variant",
      svg: "/images/forecast/svg/dust-wind.svg",
      color: "indigo-lighten-1",
      style: {
        background:
          currentForecastData.value.windGustsMt > 12
            ? "linear-gradient(135deg, rgba(213,0,0,0.6), rgba(213,0,0,0.2))"
            : currentForecastData.value.windGustsMt > 8
              ? "linear-gradient(135deg, rgba(124,77,255,0.6), rgba(124,77,255,0.2))"
              : currentForecastData.value.windGustsMt > 5
                ? "linear-gradient(135deg, rgba(41,121,255,0.6), rgba(41,121,255,0.2))"
                : "linear-gradient(135deg, rgba(0,188,212,0.6), rgba(0,188,212,0.2))",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.15)"
      }
    },

    {
      label: "Облачност",
      value: currentForecastData.value.cloudCover + "%",
      icon: "mdi-weather-cloudy",
      svg: "/images/forecast/svg/overcast.svg",
      pulse: false,
      color: "blue-grey-lighten-1",
      style: { background: "royalblue" }
    },
    isWinter()
      ? {
          label: "Сняг",
          value: currentForecastData.value.snowfall + " mm",
          icon: "mdi-weather-snowy",
          svg: "/images/forecast/svg/snow.svg",
          color: "light-blue-lighten-3",
          style: { background: "rgba(255,255,255,0.1)" }
        }
      : {
          label: "Налягане",
          value: currentForecastData.value.pressure + " hPa",
          icon: "mdi-gauge",
          svg: "/images/forecast/svg/barometer.svg",
          pulse: false,
          color: "red-lighten-2",
          style: { background: "rgba(255,255,255,0.1)" }
        },
    {
      label: "Влажност",
      value: currentForecastData.value.humidity + "%",
      icon: "mdi-water-percent",
      svg: "/images/forecast/svg/raindrop-measure.svg",
      color: "cyan",
      style: { background: colorForMetric({ label: "Дъжд", value: currentForecastData.value.humidity + "%" }) }
    }
  ];

  // check season is Winter, to change icon pressure to snow

  return base;
});

//-------------------(((Forecast icons)))-----------------humidity
const weatherCodeToIcon = computed(() => {
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
  let icon = iconMap[currentForecastData.value?.weatherCode] || "rainbow";

  //change icon Day or Night
  if (!currentForecastData.value?.isDay) {
    if (icon.includes("day")) {
      // some icon no other version - stay same
      icon = icon.replace("day", "night");
    }
  }

  return icon;
});

// save current Weather icon to localeStorage
watch(weatherCodeToIcon, newIcon => {
  if (!newIcon) return;
  const otherData = JSON.parse(localStorage.getItem("otherData") || "{}");

  otherData.currentWeather.currentWeatherIcon = newIcon;

  localStorage.setItem("otherData", JSON.stringify(otherData));
});


</script>

<style scoped>
/* ------------------- (((video)))-------------*/
.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  z-index: 0;
  pointer-events: none;
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
/* all elements overlay */
.night-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0); /* dey */
  transition: background 0.4s ease;
  pointer-events: none;
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
  color: #13df08;
  background: rgba(255, 255, 255, 0.2);
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

.forecast-tile {
  height: 96px !important;
  max-width:100px !important;
}
@media (max-width: 480px) {
  .forecast-tile {
    height:98px !important;
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

.gradient-text {
  background: linear-gradient(15deg, #50252800, #fff, #e7e3e3be);
  -webkit-background-clip: text;
  -webkit-text-fill-color: #49494909;
  animation: shine 2s infinite linear;
}

/*
.gradient-text[data-v-920abe55] {
  background: linear-gradient(90deg, #ffffff, #e0e0e0, #bdbdbd, #ffffff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.98);
  animation: shine 5s linear infinite;
}
*/
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
