const firebase = require('firebase');
var Config = {
    apiKey: "AIzaSyAEtpOQ_QAeS9lneOuacvxQ4HNv-HpiSWc",
    authDomain: "node-tutorial-a6a14.firebaseapp.com",
    databaseURL: "https://node-tutorial-a6a14.firebaseio.com",
    projectId: "node-tutorial-a6a14",
    storageBucket: "node-tutorial-a6a14.appspot.com",
    messagingSenderId: "638459601190",
};

firebase.initializeApp(Config);


module.exports.SignUpWithEmailAndPassword = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            return JSON.stringify(user)
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                return { err: 'The password is too weak' }
            } else {
                return { err: errorMessage }
            }
            return { err: error }
        });
}

module.exports.SignInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                return { err: 'Wrong password' }
            } else {
                return { err: errorMessage }
            }
            return { err: error }
        });
}

module.exports.inputData = (name) => {
    return firebase.database().ref('users').set({
        name
    })
        .then(function () {
            console.log('Synchronization succeeded');
        })
        .catch(function (error) {
            console.log('Synchronization failed');
        });
}


return module.exports

