import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
import { FIREBASE_KEY } from "@env";
const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: "professional-agenda-a6aa5.firebaseapp.com",
  projectId: "professional-agenda-a6aa5",
  storageBucket: "professional-agenda-a6aa5.appspot.com",
  messagingSenderId: "294453895115",
  appId: "1:294453895115:web:c53f12e76d97578837604e",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
