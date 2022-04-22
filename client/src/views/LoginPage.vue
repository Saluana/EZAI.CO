<template>
  <ion-page>
    <IonContent>
      <LoginContainer />
    </IonContent>
  </ion-page>
</template>

<script>
import { IonPage, IonContent } from "@ionic/vue";
import state from "../composables/state.js";
import LoginContainer from "../components/LoginContainer.vue";

export default {
  components: {
    IonContent,
    IonPage,
    LoginContainer,
  },
  setup() {
    const { user, menu } = state;
    return {
      user,
      menu,
    };
  },
};
</script>