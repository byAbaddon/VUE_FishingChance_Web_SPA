<template>
  <v-app class="container">
    <HeaderComponent class="item" />
    <v-main class="item">

      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>

    </v-main>
    <FooterComponent class="item" />
  </v-app>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import router from "@/router";
import { onMounted, onBeforeUnmount } from "vue";

const prevent = e => e.preventDefault(); // prevent drag and drop

onMounted(() => {
  console.log("Page mounted");
  if (router.currentRoute.value.path !== "/") {
    router.replace("/").catch(() => {}); // ignore duplicate navigation
  }

  document.addEventListener("dragstart", prevent);
  document.addEventListener("drop", prevent);
});

onBeforeUnmount(() => {
  document.removeEventListener("dragstart", prevent);
  document.removeEventListener("drop", prevent);
});


</script>



<style>
body {
  user-select: none;
  background: #e8eaf6;
}

.container {
  display: flex;
  flex-wrap: wrap;
}

.item {
  flex: 1;
  margin: 0px;
}




</style>
