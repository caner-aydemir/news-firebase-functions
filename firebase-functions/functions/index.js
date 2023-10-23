const axios = require("axios");
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
        return {
            success: true,
            registerUser : registerUser,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
});

exports.getNews = functions.https.onCall(async (data, context)=> {
    try {
        let category = data.category
        let response ;
        let dataNews
        if(category === null)
        {
             response =  await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=6a38f7f13e644d2eb1f0b3bed5d5dbe3`)
        }
        else
        {
             response =  await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=6a38f7f13e644d2eb1f0b3bed5d5dbe3`)
        }
        dataNews = response.data
        return {
            category,
            data:dataNews,
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
});
