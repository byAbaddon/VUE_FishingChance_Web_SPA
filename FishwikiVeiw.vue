<template>
  <div>
    <v-container fluid class="fill-height pa-2 mt-1">
      <v-row align="center" justify="center">
        <v-col cols="12" class="d-none d-md-block">
          <h2 class="text-center text-uppercase fancy-title">Fish - wiki</h2>
          <!-- divider  -->
          <v-divider opacity=".9" gradient :thickness="12" color="pink-darken-1" :variant="true ? 'double' : 'solid'" length="" class="d-flex mx-8" />
        </v-col>

        <v-col class="d-sm-none" cols="12" v-if="fish">
          <!-- Card  -->
          <v-card class="mx-auto" max-width="350" max-height="600" min-height="600" color="light-blue-darken-4" style="border-radius: 8px">
            <!-- Title  -->
            <v-card-title class="fancy-card-title-bg bg-light-blue-darken-4 text-pink-lighten-2"> {{ fish.title }} </v-card-title>

            <!-- Images   -->
            <v-img height="160px" max-height="160px" cover class="mx-auto" :src="fish.image" lazy-src="/images/fish/bg0.png" alt="forecast image">
              <div class="bubbles"></div>
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="red-lighten-1" indeterminate></v-progress-circular>
                </div>
              </template>
            </v-img>

            <!-- Chips   -->
            <div class="chip-grid mt-2">
              <v-chip
                v-for="key in chipOrder"
                :key="key"
                @click="btnChip(key)"
                :variant="activeChip === key ? 'outlined' : 'elevated'"
                :class="activeChip === key ? 'bg-blue-lighten-5' : ''"
                size="small"
                :color="chipMeta[key].color"
                class="font-weight-medium chip-fixed">
                <span class="icon-wrap">
                  <v-icon size="10">{{ chipMeta[key].icon }}</v-icon>
                </span>
                <span class="pl-1">
                  {{ chipMeta[key].bg }}
                </span>
              </v-chip>
            </div>

            <!-- Wiki  card-text -->
            <v-card-text v-if="currentText == 'shortInfo'" class="mt-1 fancy-card-text-bg">
              {{ fish[currentText] || "Loading..." }}
            </v-card-text>

            <v-card-text v-else class="mt-1 fancy-card-text-bg">
              <span :class="`text-${chipMeta?.[currentText].color} || 'light-blue-lighten-4' `"> {{ chipMeta?.[currentText].bg || "" }}:</span> {{ fish[currentText] || "Load" }}
            </v-card-text>

            <!-- Divider second -->
            <v-divider opacity=".9" gradient :thickness="3" color="pink-darken-1" :variant="true ? 'double' : 'solid'" length="300" class="d-flex d-sm-none mt-2 mx-8" />

            <!-- Action  -->
            <v-card-actions class="my-0 py-0">
              <v-btn class="text-decoration-underline" readonly :color="show ? 'pink-lighten-1' : 'green-lighten-1'" :text="show ? 'Затвори wiki:' : 'Отвори wiki:'"></v-btn>
              <v-spacer></v-spacer>

              <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
            </v-card-actions>

            <!--   image -->
            <div v-show="!show" class="d-flex justify-center align-center mt-3">
              <v-img max-width="130" cover src="/images/logo/fishWiki.png" style="opacity: 0.8" />
            </div>

            <div v-show="!show" class="d-flex justify-space-between align-center px-4 mt-1">
              <v-btn @click="prevFish" :disabled="currentIndex == 0" size="30" icon="mdi-arrow-left" variant="elevated" color="error"></v-btn>

              <v-btn @click="nextFish" :disabled="currentIndex >= fishes.length - 1" size="30" icon="mdi-arrow-right" variant="elevated" color="success"></v-btn>
            </div>

            <v-expand-transition>
              <div v-show="show" class="">
                <v-expand-transition>
                  <div v-show="show">
                    <!-- Textarea -->
                    <v-textarea class="" label="" :model-value="fish.info" bg-color="light-blue-darken-4" readonly style="height: 230px" />
                  </div>
                </v-expand-transition>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>

        <!-- <v-col class="d-none d-sm-flex"> -->

        <!-- Temeline col -->
        <v-col cols="3">
          <v-timeline align="start" density>
            <v-timeline-item v-for="(c, i) in chipMeta" :key="i" :dot-color="c.color" size="small">
              <template v-slot:icon>
                <v-avatar :icon="c.icon" :variant="c.color"></v-avatar>
              </template>

              <div>
                <h2 :class="`mt-n1 headline font-weight-light mb-4 text-${c.color}`">
                  {{ c.bg }}
                </h2>
                <div>{{ c.bgInfo }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-col>

        <!-- Window  col -->
        <v-col cols="6" class="">
          <v-window v-model="fishModel" show-arrows continuous crossfade label>
            <v-window-item v-for="f in fishes" :key="f.id">
              <v-card rounded="10" flat class="mx-auto" max-width="800" min-height="700">
                <!-- Image -->
                <v-img height :src="f.image" lazy-src="/images/fish/bg0.png" cover max-height="400">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate />
                    </div>
                  </template>
                </v-img>

                <!-- Title -->
                <v-card-title class="">
                  {{ f.title }}
                </v-card-title>

                <!-- Chips -->
                <div class="chip-grid mt-2 px-2">
                  <v-chip v-for="key in chipOrder" :key="key" @click="btnChip(key)" :variant="activeChip === key ? 'outlined' : 'elevated'" size="small" :color="chipMeta[key].color">
                    <v-icon size="10">{{ chipMeta[key].icon }}</v-icon>
                    {{ chipMeta[key].bg }}
                  </v-chip>
                </div>

                <!-- Dynamic text -->
                <v-card-text>
                  <template v-if="currentText === 'shortInfo'">
                    {{ f[currentText] || "Loading..." }}
                  </template>

                  <template v-else>
                    <span :class="`text-${chipMeta?.[currentText]?.color}`"> {{ chipMeta?.[currentText]?.bg }}: </span>
                    {{ f[currentText] || "Load" }}
                  </template>
                </v-card-text>

                <!-- Extra info -->
                <v-card-text>
                  {{ f.info }}
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>

        <v-col cols="3">
             <v-timeline align="start" density>
            <v-timeline-item v-for="(c, i) in chipMeta" :key="i" :dot-color="c.color" size="small">
              <template v-slot:icon>
                <v-avatar :icon="c.icon" :variant="c.color"></v-avatar>
              </template>

              <div>
                <h2 :class="`mt-n1 headline font-weight-light mb-4 text-${c.color}`">
                  {{ c.bg }}
                </h2>
                <div>{{ c.bgInfo }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-col>

        <!-- <v-divider opacity=".9" gradient :thickness="12" color="pink-darken-1" :variant="true ? 'double' : 'solid'"  length="300" class="d-flex d-sm-none mt-6 mx-8" /> -->
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useGeneralStore } from "@/stores/generalStore";
import { onMounted, ref, computed } from "vue";

const store = useGeneralStore();
const show = ref(false);
const currentIndex = ref(0);
const currentText = ref("shortInfo");
let activeChip = ref(null);

const fishModel = ref(0);

const fishes = ref([
  {
    id: "hamsiya",
    title: "Хамсия",
    image: "/images/fish/Хамсия.png",
    season: "Целогодишно (най-добре есен)",
    shortInfo: "Дребна пасажна риба, основна храна за хищниците.",
    info: "Хамсията е дребна пасажна риба, широко разпространена в Черно море. Среща се в огромни пасажи близо до повърхността и извършва сезонни миграции. Храни се основно с планктон и е ключов елемент от хранителната верига, като служи за основна храна на хищници като чернокоп и лефер. Обикновено достига 8–15 см. Има голямо стопанско значение и е сред най-уловените риби в региона.",
    type: "пасажна",
    diet: "планктон",
    depth: "0 - 20 м",
    size: "8 - 15 см",
    bait: "чепаре",
    technique: "леко чепаре от бряг или лодка",
    activity: "целодневно",
    difficulty: "лесна",
    tags: ["пасажна", "есен"]
  }
]);

onMounted(async () => {
  fishes.value = await store.loadDataFishWiki();
});

const btnChip = key => {
  currentText.value = key;
  activeChip.value = activeChip.value === key ? null : key;
};

const chipOrder = ["season", "type", "diet", "depth", "size", "bait", "technique", "activity"];

const chipMeta = {
  season: {
    bg: "Сезон",
    bgInfo: "Периодът от годината с най-висока активност на рибата",
    color: "deep-purple-accent-4",
    icon: "mdi-weather-cloudy"
  },
  type: {
    bg: "Тип",
    bgInfo: "Поведение на рибата – пасажна или единична, начин на движение и лов",
    color: "indigo-darken-2",
    icon: "mdi-fish"
  },
  diet: {
    bg: "Храна",
    bgInfo: "Основните хранителни навици и предпочитана плячка",
    color: "teal-darken-1",
    icon: "mdi-leaf"
  },
  depth: {
    bg: "Дълбочина",
    bgInfo: "Типичният диапазон на дълбочина, в който се среща",
    color: "blue-darken-3",
    icon: "mdi-waves"
  },
  size: {
    bg: "Размер",
    bgInfo: "Средни и максимални размери, които достига",
    color: "cyan-darken-2",
    icon: "mdi-ruler"
  },
  bait: {
    bg: "Стръв",
    bgInfo: "Най-ефективните примамки и естествени стръвове",
    color: "pink-accent-3",
    icon: "mdi-hook"
  },
  technique: {
    bg: "Техника",
    bgInfo: "Подходящи методи на риболов за успешен улов",
    color: "orange-darken-2",
    icon: "mdi-head-lightbulb"
  },
  activity: {
    bg: "Активност",
    bgInfo: "Часовете от денонощието с най-интензивно хранене",
    color: "amber-darken-2",
    icon: "mdi-clock-outline"
  }
};

//change fish

const fish = computed(() => {
  return fishes.value[currentIndex.value];
});

const nextFish = () => {
  if (currentIndex.value < fishes.value.length - 1) {
    currentIndex.value++;
    currentText.value = "shortInfo";
    activeChip.value = null;
  }
};

const prevFish = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    currentText.value = "shortInfo";
    activeChip.value = null;
  }
};
</script>

