// Weather open-met
async function getWeather(lat, lng) {
  let urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}
&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m
&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,wind_speed_10m,wind_direction_10m,wind_gusts_10m,soil_temperature_0cm,soil_moisture_0_1cm
&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant
&timezone=Europe/Sofia
&windspeed_unit=ms`;

  const res = await fetch(urlWeather.replace(/\n/g, ''))
  const dataWeather = await res.json()
  return dataWeather
}


// Marine   open-met
async function getMarine(lat, lng) {
  // let urlMarine = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&hourly=sea_surface_temperature`;

let urlMarine = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}` +
                `&hourly=wave_height,wave_direction,wave_period,sea_surface_temperature,ocean_current_velocity` +
                `&timezone=Europe/Sofia`;
  const res = await fetch(urlMarine)
  const dataMarine = await res.json()
  return dataMarine
}


// Moon and Fish Chance by Solunar
async function getMoonBySol(lat, lng) {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  const dateStr = `${year}${month}${day}`

  const offset = -today.getTimezoneOffset() / 60

  const urlSolunar = `https://api.solunar.org/solunar/${lat},${lng},${dateStr},${offset}`

  const res = await fetch(urlSolunar)
  const dataSol = await res.json()

  return dataSol
}


//--------------------------((not using  weatherapi.com   Sun and Moon))
// Astrology
// Moon and Fish Chance by Solunar
async function getSunAndMoon(lat, lng) {
  const weatherapi = `https://api.weatherapi.com/v1/astronomy.json?key=320d0d54c07c4105a33110451260905&q=${lat},${lng}`
  
  try {
    const res = await fetch(weatherapi)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error('Грешка при заявката:weatherapi.com', error)
    return null
  }
}



export {
  getWeather,
  getMarine,
  getMoonBySol,
  getSunAndMoon,
}