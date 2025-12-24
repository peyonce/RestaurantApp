import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
 
const firebaseConfig = {
  apiKey: "AIzaSyD44E6c892mXAMIM4bw4olUHuwpGsCYkdM",
  authDomain: "restaurantapp-5b4e5.firebaseapp.com",
  projectId: "restaurantapp-5b4e5",
  storageBucket: "restaurantapp-5b4e5.firebasestorage.app",
  messagingSenderId: "377621228124",
  appId: "1:377621228124:web:63155919bcfa1d1bc55499",
  measurementId: "G-B1HMV4QM5D"
};

 
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


export default app;