// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5GxqfYNbFudj9uGtbbw-DXVYKPxDcNlU",
  authDomain: "lntest-170da.firebaseapp.com",
  projectId: "lntest-170da",
  storageBucket: "lntest-170da.appspot.com",
  messagingSenderId: "672017811398",
  appId: "1:672017811398:web:a519935e4f45719c3454c7",
  measurementId: "G-X41VBGF59W"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}

const auth = firebase.auth();
export { auth };
