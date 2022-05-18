<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="scan" href="/tabs/scan">
          <ion-icon :icon="scanCircle" />
          <ion-label>Scan</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="extract" href="/tabs/extract">
          <ion-icon :icon="linkOutline" />
          <ion-label>Extract</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="folder" href="/tabs/folder">
          <ion-icon :icon="folder" />
          <ion-label>Folder</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" @click="toggleMenu">
          <ion-icon :icon="menu" />
          <ion-label>Menu</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { linkOutline, menu, folder, scanCircle } from "ionicons/icons";
import state from "@/composables/state";

export default defineComponent({
  name: "TabsPage",
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
    const { toggleMenu } = state;

    return {
      scanCircle,
      menu,
      folder,
      linkOutline,
      toggleMenu,
    };
  },
});
</script>
