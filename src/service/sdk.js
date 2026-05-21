import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzmK2WSQLZokAT3HS17t3jwIeW1YzdQpk",
  authDomain: "fishingforecast-f8942.firebaseapp.com",
  projectId: "fishingforecast-f8942",
  storageBucket: "fishingforecast-f8942.firebasestorage.app",
  messagingSenderId: "836877034687",
  appId: "1:836877034687:web:020175b41bf2639739d20a",
  measurementId: "G-SKL9V3P1PZ"
};


const firebaseSDK = initializeApp(firebaseConfig);
const db = getFirestore(firebaseSDK);

const firebasePlugin = {
  install: (app) => {
    app.config.globalProperties.$firebase = firebaseSDK;
    app.config.globalProperties.$db = db;
  },
};

export { firebasePlugin, db };