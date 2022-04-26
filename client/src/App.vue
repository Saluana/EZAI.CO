<template>
  <ion-app>
    <MenuContainer v-if="path !== '/tabs/login'" />
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, computed } from "vue";
import state from "./composables/state.js";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { Storage } from "@capacitor/storage";

import MenuContainer from "./components/MenuContainer.vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    MenuContainer,
  },
  setup() {
    const { user, isLoggedIn } = state;

    const router = useRouter();
    const path = computed(() => router.currentRoute.value.path);

    onMounted(async () => {
      //make sure the user is logged in
      await Storage.get({ key: "user" }).then(({ value }) => {
        if (value && !isLoggedIn.value) {
          user.value = JSON.parse(value);
          isLoggedIn.value = true;
          if (path.value === "/tabs/login") {
            router.push("/tabs/chat");
          }
        } else {
          if (path.value !== "/tabs/login") {
            router.push("/tabs/login");
          }
        }
      });
    });

    return { user, isLoggedIn, path };
  },
});
</script>