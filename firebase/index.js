
import { useEffect, useState, createContext, useContext } from 'react'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//Analytics for web
import { getAnalytics } from "firebase/analytics";
//Authentication for Web
import { getAuth, onAuthStateChanged, reauthenticateWithCredential } from "firebase/auth";
//Cloud Firestore for Web
import { getFirestore } from "firebase/firestore";
import dbSetup from "./db-route";
import authSetup from "./auth-route";
//Cloud Storage for Web
//import { getAnalytics } from "firebase/storage";
//Cloud Messaging for Web
//import { getAnalytics } from "firebase/messaging";
//Realtime Database for Web
//import { getAnalytics } from "firebase/database";
//Cloud Functions for Web
//import { getAnalytics } from "firebase/functions";
//import { useEffect, useState } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const FirebaseContext = createContext({})


const useFirebaseInit = (firebaseConfig) => {

    const [app, setApp] = useState()
    const [analytics, setAnalytics] = useState()
    const [auth, setAuth] = useState()
    const [db, setDb] = useState()
    const [user, setUser] = useState()
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        if(auth) {
            // The user object has basic properties such as display name, email, etc.
            /*
            const displayName = user.displayName;
            const email = user.email;
            const photoURL = user.photoURL;
            const emailVerified = user.emailVerified;
            */
            setUser(auth.currentUser)
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    setUser(user)
                } else {
                    // User is signed out
                    setUser(null)
                }
                setAuthLoading(false)
            })

        } else {
            setAuthLoading(true)
        }
    }, [auth])
    
    useEffect(() => {
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        // Initialize Firebase
        const theApp = initializeApp(firebaseConfig)
        setApp(theApp)
        setAnalytics(getAnalytics(theApp))
        setAuth(getAuth(theApp))
        setDb(getFirestore(theApp));
    }, [])
  
    return { 
        app, 
        analytics, 
        auth: auth? authSetup(auth) : null,
        db: db? dbSetup(db) : null,
        user,
        setUser,
        authLoading
    }
    
}

const FirebaseProvider = ({firebaseConfig, ...props}) => {
    const firebase = useFirebaseInit(firebaseConfig)

    return <FirebaseContext.Provider value={firebase} {...props} />;
}

function useFirebase() {
    return useContext(FirebaseContext)
}

const firebaseErrorParser = e => {
    var msg = e.message
    if(msg.toLowerCase().startsWith("firebase: ")) {
        msg = msg.substring("firebase: ".length)
    }
    if(msg.includes("(auth/")) {
        console.log("User.withdraw.firebase.error", msg)
        var index = msg.indexOf("(auth/")
        msg = msg.substring(0, index)
    }
    return msg
}

export { useFirebaseInit, useFirebase, FirebaseProvider, firebaseErrorParser }