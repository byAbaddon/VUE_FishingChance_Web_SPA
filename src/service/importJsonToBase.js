import { doc, setDoc } from "firebase/firestore";
import { db } from '@/service/sdk'
import json from '@/assets/data/coordinates.json'


const data = json

function normalizeId(city) {
  return city.toLowerCase().replace(/\s+/g, "-");
}

async function importWeatherData() {
  for (const item of data) {
    const id = normalizeId(item.city);
    await setDoc(doc(db, "forecast", id), item);
  }
  console.log("JSON imported to 'weather' collection successfully.");
}

export { importWeatherData }