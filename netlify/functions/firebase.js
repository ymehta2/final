const firebase = require("firebase/app")
require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyAvxF37Ihx9TmXbES_H-22jsCeeQoA5ga8",
  authDomain: "kiei-451-cb972.firebaseapp.com",
  projectId: "kiei-451-cb972",
  storageBucket: "kiei-451-cb972.appspot.com",
  messagingSenderId: "264975974212",
  appId: "1:264975974212:web:4f2476f2995fa68b2a2111"
} // replace

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

module.exports = firebase