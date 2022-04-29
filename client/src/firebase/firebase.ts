/* eslint-disable */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import state from "@/composables/state";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import { Storage } from "@capacitor/storage";


//eslint-disable-next-line
const { user, isLoggedIn, menuIsOpen, toggleMenu} = state;
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
  AuthCredential,
} from "firebase/auth";

//Configures firebase app
import firebaseConfig from "./firebase-config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Authenticate with username and password
let auth: any;
if (Capacitor.isNativePlatform()) {
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
  });
} else {
  auth = getAuth(app);
}

//Checks if a user exists in the MongoDB Database
async function doesUserExist(uid:string) {
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
async function addUserToDB(username:string, email:string, uid:string) {
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
async function createUser(username: string, email: string, password: string) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const userData = userCredential.user;
      console.log(userData);
      let newUser:any = await addUserToDB(username, email, userData.uid);

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
function signInWithEmail(email: string, password: string) {
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
onAuthStateChanged(auth, (change) => {
  if (change) {
    if (change.hasOwnProperty("uid")) {
      isLoggedIn.value = true;
    }
  }
});

async function loginWithGoogle() {
  let credential: any;
  let idToken: any;

  await FirebaseAuthentication.signInWithGoogle().then((result:any) => {
    console.log("Google Sign In Successful", result.credential);
    if (result.hasOwnProperty("credential")) {
    idToken = result.credential.idToken;
    }
  });

  console.log("idToken", idToken);

  credential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(auth, credential)
    .then(async (result) => {
      console.log("cred", result.user);

      await doesUserExist(result.user.uid)
        .then(async (dbUser:any) => {
          if (dbUser) {
            console.log("User exists in DB");
            await Storage.set({ key: "user", value: JSON.stringify(dbUser) });
            user.value = dbUser;
            isLoggedIn.value = true;
          }
        })
        .catch(async (error) => {
          if (error === null) {
            const username:string = result.user.displayName ? result.user.displayName : "";
            const email:string = result.user.email ? result.user.email : "";
            const uid:string = result.user.uid ? result.user.uid : "";
            
            await addUserToDB(
                username,
                email,
                uid
            )
              .then(async (newUser:any) => {
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

async function signUserOut() {
  //Check if user signed in with email or google to determine which firebase auth method to use for sign out
  await FirebaseAuthentication.signOut();
  Storage.clear();
  isLoggedIn.value = false;
  if (menuIsOpen) {
    toggleMenu();
  }
}

export default {
  signUserOut,
  doesUserExist,
  addUserToDB,
  loginWithGoogle,
  createUser,
  signInWithEmail,
};
