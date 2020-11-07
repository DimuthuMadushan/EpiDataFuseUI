import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCSYiLZeUDzhM19Q9sfz0Wp_Vum7Q6v6ek",
    authDomain: "epidatafuse.firebaseapp.com",
    databaseURL: "https://epidatafuse.firebaseio.com",
    projectId: "epidatafuse",
    storageBucket: "epidatafuse.appspot.com",
    messagingSenderId: "697726385863",
    appId: "1:697726385863:web:419e9fc84e35b73fe848e2",
    measurementId: "G-4XHGTM838D"
  };

const fire = firebase.initializeApp(firebaseConfig);
export default fire;
