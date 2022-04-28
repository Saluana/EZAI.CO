/* eslint-disable */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import state from "../composables/state";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import { Storage } from "@capacitor/storage";
import { isPlatform } from "@ionic/vue";

//eslint-disable-next-line
const { user, isLoggedIn, menuIsOpen, toggleMenu, firebaseHasLoaded } = state;
console.log(user.value);

//import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  browserLocalPersistence,
  initializeAuth,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
    let idToken = await auth.currentUser.getIdToken(true);
    console.log("does the user exist?", idToken);

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
  let response = new Promise(async (resolve, reject) => {
    let idToken = await auth.currentUser.getIdToken(true);
    console.log("add user", idToken);

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
          resolve(data.user);
          console.log("Add User Success:");
          console.log(data);
        } else {
          reject(null);
          console.log("Add User Failure:");
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(null);
      });
  });
  return await response;
}

//Sign up using username and password
async function createUser(username, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const userData = userCredential.user;
      console.log(userData);
      let newUser = await addUserToDB(username, email, userData.uid);

      if (newUser) {
        await Storage.set({ key: "user", value: JSON.stringify(newUser) });
        user.value = newUser;
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
    })
    .catch((error) => {
      console.log(error.code);
    });
}

//Login using email and password
function signInWithEmail(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      let dbUser = await doesUserExist(userCredential.user.uid);
      if (dbUser) {
        await Storage.set({ key: "user", value: JSON.stringify(dbUser) });
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}

//Login using Google
const platform = isPlatform("capacitor");
onAuthStateChanged(auth, (change) => {
  if (change) {
    if (change.hasOwnProperty("uid")) {
      isLoggedIn.value = true;
    }
  }
});

async function loginWithGoogle() {
  let credential;
  let idToken;

  await FirebaseAuthentication.signInWithGoogle().then((result) => {
    console.log("Google Sign In Successful", result.credential);
    idToken = result.credential.idToken;
  });

  console.log("idToken", idToken);

  credential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(auth, credential)
    .then(async (result) => {
      console.log("cred", result.user);

      await doesUserExist(result.user.uid)
        .then(async (dbUser) => {
          if (dbUser) {
            console.log("User exists in DB");
            await Storage.set({ key: "user", value: JSON.stringify(dbUser) });
            user.value = dbUser;
            isLoggedIn.value = true;
          }
        })
        .catch(async (error) => {
          if (error === null) {
            await addUserToDB(
              result.user.displayName,
              result.user.email,
              result.user.uid
            )
              .then(async (newUser) => {
                if (newUser) {
                  console.log("User added to DB");
                  await Storage.set({
                    key: "user",
                    value: JSON.stringify(newUser),
                  });
                  user.value = newUser;
                  isLoggedIn.value = true;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

async function signUserOut(router) {
  //Check if user signed in with email or google to determine which firebase auth method to use for sign out
  await FirebaseAuthentication.signOut();
  Storage.clear();
  isLoggedIn.value = false;
  if (menuIsOpen) {
    toggleMenu();
  }
  router.replace("/tabs/login");
}

export default {
  signUserOut,
  doesUserExist,
  addUserToDB,
  loginWithGoogle,
  createUser,
  signInWithEmail,
};
