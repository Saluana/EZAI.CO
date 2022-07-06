<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Folders</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large" slot="secondary">Folders</ion-title>
          <ion-buttons class="pb-3 pr-3" slot="primary">
            <ion-button expand="block" @click="setOpen(true)">
              <ion-icon
                class="w-10 h-10 mr-3 opacity-70"
                color="primary"
                :icon="addCircle"
              />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-modal :is-open="isOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title>Create Folder</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="container flex w-full justify-center">
            <div class="flex flex-col w-11/12 justify-center">
              <ion-input
                v-model="newFolderTitle"
                clear-input
                class="mt-6 ml-0 w-full"
                style="
                  --background: white;
                  --color: #000;
                  border-radius: 10px;
                  --padding-start: 5px;
                "
                placeholder="Enter Folder Name"
              ></ion-input>
              <ion-button class="w-full ml-0 mt-3" @click="saveNewFolder">
                Save
              </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>

      <FoldersContainer />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
} from "@ionic/vue";
import { addCircle } from "ionicons/icons";
import FoldersContainer from "../components/FoldersContainer.vue";
import ezapi from "../composables/ezapi";
import state from "../composables/state";

export default defineComponent({
  name: "Tab3Page",
  components: {
    FoldersContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
    IonInput,
  },
  setup() {
    const { createFolder, getFolders } = ezapi;
    const { user } = state;

    const newFolderTitle = ref("");

    async function saveNewFolder() {
      let response: any;
      if (newFolderTitle.value.length > 0) {
        response = await createFolder(newFolderTitle.value);
      }
      if (response !== null) {
        console.log(response);
      } else {
        console.log(response);
      }
      isOpen.value = false;
      newFolderTitle.value = "";
      user.value.folders = await getFolders();
    }

    function setOpen(bool: any) {
      if (bool) {
        isOpen.value = true;
      } else if (bool === false) {
        isOpen.value = false;
      }
    }

    const isOpen = ref(false);

    return {
      addCircle,
      createFolder,
      isOpen,
      setOpen,
      newFolderTitle,
      saveNewFolder,
    };
  },
});
</script>
