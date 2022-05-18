<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Extract</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Extract</ion-title>
        </ion-toolbar>
      </ion-header>
      <UrlContainer name="Tab 2 page" />
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
import UrlContainer from "../components/UrlContainer.vue";

export default defineComponent({
  name: "Tab2Page",
  components: {
    UrlContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
button {
  height: 50px;
  width: 100px;
}
</style>