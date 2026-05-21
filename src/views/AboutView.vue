<template>
  <v-container fluid class="about-page pa-0">
    <!-- HERO -->
    <section class="hero-section d-flex align-center">
      <div class="hero-overlay"></div>

      <v-container class="position-relative z-index-2">
        <v-row justify="center">
          <v-col cols="12" md="9" class="text-center">
            <div class="hero-subtitle mb-3">BLACK SEA FISHING CHANCE</div>

            <h1 class="hero-title mb-4  d-none d-md-block ">Морски риболов България</h1>
            <h1 class="mb-4 d-sm-none">Морски риболов България</h1>
            <p class="hero-text">Прогнози, техники, дестинации, карти на риболовни точки от българското черноморие и много др.</p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ABOUT -->
    <section class="content-section">
      <v-container>
        <v-row align="center" class="gy-10">
          <v-col cols="12" md="6">
            <div class="section-tag mb-3">ABOUT</div>

            <h2 class="section-title mb-6  d-none d-md-block">Когато морето зове</h2>
            <h2 class=" mb-6 d-sm-none">Когато морето зове</h2>


            <p class="section-text mb-4">Има дни, в които морето е напълно тихо и спокойно. И други — когато вятърът реже, а вълните се разбиват с бясна сила.</p>

            <p class="section-text mb-4">Но рибарят пак е там &#128373; </p>

            <p class="section-text">
              Този сайт акцентира на морския риболов по нашето красиво Черноморие. Разглежда улова на едни от най полулярните риби като: сафрид, чернокоп, лефер, скорпид, морски врани и др. Както и
              онези всички моменти, които не могат да се обяснят, а само да се изживеят.
            </p>
          </v-col>

          <v-col cols="12" md="6"  >
            <div class="image-card">

              <img  
           
              height="600"
              width="100%"
              src="/images/bg/main.png" alt="sea" />
              
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- FEATURES -->
    <section class="features-section">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-tag mb-3">FEATURES</div>

          <h2 class="section-title  d-none d-md-block  ">Какво ще намерите</h2>
          <h2 class="d-sm-none">Какво ще намерите</h2>
        </div>

        <v-row>
          <v-col v-for="item in features" :key="item.title" cols="12" sm="6" md="3">
            <v-card class="feature-card" flat>
              <div class="feature-icon mb-4">
                <v-icon size="36">
                  {{ item.icon }}
                </v-icon>
              </div>

              <div class="feature-title mb-3">
                {{ item.title }}
              </div>

              <div class="feature-text">
                {{ item.text }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- QUOTE / FORUM -->
    <section class="quote-section">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="9" lg="8">
            <div class="quote-box text-center">
              <div class="forum-badge mb-5 text-yellow-darken-3">FISHING CHANCE FORUM</div>

              <div class="quote-text mb-6">Присъеденете се към нашата риболовна общност и споделете своят опит, излети, снимки, такъми, и преживявания.</div>

              <div class="forum-description mb-8 text-lime-lighten-4">
                Във форума ще откриете много дискусии по-различни теми, като: язовирен, речен, морски риболов. Техники, такъми и много други.
              </div>

              <v-btn color="#0684c3"  class="text-" variant="flat" href="https://fishingchance.rf.gd/forum/" target="_blank"> Forum </v-btn>

              <p style="font-size: 10px; color:grey" class="" >Кликнете за да се присъедините</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-container>
</template>

<script setup>
const features = [
  {
    icon: "mdi-bullseye-arrow",
    title: "Шанс - прогноза",
    text: "Приблизителни изчисления за риболовен успех."
  },
  {
    icon: "mdi-image-multiple",
    title: "Условия",
    text: "Време - слънце, вятър, налягане... Mорски данни - вълнение, посока. "
  },
  {
    icon: "mdi-fish",
    title: "Риби",
    text: "Информация за активност, сезони и поведение."
  },

  {
    icon: "mdi-hook",
    title: "Такъми",
    text: "Техника, чепарета, монтажи и др."
  }
];

// fetch("https://api.weatherapi.com/v1/astronomy.json?key=320d0d54c07c4105a33110451260905&q=Varna")
//  const weatherapi = `https://api.weatherapi.com/v1/astronomy.json?key=320d0d54c07c4105a33110451260905&q=${43.12},${27.95}`
// fetch(weatherapi)

//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Error:', error));




</script>

<style scoped>
.about-page {
  background: #07131f;
  color: white;
}

/* HERO */

.hero-section {
  position: relative;
  min-height: 100vh;
  background-image: url("/images/bg/main2.png");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(7, 19, 31, 0.15));
}

.z-index-2 {
  position: relative;
  z-index: 2;
}

.hero-subtitle {
  letter-spacing: 6px;
  font-size: 14px;
  color: #7ce0ff;
}

.hero-title {
  font-size: 72px;
  line-height: 1.1;
  font-weight: 800;
}

.hero-text {
  max-width: 720px;
  margin: auto;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
}

/* SECTIONS */

.content-section,
.features-section,
.quote-section {
  padding: 120px 0;
}

.section-tag {
  color: #1ea7ff;
  letter-spacing: 4px;
  font-size: 13px;
  font-weight: 700;
}

.section-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
}

.section-text {
  font-size: 18px;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.82);
}

/* IMAGE */

.image-card {
  overflow: hidden;
  border-radius: 28px;

}



/* FEATURES */

.features-section {
  background: #0d2236;
}

.feature-card {
  height: 100%;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: 0.3s;
}

.feature-card:hover {
  transform: translateY(-6px);
}

.feature-icon {
  color: #4fc3ff;
}

.feature-title {
  font-size: 24px;
  font-weight: 700;
}

.feature-text {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
}

/* QUOTE */

.quote-box {
  padding: 60px 30px;
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(30, 167, 255, 0.12), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.quote-text {
  font-size: 24px;
  line-height: 1.5;
  font-weight: 700;
}
</style>
