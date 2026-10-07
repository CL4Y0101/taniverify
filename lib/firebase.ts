import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

// Konfigurasi Firebase web (publik by design — diamankan via Firestore rules,
// bukan dengan merahasiakan config ini).
const firebaseConfig = {
  apiKey: "AIzaSyDpGngT04o6qYf_O678dwBM14rJxBkr2XY",
  authDomain: "taniverify.firebaseapp.com",
  projectId: "taniverify",
  storageBucket: "taniverify.firebasestorage.app",
  messagingSenderId: "917430933099",
  appId: "1:917430933099:web:ebd3d10ca4427f24a0832e",
  measurementId: "G-D0S42ENDY7",
};

const app: FirebaseApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);
