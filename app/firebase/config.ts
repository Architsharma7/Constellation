// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsCzTpBq5EFMsIgVC4SVVgP8pUrWr6cIc",
  authDomain: "agichainlink.firebaseapp.com",
  projectId: "agichainlink",
  storageBucket: "agichainlink.appspot.com",
  messagingSenderId: "896088847321",
  appId: "1:896088847321:web:e8f483ce400941c17edfc8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { db };
