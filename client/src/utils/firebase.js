// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "react-estate-1142e.firebaseapp.com",
    projectId: "react-estate-1142e",
    storageBucket: "react-estate-1142e.appspot.com",
    messagingSenderId: "64560003649",
    appId: "1:64560003649:web:a0fba85c76ff97b3cda4c0",
    measurementId: "G-TG5N1WHD5M"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
