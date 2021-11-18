// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5nWMGUIRFBWn5EYS7jitcHIIh2GwDkfs",
  authDomain: "appgamoosh.firebaseapp.com",
  projectId: "appgamoosh",
  storageBucket: "appgamoosh.appspot.com",
  messagingSenderId: "36606009015",
  appId: "1:36606009015:web:b1ef7708878cb8e5abb732"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Import Admin SDK
const { getDatabase } = require('firebase-admin/database');

// Get a database reference to our blog
const db = getDatabase();
const ref = db.ref('sappgamoosh-default-rtdb');

const usersRef = ref.child('users');
usersRef.set({
  alanisawesome: {
    date_of_birth: 'June 23, 1912',
    full_name: 'Alan Turing'
  },
  gracehop: {
    date_of_birth: 'December 9, 1906',
    full_name: 'Grace Hopper'
  }
  //ted
});

