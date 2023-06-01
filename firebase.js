// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMCUDvM62UXv9uqSva4r0nzHcQZ8_FG58",
  authDomain: "whisper-dc937.firebaseapp.com",
  databaseURL: "https://whisper-dc937-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "whisper-dc937",
  storageBucket: "whisper-dc937.appspot.com",
  messagingSenderId: "876623953707",
  appId: "1:876623953707:web:737f03859be76b31404f6e"
};


// Initialize Firebase
  let app;
  if(firebase.apps.length === 0){
      app = firebase.initializeApp(firebaseConfig);
  } else {
      app = firebase.app();
  }
  const auth = firebase.auth()
  const db = getDatabase(app)
export {auth, db};