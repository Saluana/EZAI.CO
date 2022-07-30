<template>
  <ion-app>
    <MenuContainer v-if="path !== '/tabs/login'" />
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import { watchEffect, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import state from "./composables/state";
import MenuContainer from "./components/MenuContainer.vue";
import { Storage } from "@capacitor/storage";
import ezapi from "./composables/ezapi";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    MenuContainer,
  },
  setup() {
    const { isLoggedIn, user } = state;
    const { getFolders, getAllDocuments } = ezapi;

    const router = useRouter();
    const hasLoadedOnce = ref(false);

    onMounted(async () => {
      const userData = await Storage.get({ key: "userData" });
      user.value = JSON.parse(userData.value!);
    });

    watchEffect(async () => {
      if (router.currentRoute.value.path === "/login" && isLoggedIn.value) {
        console.log("Router replace tab1");
        router.replace("/tabs/scan");
      } else if (
        router.currentRoute.value.path !== "/login" &&
        !isLoggedIn.value
      ) {
        console.log("router replace login");
        router.replace("/login");
      }
      //If user is logged in get all of their data from storage
      if (isLoggedIn.value && !hasLoadedOnce.value) {
        const folders = await getFolders();
        const documents = await getAllDocuments();
        const storedUser = await Storage.get({ key: "user" });
        user.value = JSON.parse(storedUser.value!);
        user.value.folders = folders;
        let userDocs = {};

        folders.forEach((fol) => {
          userDocs[fol._id] = documents.filter((doc) => doc.folder === fol._id);
        });

        user.value.documents = userDocs;
        console.log(user.value);

        console.log(user.value);
        Storage.set({ key: "userData", value: JSON.stringify(user.value) });
        hasLoadedOnce.value = true;
      }
    });
  },
});
</script>