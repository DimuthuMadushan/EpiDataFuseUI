import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const app = firebase.initializeApp({
  apiKey: "AIzaSyCSYiLZeUDzhM19Q9sfz0Wp_Vum7Q6v6ek",
  authDomain: "epidatafuse.firebaseapp.com",
  databaseURL: "https://epidatafuse.firebaseio.com",
  projectId: "epidatafuse",
  storageBucket: "epidatafuse.appspot.com",
  messagingSenderId: "697726385863",
  appId: "1:697726385863:web:419e9fc84e35b73fe848e2",
  measurementId: "G-4XHGTM838D"
});

export default app;
