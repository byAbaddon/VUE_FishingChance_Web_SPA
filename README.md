# VUE_FishingChance_Web_SPA
# Fishing-Chance

Fishing Chance is a modern web platform for sea fishing in the Black Sea, designed with a focus on practical use and everyday functionality for anglers. The project combines an interactive dashboard, real-time data visualization, and a custom algorithm for calculating fishing success probability and activity levels of different marine species.

The platform uses multiple external API services and geolocation data to provide up-to-date information for specific marine locations through coordinates (latitude / longitude). The system analyzes factors such as atmospheric pressure, wind speed and direction, air and water temperature, moon phase, solar activity, seasonality, time of day, and sea conditions, then generates a dynamic prediction of fishing activity.

The main page features an interactive real-time dashboard composed of separate animated modules for:

Weather and atmospheric conditions
Marine data
Sun and moon information
GPS map and location
Fishing forecast
AI-based bite calculations
Activity probability for different fish species

Each module has its own visual style, animations, and independent logic, creating the experience of a complete mobile application rather than a standard informational website.

The platform is built with Vue.js and Vuetify and is fully responsive and optimized for mobile devices. The interface is designed for quick access to information directly from a smartphone while fishing, with an emphasis on smooth animations, modern design, and intuitive navigation.

The project also includes a Fish Wiki section — an interactive encyclopedia for Black Sea marine fish species containing images, descriptions, behavior patterns, activity levels, seasonality, depth ranges, preferred bait, and fishing techniques for species such as:

Atlantic horse mackerel (Safrid)
Bluefish (Chernokop)
Garfish (Zargan)
Shi drum (Lihnus)
European anchovy (Hamsiya)
Atlantic bonito (Palamida)
and more

Additionally, an informational About section has been developed with a connection to a dedicated forum and a future community-oriented direction.

Fishing Chance combines:

Real-time data
Predictive algorithms
Geolocation-based calculations
Interactive UI/UX
Mobile-first design

A visually rich dashboard system integrated into a complete fishing platform with the potential to evolve into a specialized application and community hub for sea fishing.










This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
