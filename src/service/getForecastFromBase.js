import { db } from '@/service/sdk'
import { collection, getDocs, query, orderBy } from "firebase/firestore"

                           
 let forecast = []

 const getForecast = async () => {
 forecast = []
   try {
    const getCollection = collection(db, "forecast")
    const sortedCollection = query(getCollection, orderBy("city"))
    const querySnapshot = await getDocs(sortedCollection)

    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data())
      let allData = Object.assign({}, { id: doc.id }, doc.data())
     forecast.push(allData)
    })

    return forecast

  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}



export  {getForecast , forecast} 