// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvfjl0ZlHqvpc-7jeocM09WB0WxgASo-Q",
  authDomain: "swapitlikeithot.firebaseapp.com",
  projectId: "swapitlikeithot",
  storageBucket: "swapitlikeithot.appspot.com",
  messagingSenderId: "264073976301",
  appId: "1:264073976301:web:303395d9bb90c011aeafe4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export necessary items
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };