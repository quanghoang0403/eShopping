/**
 * Firebase SMS config
 * ApiKey: https://console.firebase.google.com
 */

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBI8b7uSycf5tzDTQxYryex6lxwpmbG8Fc",
    authDomain: "otp-storeweb.firebaseapp.com",
    projectId: "otp-storeweb",
    storageBucket: "otp-storeweb.appspot.com",
    messagingSenderId: "1009895450519",
    appId: "1:1009895450519:web:0c7d83c62d9a8cc0a386d2",
    measurementId: "G-0P1WMLDDRN",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export { firebase };

