import firebase from "firebase/compat/app";
import "firebase/compat/auth";
//Go to https://console.firebase.google.com and register apiKey
const firebaseConfig = {
  apiKey: "AIzaSyBI8b7uSycf5tzDTQxYryex6lxwpmbG8Fc",
  authDomain: "otp-storeweb.firebaseapp.com",
  projectId: "otp-storeweb",
  storageBucket: "otp-storeweb.appspot.com",
  messagingSenderId: "1009895450519",
  appId: "1:1009895450519:web:0c7d83c62d9a8cc0a386d2",
  measurementId: "G-0P1WMLDDRN",
};

let auth = undefined;

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  auth = firebase.auth();
} catch (e) {
  console.log(e);
  auth = undefined;
}
export { auth, firebase };
