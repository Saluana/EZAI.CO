<template>
  <div id="container" v-if="!isLoggedIn">
    <div id="form" @submit.prevent>
      <img class="login-image" src="../theme/images/robot.png" />

      <ion-button
        @click="async () => await login()"
        expand="block"
        fill="outline"
        class="form-btn"
        >Continue With Google
        <ion-icon class="google-icon" :icon="logoGoogle"></ion-icon
      ></ion-button>
    </div>
  </div>
</template>

<script>
import { IonButton, IonIcon } from "@ionic/vue";
import { logoGoogle } from "ionicons/icons";
import state from "../composables/state.js";
import firebase from "../firebase/firebase";
import { useRouter } from "vue-router";

export default {
  components: {
    IonButton,
    IonIcon,
  },
  setup() {
    const { login } = firebase;
    const { isLoggedIn } = state;
    const router = useRouter();

    return {
      logoGoogle,
      isLoggedIn,
      router,
      login,
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