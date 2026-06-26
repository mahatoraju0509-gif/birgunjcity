import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCerCdacTmSa0svoFgN4-VnmVS-V0AVaAY",
  authDomain: "himalayanschool-38b7f.firebaseapp.com",
  projectId: "himalayanschool-38b7f",
  storageBucket: "himalayanschool-38b7f.firebasestorage.app",
  messagingSenderId: "593525519909",
  appId: "1:593525519909:web:10a1ac04951a5479f4b1cc"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;