const config = require("./config.json");

const firebase = require("firebase/app");

const firebaseConfig = {
    apiKey: config.FIREBASE.apiKey,
    authDomain: config.FIREBASE.authDomain,
    databaseURL: config.FIREBASE.databaseURL,
    projectId: config.FIREBASE.projectId,
    storageBucket: config.FIREBASE.storageBucket,
    messagingSenderId: config.FIREBASE.messagingSenderId,
    appId: config.FIREBASE.appId,
    measurementId: config.FIREBASE.measurementId,
};
firebase.initializeApp(firebaseConfig);

module.exports = firebase;
