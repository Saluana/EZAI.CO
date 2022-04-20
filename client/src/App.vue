<template>
  <ion-app>
    <MenuContainer />
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, onMounted } from "vue";
import state from "./composables/state";
import MenuContainer from "./components/MenuContainer.vue";
import { Storage } from "@capacitor/storage";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    MenuContainer,
  },
  setup() {
    const { user } = state;

    onMounted(async () => {
      const token = await Storage.get({ key: "token" });
      if (token) {
        user.value.isLoggedIn = true;
      }
    });

    return {};
  },
});
</script>