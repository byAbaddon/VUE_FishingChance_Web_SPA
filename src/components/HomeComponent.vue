<template>
  <div>
    <v-row   >
      <v-col  v-for="(item, index) in listPartOfComponents" :key="item.id">
        <div style="width: 100%; max-width: 500px">
          <component :is="item" />
        </div>

        <v-divider v-if="index < listPartOfComponents.length - 1" opacity=".9" gradient :thickness="12" color="pink-darken-1" variant="dotted" length="300" class="d-flex d-sm-none mt-6 mx-8" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import ForecastNow from "@/partsForComponents/ForecastNow.vue";
import Water from "@/partsForComponents/Water.vue";
import FishingChanceSolunar from "@/partsForComponents/FishingChanceSolunar.vue";
import FishingChanceAI from "@/partsForComponents/FishingChanceAI.vue";
import FishChanceAI from "@/partsForComponents/FishChanceAI.vue";

import Moon from "@/partsForComponents/Moon.vue";
import Sun from "@/partsForComponents/Sun.vue";
import ForecastWeek from "@/partsForComponents/ForecastWeek.vue";

import Locations from "@/partsForComponents/Locations.vue";
import Map from "@/partsForComponents/Map.vue";

const listPartOfComponents = [ForecastNow, FishingChanceSolunar, FishingChanceAI, FishChanceAI, Water, Sun, Moon, ForecastWeek, Map, Locations];
</script>

<style>
/* центриране на всички карти */
.weather-card {
  position: relative;
  right: 0.3%;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 360px;
  overflow: hidden;
  box-sizing: border-box;
}

/* grid fix */
.weather-card .tiles-grid {
  width: 100%;
  box-sizing: border-box;
  padding: 0 8px;
}

/* маха изместване от иконите */
.weather-card .forecast-tile img {
  margin: 0;
}

/* Vuetify row fix само вътре в карти */
.weather-card .v-row {
  margin: 0;
}

/* fix small display <= 360 */
@media (max-width: 360px) {
  .weather-card {
    right: 2.8%;
  }

  .v-divider {
    position: relative;
    right: 3%;
  }
}

/* Global css for  Home.vue */

.video-card {
  position: relative;
  overflow: hidden;
}

/* видео фон */
.bg-video {
  position: absolute;
  inset: 0; /* по-чисто от top/left/transform */
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -100;
}

/* overlay (по желание за четимост) */
.video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3); /* тъмен филтър */
  z-index: 1;
}

/* съдържание */
.content {
  position: relative;
  z-index: 2;
}

.bg-transparent {
  background-color: transparent;
  box-shadow: none;
}
</style>
