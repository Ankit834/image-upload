import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "api_key",
    authDomain: "auth_domain",
    databaseURL: "database_url",
    projectId: "project_id",
    storageBucket: "storage_bucket",
    messagingSenderId: "messaging_sender _id",
    appId: "app_id",
    measurementId: "measurement_id"
  };

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.firestore();

export {
    storage, database, firebase as default
}