<template>
  <v-app-bar absolute height="54" color="" class="bg-color">
    <!-- title label ---->

    
    <div class="d-flex  mx-1 align-center" style="height: 40px">
      <v-img src="/images/logo/2.png" height="50" width="50" contain />
    </div>
    
    <v-toolbar-title class="d-none d-sm-flex font-weight-bold ml-2  fc-logo "> Fishing Chance </v-toolbar-title>
    <!-- desktop version routing ---->
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <!-- router page links ---->
    <div class="">
      <v-btn @click="() => onPath('Home')" class="font-weight-bold">Home</v-btn>
      <v-btn @click="() => onPath('Fishwiki')" class="font-weight-bold">Fishwiki</v-btn>
      <v-btn @click="() => onPath('About')" class="font-weight-bold">About</v-btn>
    </div>

    <!-- icons ---->
  </v-app-bar>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const onPath = pathName => {
  const path = pathName.toLowerCase();
  router.push(path === "home" ? "/" : path).catch(() => {});
};
</script>

<style scoped>
.bg-color {
  background: linear-gradient(135deg, #0a1028 0%, #101551 40%, #12335c 100%);
}


.fc-logo {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  background: linear-gradient(
    90deg,
    #7dd3fc,
    #38bdf8,
    #67e8f9,
    #ffffff
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-shadow:
    0 0 12px rgba(56, 189, 248, 0.35),
    0 0 24px rgba(34, 211, 238, 0.18);

  user-select: none;
}
</style>
