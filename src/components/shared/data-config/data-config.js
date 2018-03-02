

import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
        apiKey: "AIzaSyACO70rez3ZgOMQh-z6LVjsEV_ZNkbKV2o",
        authDomain: "rocita-dc5e6.firebaseapp.com",
        databaseURL: "https://rocita-dc5e6.firebaseio.com",
        projectId: "rocita-dc5e6",
        storageBucket: "rocita-dc5e6.appspot.com",
        messagingSenderId: "721654080292"
      });

export const db = firebaseApp.database();
      
