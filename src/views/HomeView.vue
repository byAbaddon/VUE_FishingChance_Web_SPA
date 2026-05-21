<template>
  <div>

    <v-container fluid class="home-bg pa-2">
      <!-- bg start    -->
      <div  class="bg-layer  d-sm-none"></div>

       
      <v-row class="fill-height" align="center" justify="center">
        <v-col cols="12" class="titles text-center text-white">
          <h2 class="text-center my-5 mr-4 text-uppercase fancy-title    ">Fishing forecast for the day</h2>

          <div class="subtitle-text text-center text-uppercase text-title font-weight-bold">
            <span class="bulgaria-flag">BULGARIA </span>
            <span class="middle ma-2 mt-1">-</span>
            <span class="last">{{ store.currentData.cityBG }} </span>
          </div>
        </v-col>

        <!-- Data Time-->
        <v-col cols="12" class="titles text-center text-white">
          <v-card-text class="text-center d-sm-none">
            <div class="datetime-badge">
              <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
              {{ now.toLocaleDateString("bg-BG") }}
              <span class="mx-1"></span>
              <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
              {{ now.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" }) }}
            </div>
          </v-card-text>
        </v-col>

        <!--   image -->
        <v-col class="d-flex justify-center align-center d-sm-none mt-3 mb-15 abs-pos">
          <v-img max-width="240" cover src="/images/logo/2.png" style="opacity: 0.6" />
        </v-col>

        <!--  separate  line-->
        <v-divider opacity=".9" gradient :thickness="12" color="pink-darken-1" variant="dotted" class="d-flex d-sm-none mt-n2 mx-5" />

        <v-col cols="auto" class="">
          <HomeComponent />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// Components
import HomeComponent from "@/components/HomeComponent.vue";
import { useDataTimeNow } from "@/composables/useDateTime";
import { useGeneralStore } from "@/stores/generalStore";
import { onMounted} from "vue";

const store = useGeneralStore();
const { now } = useDataTimeNow();

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  }); 
})



</script>

<style scoped>

.bg-layer {
  position: fixed;
  inset: 0;
  background-image: url("/images/bg/main4.png");
  background-size: cover;
  background-position: center;
  pointer-events: none;
  transition: opacity 0.2s ease;
  max-height:100%;
 
}



.home-bg {
  display: flex;
  min-height: 100dvh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
 background-image: url("/images/bg/main3.png");

 
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

.fancy-title {
  backdrop-filter: blur(0px);
  letter-spacing: 1.5px;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.45);
}

/* sibTitle*/
.subtitle-text {
  display: inline-flex;
  align-items: center;
  margin-top: 2em;
  padding: 0 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bulgaria-flag {
  font-size: 1.5rem;
  background: linear-gradient(to bottom, #ffffff 0%, #ffffff 43%, #00966e 44%, #00966e 58%, #d62612 65%, #d62612 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
}

.middle {
  font-size: 1.5rem;
  color: rgb(216, 176, 248);
}

.last {
  font-size: 1.1rem;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.45);
  color: rgb(229, 236, 247);
}


</style>

