<template>
  <div style="background: #101551" class="container text-center">
    <v-footer app class="footer" :style="!isBtnAgreeVisible ? 'max-height: 4.5em;' : null">
      <v-row justify="center" density="compact">
        <v-col cols="12" v-show="isBtnAgreeVisible">
          <v-btn @click="btnAgree" outlined small color="error" class="text-center mt-6"> Agree </v-btn>
        </v-col>

        <v-col cols="12" class="text-center">
          <div v-show="isBtnAgreeVisible" class="label font-italic text-white text-center">We use cookies - they help us give you the best possible experience!</div>
        </v-col>

        <v-col v-show="!isBtnAgreeVisible" cols="12" class="text-center">
          <v-footer app class="footer hover-wrapper">
            <div class="hover-info mx-auto first-part">
              <div class="text-white text-center">Visit other fishing fan groups and sites.</div>
              <v-divider :thickness="3" length="20em" class="mx-auto mt-1" />
            </div>
          </v-footer>

          `
          <div class="icons">
            <v-btn v-for="(icon, i) in icons" :key="icon"
             :href="links[i]"
              target="_blank"
              class="mx-3 mt-n3 soc-icons" :icon="icon" density="comfortable" variant="text" />
          </div>
        </v-col>

        <v-col v-show="!isBtnAgreeVisible" class="text-center mb-4">
          <div class="author font-bold text-white text-center flex">
            <span class="">by Abaddon</span>

            <v-btn @click="btnUp" icon size="22" :class="btnUpAnimation" class="ml-6 mb-2" variant="outlined">
              <v-icon>mdi-arrow-up-bold</v-icon>
            </v-btn>

            <!-- <span>Vue3 - Composition - Pinia - Vuetify3</span> -->
            <span class="">Copyright 2026</span>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isBtnAgreeVisible = ref(true);
const btnUpAnimation = ref("color-change-animation");
const icons = ["mdi-facebook", "mdi-web", "mdi-instagram", "mdi-youtube"];
const links = [
  "https://www.facebook.com/groups/643789872697112/",
  "https://hook.bg",
  "https://www.instagram.com/reel/DXZvUxbEmkS/",
  "https://www.youtube.com/@%D0%9F%D1%80%D0%BE%D0%B3%D0%BD%D0%BE%D0%B7%D0%B0%D0%B7%D0%B0%D0%A0%D0%B8%D0%B1%D0%BE%D0%BB%D0%BE%D0%B2"
];


const btnAgree = () => {
  isBtnAgreeVisible.value = false;
};

const btnUp = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};
</script>

<style scoped>
.hover-info {
  opacity: 1; /* default: visibility (desktop) */
  max-height: none;
}

/* mobile: hidden*/
@media (max-width: 360px) {
  .first-part {
    display: none;
  }

  .author {
    font-size: 12px;
  }

  .hover-info {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: 0.3s ease;
  }

  /* show only hover in footer */
  .hover-wrapper:hover .hover-info {
    opacity: 1;
    max-height: 200px;
  }

  .label {
    font-size: 10px;
    margin-bottom: 16px;
  }
}

.soc-icons {
  transition: transform 0.2s ease;
}

.soc-icons:hover {
  transform: rotate(8deg);
  background: crimson;
  opacity: 0.8;
}

.footer {
  background: #101551;
  background-image: url("/assets/images/lent.png");
  background-size: cover;
  background-repeat: no-repeat;
  padding: 12px;
}

.author {
  display: flex;
  justify-content: space-between;
}

span {
  text-shadow: 1px 1px 1px rgb(189, 179, 179);
}

@keyframes colorChange {
  0% {
    background-color: rgb(131, 4, 4);
  }

  50% {
    background-color: rgb(201, 53, 53);
  }

  100% {
    background-color: rgb(131, 4, 4);
  }
}

.color-change-animation {
  animation: colorChange 5s infinite;
}
</style>
