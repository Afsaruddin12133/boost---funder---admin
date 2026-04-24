import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBb4v-mzdf-Ybwj-RrN8mM772p-Zn-cnmU",
  authDomain: "boost-fundr.firebaseapp.com",
  projectId: "boost-fundr",
  storageBucket: "boost-fundr.firebasestorage.app",
  messagingSenderId: "1023406758540",
  appId: "1:1023406758540:web:3fc89049628b8d6984b9a9",
  measurementId: "G-2ZT73342TK"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth instance
export const auth = getAuth(app);