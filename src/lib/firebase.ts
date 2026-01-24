import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBokR7WzMT-gE9qno1VEeLkxx3Ob1yC66Y",
  authDomain: "aurameter-5953d.firebaseapp.com",
  databaseURL: "https://aurameter-5953d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aurameter-5953d",
  storageBucket: "aurameter-5953d.firebasestorage.app",
  messagingSenderId: "597392055580",
  appId: "1:597392055580:web:111d4fc99556cc59a76ed9",
  measurementId: "G-SFL9W9DDRS"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);