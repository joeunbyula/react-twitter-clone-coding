import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6mRAHEhpjMVax49ZIzCq0VqGO-l5fCyQ",
    authDomain: "nwitter-reloaded-cf5f9.firebaseapp.com",
    projectId: "nwitter-reloaded-cf5f9",
    storageBucket: "nwitter-reloaded-cf5f9.appspot.com",
    messagingSenderId: "140832780603",
    appId: "1:140832780603:web:beffb4c7930b050c3a871e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

