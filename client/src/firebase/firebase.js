// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import state from "../composables/state";
import { Capacitor } from "@capacitor/core";
import { Storage } from "@capacitor/storage";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

//eslint-disable-next-line
const { user, menuIsOpen, toggleMenu, updateUser } = state;
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
async function doesUserExist(uid) {
  let success = null;
  let idToken = await Storage.get({ key: "token" });

  await fetch("http://localhost:3000/users/check/" + uid, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: idToken.value,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        console.log(data);
        success = data.user;
      } else {
        success = undefined;
      }
      return success;
    });

  return success;
}

//Adds a user to mongoDB
async function addUserToDB(username, email, uid) {
  let success = null;
  const idToken = await Storage.get({ key: "token" });

  await fetch("http://localhost:3000/users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: idToken.value,
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
        success = data.user;
      } else {
        success = undefined;
      }
    });

  return success;
}

//Create a new user with email and password
async function createUser(username, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (result) => {
      // Signed in
      const userData = result.user;

      let idToken = await auth.currentUser.getIdToken(false);
      await Storage.set({ key: "token", value: idToken });

      let userAdded = await addUserToDB(username, email, userData.uid);

      if (userAdded) {
        await Storage.set({ key: "signedInWith", value: "email" });
        await Storage.set({ key: "user", value: JSON.stringify(userAdded) });
        await updateUser(true);
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
    let dbUserData = null;
    //Save firebase ID token and check if user exists in the database
    await FirebaseAuthentication.getIdToken().then(async (idToken) => {
      await Storage.set({ key: "token", value: idToken.token });
      dbUserData = await doesUserExist(userData.uid);
      if (dbUserData) {
        await Storage.set({ key: "user", value: JSON.stringify(dbUserData) });
      }
    });
    if (dbUserData) {
      await updateUser(true);
      user.value.isLoggedIn = true;
    } else {
      //If user does not exist add them to the DB
      let userAdded = await addUserToDB(
        userData.displayName,
        userData.email,
        userData.uid
      );
      //Save the user credentials to local storage
      if (userAdded) {
        await FirebaseAuthentication.getIdToken().then(async (idToken) => {
          await Storage.set({ key: "token", value: idToken.token });
          await Storage.set({ key: "user", value: JSON.stringify(userAdded) });
          await updateUser(true);
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
    //Check whether user signed in with email or google to determine which firebase auth method to use
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
    signUserOut();
  }
});

async function signUserOut() {
  //Check if user signed in with email or google to determine which firebase auth method to use for sign out
  const signedInWith = await Storage.get({ key: "signedInWith" });
  if (signedInWith.value === "email") {
    await signOut(auth);
  } else {
    await FirebaseAuthentication.signOut();
  }
  await Storage.remove({ key: "token" });
  await Storage.remove({ key: "user" });
  await Storage.remove({ key: "signedInWith" });
  await updateUser(false);

  if (menuIsOpen.value) {
    toggleMenu();
  }
}

//Sign user in using email and password
async function signInWithEmail(email, password) {
  console.log("Signing in...");
  signInWithEmailAndPassword(auth, email, password)
    .then(async (result) => {
      const userData = result.user;

      FirebaseAuthentication.getIdToken().then(async (idToken) => {
        await Storage.set({ key: "token", value: idToken.token });
        const dbUserData = await doesUserExist(userData.uid);
        await Storage.set({ key: "user", value: JSON.stringify(dbUserData) });
        await Storage.set({ key: "signedInWith", value: "email" });
        await updateUser(true);
      });

      user.value.isLoggedIn = true;
      console.log(user.value.isLoggedIn);
    })
    .catch((error) => {
      console.log("ERROR!!");
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}

//get the current user from firebase
async function getCurrentUser() {
  //check auth method to determine package to use
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
