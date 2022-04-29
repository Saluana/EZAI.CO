<template>
  <div>
    <ion-menu side="start" menu-id="first" content-id="main">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Settings</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item @click="signUserOut(router)">Sign Out</ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-router-outlet id="main"></ion-router-outlet>
  </div>
</template>
<style>
.my-custom-menu {
  --width: 500px;
}
</style>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenu,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import firebase from "../firebase/firebase";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonMenu,
    IonRouterOutlet,
    IonTitle,
    IonToolbar,
  },
  setup() {
    const { signUserOut } = firebase;
    const router = useRouter();

    return { signUserOut, router };
  },
});
</script>