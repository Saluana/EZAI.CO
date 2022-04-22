<template>
  <ion-page>
    <div v-if="user.isLoggedIn">
      <ion-header>
        <ion-toolbar>
          <ion-title>Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Tab 2</ion-title>
          </ion-toolbar>
        </ion-header>
        <ExploreContainer name="Tab 2 page" />
      </ion-content>
    </div>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";
import state from "../composables/state.js";

export default {
  components: {
    ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
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