<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="form" @submit.prevent>
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
            v-if="isLoggingIn"
            @click="authWithEmail"
            expand="block"
            class="form-btn"
            >Sign In</ion-button
          >
          <ion-button
            v-else
            @click="authWithEmail"
            expand="block"
            class="form-btn"
            >Create Your Account</ion-button
          >
          <ion-button
            @click="async () => await loginWithGoogle()"
            expand="block"
            fill="outline"
            class="form-btn"
            >Continue With Google
            <ion-icon class="google-icon" :icon="logoGoogle"></ion-icon
          ></ion-button>
          <p v-if="isLoggingIn" @click.prevent="isLoggingIn = !isLoggingIn">
            Need to sign up?
          </p>
          <p v-else @click.prevent="isLoggingIn = !isLoggingIn">
            Wish to sign in?
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { logoGoogle } from "ionicons/icons";
import state from "../composables/state";
import firebase from "../firebase/firebase";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default defineComponent({
  name: "Tab1Page",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonIcon,
  },
  setup() {
    const { loginWithGoogle, signInWithEmail, createUser } = firebase;
    const { isLoggedIn } = state;
    const router = useRouter();
    const isLoggingIn = ref(true);
    interface UserDetails {
      email: string;
      username: string;
      password: string;
    }
    const userLoginDetails = ref<UserDetails>({
      email: "",
      username: "",
      password: "",
    });

    async function authWithEmail() {
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
      isLoggedIn,
      router,
      loginWithGoogle,
      isLoggingIn,
      userLoginDetails,
      authWithEmail,
    };
  },
});
</script>

<style scoped>
#container {
  display: flex;
  align-items: center;
  justify-content: center;
}

#form {
  width: 90%;
  margin-top: 8%;
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
