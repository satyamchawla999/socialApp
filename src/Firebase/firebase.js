import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDXetTCAx_b85Vc4DWo5vJVzqornG2KB3I",
    authDomain: "tweetbook-d4799.firebaseapp.com",
    projectId: "tweetbook-d4799",
    storageBucket: "tweetbook-d4799.appspot.com",
    messagingSenderId: "857006008574",
    appId: "1:857006008574:web:ecd228089b462f58f49daf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export {
    app,
    auth,
    db,
    googleProvider,
    storage
}