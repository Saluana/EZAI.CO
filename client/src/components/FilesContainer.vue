<template>
  <div id="container">
    <ion-list>
      <ion-item-sliding
        v-for="fldr in user.folders"
        :key="fldr._id"
        class="m-0"
      >
        <ion-item-options side="end">
          <ion-item-option
            color="warning"
            @click="
              setModal(true);
              currentlyEditing = fldr._id;
            "
            >Edit</ion-item-option
          >
          <ion-item-option color="danger" @click="removeFolder(fldr._id)"
            >Remove</ion-item-option
          >
        </ion-item-options>

        <ion-item>
          <ion-icon
            class="w-12 h-12 mr-3 opacity-70"
            color="primary"
            :icon="folder"
          />
          <ion-label class="pt-2 mt-2 pb-2 mb-2">{{ fldr.title }}</ion-label>
        </ion-item>
      </ion-item-sliding>
    </ion-list>

    <ion-modal :is-open="modalIsOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>Create Folder</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="setModal(false)">Close</ion-button>
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
            <ion-button class="w-full ml-0 mt-3" @click="changeFolder">
              Save
            </ion-button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  IonList,
  IonLabel,
  IonItem,
  IonIcon,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonModal,
  IonInput,
} from "@ionic/vue";
import { folder } from "ionicons/icons";
import ezapi from "../composables/ezapi";
import state from "../composables/state";

export default defineComponent({
  name: "FilesContainer",
  components: {
    IonList,
    IonLabel,
    IonIcon,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonModal,
    IonInput,
  },
  setup() {
    const { getFolders, deleteFolder, editFolder } = ezapi;
    const { user } = state;

    const modalIsOpen = ref(false);
    const currentlyEditing = ref("");
    const newFolderTitle = ref("");

    function setModal(bool: any) {
      if (bool) {
        modalIsOpen.value = true;
      } else if (bool === false) {
        modalIsOpen.value = false;
      }
    }

    async function removeFolder(folderId: string) {
      await deleteFolder(folderId);
      user.value.folders = await getFolders();
    }

    async function changeFolder() {
      await editFolder(currentlyEditing.value, newFolderTitle.value);
      user.value.folders = await getFolders();
      currentlyEditing.value = "";
      setModal(false);
    }

    onMounted(async () => {
      user.value.folders = await getFolders();
    });

    return {
      folder,
      user,
      removeFolder,
      modalIsOpen,
      setModal,
      currentlyEditing,
      newFolderTitle,
      changeFolder,
    };
  },
});
</script>

<style scoped>
</style>
