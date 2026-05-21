import { computed } from 'vue'

function moonPhaseToNumber(phase) {
  const map = {
    "New Moon": 0.0,
    "Waxing Crescent": 0.25,
    "First Quarter": 0.5,
    "Waxing Gibbous": 0.75,
    "Full Moon": 1.0,
    "Waning Gibbous": 0.75,
    "Last Quarter": 0.5,
    "Waning Crescent": 0.25
  }
  return map[phase] ?? 0.5
}

function moonIndex(phaseText, illumination) {
  const phase = moonPhaseToNumber(phaseText)
  const illum = (illumination ?? 0) / 100
  return (phase * 0.6) + (illum * 0.4)
}

function timeToMinutes(t) {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function isInWindow(current, target, window = 60) {
  if (current == null || target == null) return false
  return Math.abs(current - target) <= window
}

export function useFishingCalcChance(store) {
  const chance = computed(() => {
    const data = store?.currentData
    const short = store?.short?.value

    const moon_phase_raw = short?.moon_phase
    const moonIllumination =
      short?.moonIllumination ??
      (short?.moon_illumination ?? 0)

    const moon_phase = moonPhaseToNumber(moon_phase_raw)

    const is_moon_up = short?.is_moon_up ?? 0
    const is_day = data?.weather?.data?.current?.is_day ?? 1

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const sunrise = timeToMinutes(data?.weather?.data?.sunrise)
    const sunset = timeToMinutes(data?.weather?.data?.sunset)

    const moonTransit = computed(() => {
       return timeToMinutes(store?.currentData?.moon?.data?.moon_transit)
    })
   
  
    const pressure = data?.weather?.data?.current?.pressure ?? 1013
    const wind = data?.weather?.data?.current?.wind_speed ?? 0
    const cloud = data?.weather?.data?.current?.cloud ?? 0

    const pressurePrev = store?.pressurePrev ?? pressure
    const pressureTrend =
      pressure < pressurePrev ? -1 :
      pressure > pressurePrev ? 1 : 0

    const sea_state = store?.seaState ?? 0

    const moonScore = (() => {
      let score = moonIndex(moon_phase_raw, moonIllumination)

      if (!is_moon_up) score *= 0.6

      return score
    })()

    const sunScore = (() => {
      const dawn = isInWindow(currentMinutes, sunrise, 60)
      const dusk = isInWindow(currentMinutes, sunset, 60)

      if (dawn || dusk) return 1
      if (is_day) return 0.5
      return 0.8
    })()

    const moonTransitBoost =
         isInWindow(currentMinutes, moonTransit.value, 60) ? 1 : 0.5

    const pressureScore =
      pressureTrend < 0 ? 1 :
      pressure < 1008 ? 0.8 :
      pressure > 1020 ? 0.4 : 0.6

    let weatherScore =
      (wind >= 3 && wind <= 7) ? 1 :
      wind < 2 ? 0.5 : 0.6

    if (cloud > 50) weatherScore += 0.2

    const seaScore =
      sea_state === 1 ? 1 :
      sea_state === 0 ? 0.7 : 0.3

    const score =
      moonScore * 0.25 +
      sunScore * 0.30 +
      moonTransitBoost * 0.15 +
      pressureScore * 0.15 +
      weatherScore * 0.10 +
      seaScore * 0.05

    const final = Math.round(1 + score * 4)

    return Math.min(5, Math.max(1, final))
  })

  const moonTransit = computed(() =>
    store?.currentData?.moon?.data?.moon_transit
  )

  return {
    chance,
    moonTransit
  }
}