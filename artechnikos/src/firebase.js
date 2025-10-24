// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB37g-mVDq8ox5ZnJUwArX3uO5mCl73fQE",
  authDomain: "artechnikos-1.firebaseapp.com",
  projectId: "artechnikos-1",
  storageBucket: "artechnikos-1.firebasestorage.app",
  messagingSenderId: "824108682873",
  appId: "1:824108682873:web:0a93a9405c7783ca9b4ea8",
  measurementId: "G-WC3L8TJFXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);