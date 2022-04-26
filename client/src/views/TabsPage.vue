<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <div v-if="isLoggedIn">
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="chat" href="/tabs/chat">
            <ion-icon :icon="chatbubbles" />
            <ion-label>Chat</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="write" href="/tabs/write">
            <ion-icon :icon="create" />
            <ion-label>Write</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="profile" href="/tabs/profile">
            <ion-icon :icon="person" />
            <ion-label>Profile</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="settings" @click="toggleMenu">
            <ion-icon :icon="menu" />
            <ion-label>Menu</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </div>
    </ion-tabs>
  </ion-page>
</template>

<script>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { menu, square, person, chatbubbles, create } from "ionicons/icons";
// eslint-disable-next-line
import { onMounted, watchEffect } from "vue";
import state from "../composables/state.js";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";

export default {
  components: {
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
  },
  setup() {
    const { user, isLoggedIn, toggleMenu } = state;
    const router = useRouter();

    onMounted(async () => {
      //make sure the user is logged in
      await Storage.get({ key: "user" }).then(({ value }) => {
        if (value && !isLoggedIn.value) {
          user.value = JSON.parse(value);
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
        }
      });
    });

    watchEffect(() => {
      if (
        router.currentRoute.value.path === "/tabs/login" &&
        isLoggedIn.value
      ) {
        router.replace("/tabs/chat");
      } else if (
        router.currentRoute.value.path !== "/tabs/login" &&
        !isLoggedIn.value
      ) {
        router.replace("/tabs/login");
      }
    });

    return {
      menu,
      square,
      person,
      user,
      chatbubbles,
      create,
      toggleMenu,
      isLoggedIn,
    };
  },
};
</script>