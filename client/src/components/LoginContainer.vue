<template>
  <div id="container">
    <div id="form">
      <img class="login-image" src="../theme/images/robot.png" />
      <ion-input
        class="login-input"
        clear-input
        placeholder="Enter Email"
        type="email"
        v-model="userLoginDetails.email"
      ></ion-input>
      <ion-input
        v-if="!isLoggingIn"
        class="login-input"
        clear-input
        placeholder="Enter Username"
        type="text"
        v-model="userLoginDetails.username"
      ></ion-input>
      <ion-input
        class="login-input"
        clear-input
        placeholder="Enter Password"
        type="password"
        v-model="userLoginDetails.password"
      ></ion-input>
      <ion-button
        @click="loginWithEmail"
        v-if="isLoggingIn"
        expand="block"
        class="form-btn"
        >Sign In</ion-button
      >
      <ion-button @click="loginWithEmail" v-else expand="block" class="form-btn"
        >Create Your Account</ion-button
      >
      <ion-button
        @click="authenticateWithGoogle"
        expand="block"
        fill="outline"
        class="form-btn"
        >Continue With Google
        <ion-icon class="google-icon" :icon="logoGoogle"></ion-icon
      ></ion-button>
      <p v-if="isLoggingIn" @click.prevent="isLoggingIn = !isLoggingIn">
        Need to sign up?
      </p>
      <p v-else @click.prevent="isLoggingIn = !isLoggingIn">Wish to sign in?</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { IonInput, IonButton, IonIcon } from "@ionic/vue";
import { logoGoogle } from "ionicons/icons";
import firebase from "../firebase/firebase";

export default {
  components: {
    IonInput,
    IonButton,
    IonIcon,
  },
  setup() {
    const { createUser, authenticateWithGoogle, signInWithEmail } = firebase;

    const isLoggingIn = ref(true);
    const userLoginDetails = ref({
      email: null,
      username: null,
      password: null,
    });

    //Login or create an account using email and password function from firebase file.
    async function loginWithEmail() {
      if (isLoggingIn.value === true) {
        signInWithEmail(
          userLoginDetails.value.email,
          userLoginDetails.value.password
        );
      } else {
        await createUser(
          userLoginDetails.value.username,
          userLoginDetails.value.email,
          userLoginDetails.value.password
        );
      }
    }

    return {
      logoGoogle,
      isLoggingIn,
      authenticateWithGoogle,
      loginWithEmail,
      userLoginDetails,
    };
  },
};
</script>

<style>
#container {
  display: flex;
  align-items: center;
  justify-content: center;
}

#form {
  width: 90%;
  margin-top: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.login-input {
  width: 100%;
  --background: white;
  --color: black;
  --padding-start: 5px;
  --padding-end: 3px;
  border: 1px solid lightgrey;
  border-radius: 8px;
  margin-bottom: 16px;
}

.form-btn {
  width: 100%;
  margin-bottom: 8px;
  --border-radius: 8px;
}

.google-icon {
  margin-left: 40%;
}

.login-image {
  height: 180px;
  width: 180px;
  margin-bottom: 30px;
  margin-top: 30px;
}
</style>