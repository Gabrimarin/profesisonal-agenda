import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
import Constants from "expo-constants";
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebase_key,
  authDomain: "professional-agenda-a6aa5.firebaseapp.com",
  projectId: "professional-agenda-a6aa5",
  storageBucket: "professional-agenda-a6aa5.appspot.com",
  messagingSenderId: "294453895115",
  appId: "1:294453895115:web:c53f12e76d97578837604e",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
