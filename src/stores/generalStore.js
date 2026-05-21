import { defineStore} from 'pinia'
import {  getWeather,  getMarine,  getMoonBySol, getSunAndMoon} from '@/service/getDataFromAPI'
import { ref,  reactive} from 'vue'

export const useGeneralStore = defineStore('city', () => {
  const firstStart = ref(true)
  const allCities = ref([])
  const collection = ref([]) // all data from coordinates.json

  const currentData = reactive({
    cityBG: 'Порт Варна',
    img: '/public/images/img/portVarna.jpeg',
    gps: {
      lat: 43.19290,
      lng: 27.92119
    },
    zone: "North",
    weather: {
      data: {},
      updatedAt: null
    },
    water: {
      data: {},
      updatedAt: null
    },
    moon: {
      data: {},
      updatedAt: null
    },
  })

  const loadDataFishWiki = async () => {
    const saved = localStorage.getItem('allFishesWiki')

    if (saved) {
      return JSON.parse(saved)
    }

    const res = await fetch('/data/fishes.json')
    const data = await res.json()

    localStorage.setItem('allFishesWiki', JSON.stringify(data))

    return data
  }


  const loadData = async () => {
    const saved = localStorage.getItem('fullData')
    let data
    if (!saved) {
      const res = await fetch('/data/coordinates.json')
      data = await res.json()
      localStorage.setItem('fullData', JSON.stringify(data))
    } else {
      data = JSON.parse(saved)
    }
    collection.value = data
    allCities.value = data.map(x => x.cityBG)
  }

  function isExpired(updatedAt, interval) {
    if (!updatedAt) return true
    return Date.now() - new Date(updatedAt).getTime() > interval
  }

  async function selectCity(cityName) {
    const newData = collection.value.find(c => c.cityBG === cityName)
    if (!newData) return

    Object.assign(currentData, newData)

    const intervals = {
      weather: 10 * 60 * 1000,
      water: 30 * 60 * 1000,
      moon: 60 * 60 * 1000
    }

    const tasks = []

    if (isExpired(currentData.weather.updatedAt, intervals.weather)) {
      tasks.push(refreshData('weather'))
    }

    if (isExpired(currentData.water.updatedAt, intervals.water)) {
      tasks.push(refreshData('water'))
    }

    if (isExpired(currentData.moon.updatedAt, intervals.moon)) {
      tasks.push(refreshData('moon'))
    }

    await Promise.all(tasks)
  }



  const refreshData = async (type) => {
    try {
      let data

      if (type === 'weather') {
        data = await getWeather(currentData.gps.lat, currentData.gps.lng)
        currentData.weather.data = data
        currentData.weather.updatedAt = new Date().toISOString()
      }

      if (type === 'water') {
        data = await getMarine(currentData.gps.lat, currentData.gps.lng)
        currentData.water.data = data
        currentData.water.updatedAt = new Date().toISOString()
      }

      // ---------------------------((( Fix if Solunar site Down  ))) ------------------- 
      //   if (type === 'moon') {
      //     data = await getMoonBySol(currentData.gps.lat, currentData.gps.lng)
      //     currentData.moon.data = data
      //     currentData.moon.updatedAt = new Date().toISOString()
      //  }
      if (type === 'moon') {
      
      async function withTimeout(promise, ms = 2000) {
         let timer

         const timeout = new Promise((_, reject) => {
           timer = setTimeout(() => {
             reject(new Error('timeout'))
           }, ms)
         })
       
         try {
           return await Promise.race([promise, timeout])
         } catch (e) {
           console.warn('Request timeout:', e.message)
           return null
         } finally {
           clearTimeout(timer)
         }
      }


       let solData = null

       try {
         solData = await withTimeout(
           getMoonBySol(currentData.gps.lat, currentData.gps.lng),
           2000
         )
       } catch (e) {
         console.warn('Solunar failed (timeout or error):', e)
       }
     
       const isSuccess =
         solData && Object.keys(solData).length > 0
     
       if (isSuccess) {
         currentData.moon.data = solData
       } else {
         console.warn('Fallback to Sun/Moon API')

         data = await getSunAndMoon(currentData.gps.lat, currentData.gps.lng)
         currentData.moon.data = data.astronomy.astro
         //console.log(data.astronomy.astro);
         
       }
     
       
       currentData.moon.updatedAt = new Date().toISOString()

      }
        
        
      // 👉 search current city in collection
      const index = collection.value.findIndex(c => c.cityBG === currentData.cityBG)
      if (index !== -1) {
        collection.value[index] = JSON.parse(JSON.stringify(currentData))
      }

      // 👉 save full array
      localStorage.setItem('fullData', JSON.stringify(collection.value))

    } catch (err) {
      console.error('Error fetching', type, err)
    }
  }



  // Add data  and start update interval
  let started = false

  if (!started) {
    started = true
    setTimeout(() => start(), 1000)
  }

  const start = async () => {
    await loadData()

    if (firstStart.value) {
      await refreshData('weather')
      await refreshData('water')
      await refreshData('moon')
      firstStart.value = false
    }

    const intervals = {
      weather: 15 * 60 * 1000, //60 =  update every 1 Hour
      water: 60 * 60 * 1000,
      moon: 360 * 60 * 1000 //360 = update every 6 Hours    
    }

    setInterval(async () => {
      const now = Date.now()

      const map = {
        weather: currentData.weather.updatedAt,
        water: currentData.water.updatedAt,
        moon: currentData.moon.updatedAt
      }

      const tasks = []

      for (const type in intervals) {
        const last = map[type] ? new Date(map[type]).getTime() : 0

        if (now - last >= intervals[type]) {
          tasks.push(refreshData(type))
        }
      }

      await Promise.all(tasks)

    }, 30 * 1000) // check for update every 30 seconds
  }



  return {
    allCities,
    collection,
    currentData,
    loadData,
    selectCity,
    refreshData,
    loadDataFishWiki,
  }
})