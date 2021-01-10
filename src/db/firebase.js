import firebase from "firebase";

let config = {
  apiKey: "*******",
  authDomain: "reactprogressevent.firebaseapp.com",
  projectId: "reactprogressevent",
  storageBucket: "reactprogressevent.appspot.com",
  messagingSenderId: "*********",
  appId: "*********",
};

firebase.initializeApp(config);

export default firebase.database();
