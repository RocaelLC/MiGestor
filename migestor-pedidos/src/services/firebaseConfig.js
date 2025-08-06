import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAKpZ19xf5pE_1er6xHVLusG30op1USQo",
  authDomain: "migestor-c6792.firebaseapp.com",
  projectId: "migestor-c6792",
  storageBucket: "migestor-c6792.firebasestorage.app",
  messagingSenderId: "559140456572",
  appId: "1:559140456572:web:b0e637553d428b3b6de1f9",
  measurementId: "G-4KX6Q1QMQ6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);