<style scoped>
/*  */

.chip-grid {
  display: grid;
  grid-template-columns: repeat(4, max-content);
  gap: 6px;
  margin-left: 0.5%;
}

.fancy-card-title-bg {
  text-align: center;
  background: linear-gradient(135deg, #001f3f, #003f7f, #0074d9);
  color: #cce7ff;
  box-shadow:
    inset 0 0 15px rgba(0, 150, 255, 0.25),
    0 0 10px rgba(0, 100, 255, 0.4);
}

.fancy-card-text-bg {
  background: linear-gradient(125deg, #001f3f, #003f7f, #0074d9);
  color: #cce7ff;
  border-radius: 12px;
  padding: 12px;
  margin: 2%;
  box-shadow:
    inset 0 0 15px rgba(0, 150, 255, 0.25),
    0 0 10px rgba(0, 100, 255, 0.4);
}

/* bubbles animation */
.bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.5) 2px, transparent 3px), radial-gradient(circle, rgba(255, 255, 255, 0.3) 1.5px, transparent 2.5px);
  background-size:
    40px 80px,
    30px 60px;
  animation: bubblesMove 9s linear infinite;
}

@keyframes bubblesMove {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(-100%);
  }
}

.bubbles::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;

  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.5) 1.5px, transparent 2.5px);
  background-size: 420px 90px;

  animation: bubblesUp 15s linear infinite;
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
</style>
