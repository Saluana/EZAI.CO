<template>
  <ion-app>
    <MenuContainer />
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent, watchEffect, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import state from "./composables/state.js";
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
    const { user, updateUser } = state;
    const router = useRouter();
    const userChecked = ref(false);

    onMounted(async () => {
      const idToken = await Storage.get({ key: "token" });

      if (idToken.value) {
        await updateUser(true);
        console.log(user.value);
        userChecked.value = true;
      } else {
        user.value.isLoggedIn = false;
        userChecked.value = true;
      }
    });

    watchEffect(() => {
      //get current router location
      const path = ref(router.currentRoute.value.path);
      if (
        user.value.isLoggedIn &&
        path.value === "/tabs/login" &&
        userChecked.value
      ) {
        router.push("/tabs/chat");
      } else if (
        !user.value.isLoggedIn &&
        path.value !== "/tabs/login" &&
        userChecked.value
      ) {
        router.push("/tabs/login");
      }
    });
    return { user };
  },
});
</script>