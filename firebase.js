const firebase = require('firebase');
const firebaseConfig = {
	apiKey: "AIzaSyBNNtpK9M51EPMF19slOmX_Ld7HrT-dss8",
	authDomain: "raiders-628d9.firebaseapp.com",
	databaseURL: "https://raiders-628d9-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "raiders-628d9",
	storageBucket: "raiders-628d9.appspot.com",
	messagingSenderId: "395904694787",
	appId: "1:395904694787:web:c865fdba68d7ecae8b6c36",
	measurementId: "G-PY1PEZW05K"
};
firebase.initializeApp(firebaseConfig);

module.exports = firebase;