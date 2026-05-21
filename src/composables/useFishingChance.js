import { computed } from "vue"

export function useFishingChance(data) {

  const result = computed(() => {
    const w = data.currentWeather
    const s = data.currentSea
    const m = data.currentMoon
    const sun = data.currentSun

    const now = new Date(sun?.dataTimeNow)

    const month = now.getUTCMonth() + 1
    const seasonMultiplier = (month >= 4 && month <= 12) ? 1 : 0.25

    const moon = 1 - (m.percentMoonIllumination / 100)


    const pressure = 1 - Math.min(Math.abs(w.pressure - 1020) / 25, 1)

    const windDirMap = {
      E: 0.9, ESE: 0.9, SE: 0.85, SSE: 0.8,
      S: 0.6, SW: 0.5, W: 0.4,
      N: 0.2, NE: 0.3, NW: 0.3
    }

    const wind =
      ((windDirMap[w.windDirection] ?? 0.5) +
        (1 - Math.min(w.windSpeed / 8, 1))) / 2

    const wave = (() => {
      const waveHeightScore =
        1 - Math.min(Math.abs(s.waveHeight - 0.4), 1)

      const waveDirScore =
        windDirMap[s.labelWaveDirection] ?? 0.5

      return (waveHeightScore * 0.6) + (waveDirScore * 0.4)
    })()

    const water = 1 - Math.min(Math.abs(s.temperature - 11) / 10, 1)

    const cloud = w.cloudCover / 100
    const rain = w.rain > 0 ? 0.7 : 1

    // ================= FIX TIME =================

    const sunrise = toMin(sun?.sunRise)
    const sunset = toMin(sun?.sunSet)

    const current =
      now.getUTCHours() * 60 +
      now.getUTCMinutes()

    let time = 0.2 // базов нощен шанс

    if (current >= sunrise && current <= sunset) {
      const diffSunset = Math.abs(sunset - current)
      const diffSunrise = Math.abs(current - sunrise)

      const sunsetScore = 1 - Math.min(diffSunset / 120, 1)
      const sunriseScore = 1 - Math.min(diffSunrise / 120, 1)

      time = Math.max(sunsetScore, sunriseScore)
    }

    // ============================================

    const base =
      moon * 0.08 +
      pressure * 0.18 +
      wind * 0.20 +
      wave * 0.20 +
      water * 0.10 +
      cloud * 0.06 +
      rain * 0.04 +
      time * 0.14

    const overallChance = clamp(base * 100 * seasonMultiplier)

    const species = {
      pelagic: [
        { name: "Хамсия", chance: clamp(overallChance * 0.85) },
        { name: "Сафрид", chance: clamp(overallChance * 1.00) },
        { name: "Чернокоп", chance: clamp(overallChance * 1.10) },
        { name: "Карагьоз", chance: clamp(overallChance * 0.90) },

    {
        name: "Зарган",
        chance: clamp(
          (
            wind * 0.25 +
            wave * 0.20 +
            (1 - cloud) * 0.20 +
            time * 0.35
          ) * overallChance *
          // бонус за дневен хищник
          (time > 0.6 ? 1.15 : 0.85)
        )
      }

      ],
      bottom: [
        {
          name: "Попче",
          chance: clamp(
            (
              pressure * 0.25 +
              (1 - wave) * 0.35 +
              cloud * 0.20 +
              (1 - wind) * 0.20
            ) * 100
          )
        },   {
          name: "Лихнус",
          chance: clamp(
            (
              pressure * 0.40 +
              water * 0.30 +
              (1 - wave) * 0.20 +
              (1 - wind) * 0.10
            ) * 100
          )
        },
        {
          name: "Скорпид",
          chance: clamp(
            (
              wave * 0.40 +
              wind * 0.30 +
              cloud * 0.10 +
              (1 - pressure) * 0.20
            ) * 100
          )
        },
        {
          name: "Врана",
          chance: clamp(
            (
              pressure * 0.30 +
              (1 - wave) * 0.30 +
              water * 0.20 +
              cloud * 0.20
            ) * 100
          )
        },
     
      ]
    }

const breakdown = [
  { name: "Час", value: clamp(time * 100) },
  { name: "Вятър", value: clamp(wind * 100) },
  { name: "Облачност", value: clamp(cloud * 100) },
  { name: "Вълнение", value: clamp(wave * 100) },
  { name: "Налягане", value: clamp(pressure * 100) },
  { name: "Луна", value: clamp(moon * 100) },
  // { name: "Дъжд", value: clamp(rain * 100) },
  // { name: "Вода", value: clamp(water * 100) },
]


    return {
      overallChance,
      species, 
      breakdown,
    }
  })

  return { result }
}

function toMin(t) {
  if (typeof t !== "string") return 0
  const [h, m] = t.split(":").map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return 0
  return h * 60 + m
}

function clamp(v) {
  return Math.max(0, Math.min(100, Math.round(v)))
}

