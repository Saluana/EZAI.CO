<template>
  <ion-page>
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
      <button @click="doesUserExist('wplWA58hamWdJVVzaka9m8p5iMQ2')">
        Does user exist
      </button>
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
} from "@ionic/vue";
import ExploreContainer from "../components/ExploreContainer.vue";
import firebase from "../firebase/firebase";

export default defineComponent({
  name: "Tab2Page",
  components: {
    ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
  },
  setup() {
    const { doesUserExist } = firebase;
    return {
      doesUserExist,
    };
  },
});
</script>

<style scoped>
button {
  height: 50px;
  width: 100px;
}
</style>