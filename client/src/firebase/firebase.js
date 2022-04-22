// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import state from "../composables/state";
import { Capacitor } from "@capacitor/core";
import { Storage } from "@capacitor/storage";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

//eslint-disable-next-line
const { user, menuIsOpen, toggleMenu } = state;
console.log(user.value);

//import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  browserLocalPersistence,
  initializeAuth,
  signOut,
} from "firebase/auth";

//Configures firebase app
import firebaseConfig from "./firebase-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

//Authenticate with username and password
let auth;

if (Capacitor.isNativePlatform()) {
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
  });
} else {
  auth = getAuth(app);
}

//Checks if a user exists in the MongoDB Database
async function doesUserExist(email) {
  let success = false;

  await fetch("http://localhost:3000/users/check/" + email)
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        success = true;
      } else {
        success = false;
      }
      return success;
    });

  return success;
}

//Adds a user to mongoDB
async function addUserToDB(username, email, uid) {
  let success = null;

  await fetch("http://localhost:3000/users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      email: email,
      uid: uid,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        success = true;
      } else {
        success = false;
      }
    });

  return success;
}

//Create a new user with email and password
async function createUser(username, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const userData = userCredential.user;
      console.log(userData);
      let userAdded = await addUserToDB(username, email, userData.uid);

      if (userAdded) {
        Storage.set({ key: "signedInWith", value: "email" });
        user.value.isLoggedIn = true;
      } else {
        user.value.isLoggedIn = false;
      }
    })
    .catch((error) => {
      console.log(error.code);
      // ..
    });
}

//Login using Google
async function authenticateWithGoogle() {
  await FirebaseAuthentication.signInWithGoogle().then(async (result) => {
    const userData = result.user;
    if (await doesUserExist(userData.email)) {
      console.log("User exists");
      await FirebaseAuthentication.getIdToken().then(async (idToken) => {
        await Storage.set({ key: "token", value: idToken.token });
      });
      user.value.isLoggedIn = true;
    } else {
      let userAdded = await addUserToDB(
        userData.displayName,
        userData.email,
        userData.uid
      );

      console.log(userAdded);
      if (userAdded) {
        await FirebaseAuthentication.getIdToken().then(async (idToken) => {
          await Storage.set({ key: "token", value: idToken.token });
        });
        user.value.isLoggedIn = true;
        console.log(user.value.isLoggedIn);
      } else {
        user.value.isLoggedIn = false;
      }
    }
  });
}

//check the state of the user

onAuthStateChanged(auth, async (userData) => {
  if (userData) {
    const signedInWith = await Storage.get({ key: "signedInWith" });
    let idToken;
    if (signedInWith.value === "email") {
      idToken = await auth.currentUser.getIdToken(false);
      console.log("email ID Token: " + idToken);
    } else {
      const token = await FirebaseAuthentication.getIdToken();
      idToken = token.token;
    }

    await Storage.set({ key: "token", value: idToken });

    user.value.isLoggedIn = true;
  } else {
    console.log("No user data");
  }
});

async function signUserOut() {
  const signedInWith = await Storage.get({ key: "signedInWith" });
  if (signedInWith.value === "email") {
    await signOut(auth);
  } else {
    await FirebaseAuthentication.signOut();
  }
  await Storage.remove({ key: "token" });
  await Storage.remove({ key: "signedInWith" });
  user.value.isLoggedIn = false;
  if (menuIsOpen.value) {
    toggleMenu();
  }
}

async function signInWithEmail(email, password) {
  console.log("Signing in...");
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const userData = userCredential.user;
      console.log(userData);

      FirebaseAuthentication.getIdToken().then(async (idToken) => {
        console.log(idToken);
        await Storage.set({ key: "token", value: idToken.token });
      });

      await Storage.set({ key: "signedInWith", value: "email" });
      user.value.isLoggedIn = true;
      console.log(user.value.isLoggedIn);
    })
    .catch((error) => {
      console.log("ERROR!!");
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}

async function getCurrentUser() {
  const signedInWith = await Storage.get({ key: "signedInWith" });
  console.log(signedInWith.value);
  if (signedInWith.value === "email") {
    console.log(auth.currentUser);
  } else {
    FirebaseAuthentication.getCurrentUser()
      .then((userData) => {
        console.log(userData);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default {
  createUser,
  authenticateWithGoogle,
  signUserOut,
  signInWithEmail,
  getCurrentUser,
};
