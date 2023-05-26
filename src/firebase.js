import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyAWyS8Yd1E2nJ3VvXiq5th8Mz4IvrCd_bM",

  authDomain: "chat-16003.firebaseapp.com",

  projectId: "chat-16003",

  storageBucket: "chat-16003.appspot.com",

  messagingSenderId: "496242926563",

  appId: "1:496242926563:web:cae07cd01f9418f8fa36d6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
