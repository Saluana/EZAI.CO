<template>
  <ion-app>
    <MenuContainer v-if="path !== '/tabs/login'" />
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

import MenuContainer from "./components/MenuContainer.vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    MenuContainer,
  },
  setup() {},
});
</script>