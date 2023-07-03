import { auth, googleProvider, db } from "./firebase";

import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";

import {
    query,
    getDocs,
    collection,
    where,
    addDoc,
    updateDoc,
} from "firebase/firestore";


// GOOGLE AUTH SIGN IN AND ADDING USER TO DATABASE WITH QUERY AND ADDDOCS
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "Users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);

        docs.docs.forEach((doc) => (console.log("id id", doc.id)));

        const data = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            notification: [],
            liked: [],
            imgUrl:"",
            online: true
        }

        if (docs.docs.length === 0) {
            await addDoc(collection(db, "Users"), data);
        } else {
            docs.forEach((doc) => {
                const docRef = doc.ref;
                updateDoc(docRef, { online: true });
            })
        }

        return data;

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

// MANUAL SIGN IN AND ADDING USER TO DATABASE WITH QUERY AND ADDDOCS
const logInWithEmailAndPassword = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const q = query(collection(db, "Users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);

        const data = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            notification: [],
            liked: [],
            online: true
        }

        if (docs.docs.length === 0) {
            await addDoc(collection(db, "Users"), data);
        }
        else {
            docs.forEach((doc) => {
                const docRef = doc.ref;
                updateDoc(docRef, { online: true });
            })
        }

        return data;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

// MANUAL SIGN UP AND ADDING USER TO DATABASE WITH QUERY AND ADDDOCS
const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        console.log(res);
        updateProfile(res.user, { displayName: name }).then((x) => console.log("success")).catch((err) => console.log(err));
        const user = res.user;

        const data = {
            uid: user.uid,
            name: name,
            email: user.email,
            notification: [],
            liked: [],
            online: true
        }

        await addDoc(collection(db, "Users"), data);
        return data;
    } catch (err) {
        alert(err);
        console.error(err);
    }
};


// LOGOUT AND SET ONLINE TO FALSE IN FIRESTORE DATABASE
const logout = async (uid) => {
    const q = query(collection(db, "Users"), where("uid", "==", uid));
    const docs = await getDocs(q);

    docs.forEach((doc) => {
        const docRef = doc.ref;
        updateDoc(docRef, { online: false });
    })

    signOut(auth);
};


export {
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout
}