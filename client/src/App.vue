<template>
  <ion-app>
    <MenuContainer v-if="path !== '/tabs/login'" />
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import { watchEffect } from "vue";
import { useRouter } from "vue-router";
import state from "./composables/state";
import MenuContainer from "./components/MenuContainer.vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    MenuContainer,
  },
  setup() {
    const { isLoggedIn } = state;
    const router = useRouter();

    watchEffect(() => {
      if (router.currentRoute.value.path === "/login" && isLoggedIn.value) {
        console.log("Router replace tab1");
        router.replace("/tabs/tab1");
      } else if (
        router.currentRoute.value.path !== "/login" &&
        !isLoggedIn.value
      ) {
        console.log("router replace login");
        router.replace("/login");
      }
    });
  },
});
</script>