const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.signUp = functions.https.onCall(async (data, context) => {
    let name = data.name
    let email = data.email
    let password = data.password
    try {
        const registerUser = await admin.auth().createUserWithEmailAndPassword({
            email: email,
            password: password,
        });

       await db.collection("users").doc(registerUser.uid).set({
            name : name,
            email:email,
        },{merge:true})

        return {
            success: true,
            uid: registerUser.uid,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
});

//signUp({name : "Test2" , email: "test2@gmail.com" , password:"123456"})