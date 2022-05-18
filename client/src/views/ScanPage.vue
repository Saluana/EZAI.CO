<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Scan</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Image Assistant</ion-title>
        </ion-toolbar>
      </ion-header>

      <NotesContainer name="scan" />
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
import NotesContainer from "../components/NotesContainer.vue";

export default defineComponent({
  name: "ScanPage",
  components: {
    NotesContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
  },
});
</script>
