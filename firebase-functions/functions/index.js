const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const functions = require("firebase-functions");
const {getAuth} = require("firebase-admin/auth");
const db = admin.firestore();
exports.signUp = functions.https.onCall(async (data, context) => {
    let name = data.name
    let email = data.email
    let password = data.password
    try {

        const registerUser = await getAuth().createUser({
            email,password
        })
        await db.collection("users").doc(registerUser.uid).set({
            name: name,
            email: email,
        }, {merge: true})

        const uid = registerUser.uid
         const customToken = await getAuth()
            .createCustomToken(uid)


        return {
            success: true,
            registerUser : registerUser,
            token : customToken
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
});
//signUp({name : "Test50" , email: "test59@gmail.com" , password:"123456"})

