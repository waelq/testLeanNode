const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyA5GxqfYNbFudj9uGtbbw-DXVYKPxDcNlU",
  authDomain: "lntest-170da.firebaseapp.com",
  projectId: "lntest-170da",
  storageBucket: "lntest-170da.appspot.com",
  messagingSenderId: "672017811398",
  appId: "1:672017811398:web:a519935e4f45719c3454c7",
  measurementId: "G-X41VBGF59W"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const Place = db.collection("Places");
module.exports = Place;
