/* eslint-disable */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import state from "../composables/state";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import { Storage } from "@capacitor/storage";

//eslint-disable-next-line
const { user, isLoggedIn, menuIsOpen, toggleMenu, firebaseHasLoaded } = state;
console.log(user.value);

//import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  browserLocalPersistence,
  initializeAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";

//Configures firebase app
import firebaseConfig from "./firebase-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
  const response = new Promise(async (resolve, reject) => {
    let idToken = await FirebaseAuthentication.getIdToken().then((result) => {
      return result.token;
    });

    await fetch("http://localhost:3000/users/check/" + uid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: idToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          console.log("Check user success!!");
          resolve(data.user);
        } else {
          console.log("Check user failure!!");
          reject(null);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(null);
      });
  });
  return await response;
}

//Adds a user to mongoDB
async function addUserToDB(username, email, uid) {
  let success = null;
  let idToken = await FirebaseAuthentication.getIdToken().then((result) => {
    return result.token;
  });

  await fetch("http://localhost:3000/users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: idToken,
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
        console.log("Add User Success:");
        console.log(data);
      } else {
        success = null;
        console.log("Add User Failure:");
        console.log(data);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return success;
}

//Login using Google
async function authenticateWithGoogle() {
  let response = new Promise(async (resolve, reject) => {
    //sign user in and return user data as promise
    let userData = await FirebaseAuthentication.signInWithGoogle();
    if (userData.user) {
      resolve(userData.user);
    } else {
      reject(new Error("error signing in"));
    }
  });
  return await response;
}

async function login() {
  const response = new Promise(async (resolve, reject) => {
    console.log("login started...");
    let fbUser = await authenticateWithGoogle();
    if (!fbUser) {
      reject(new Error("Error authenticating"));
    }
    let dbUser = fbUser ? await doesUserExist(fbUser.uid) : null;
    console.log(dbUser);
    if (fbUser) {
      console.log("User found in db....");
      await Storage.set({ key: "user", value: JSON.stringify(dbUser) });
      user.value = dbUser;
      isLoggedIn.value = true;
      resolve(dbUser);
    } else {
      console.log("User is being created...");
      let newUser = await addUserToDB(
        fbUser.displayName,
        fbUser.email,
        fbUser.uid
      );
      if (newUser) {
        console.log("User created in db....");
        await Storage.set({ key: "user", value: JSON.stringify(dbUser) });
        user.value = dbUser;
        isLoggedIn.value = true;
        resolve(dbUser);
      } else {
        reject(new Error("error signing in"));
      }
    }
  });
  return await response;
}

async function signUserOut(router) {
  //Check if user signed in with email or google to determine which firebase auth method to use for sign out
  await FirebaseAuthentication.signOut();
  Storage.clear();
  isLoggedIn.value = false;
  router.replace("/tabs/login");
}

export default {
  authenticateWithGoogle,
  signUserOut,
  doesUserExist,
  addUserToDB,
  login,
};
