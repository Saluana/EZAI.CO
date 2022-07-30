<template>
  <ion-modal :is-open="modalIsOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Select Document</ion-title>
        <ion-buttons slot="start">
          <ion-button
            v-if="!viewFiles && !quickAdd.folder && !quickAdd.document"
            @click="modalIsOpen = !modalIsOpen"
            >Cancel</ion-button
          >
          <ion-button
            v-else-if="viewFiles && !quickAdd.folder && !quickAdd.document"
            @click="viewFiles = !viewFiles"
            >Back</ion-button
          >
          <ion-button
            v-else-if="quickAdd.folder || quickAdd.document"
            @click="
              quickAdd.folder = false;
              quickAdd.document = false;
            "
            >Back</ion-button
          >
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button
            v-if="!viewFiles && !quickAdd.folder && !quickAdd.document"
            @click="quickAdd.folder = true"
            >Add Folder</ion-button
          >
          <ion-button
            v-else-if="viewFiles && !quickAdd.folder && !quickAdd.document"
            @click="quickAdd.document = true"
            >Add Note</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar v-if="!quickAdd.folder && !quickAdd.document">
        <ion-searchbar class="mt-2"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="!quickAdd.document && !quickAdd.folder">
        <ion-list v-if="!viewFiles">
          <ion-item
            v-for="fldrs in user.folders"
            :key="fldrs"
            @click="
              viewFiles = !viewFiles;
              folderToView = fldrs._id;
            "
          >
            <ion-icon
              class="w-10 h-10 mr-3 opacity-70"
              color="primary"
              :icon="folder"
            />
            <ion-label>
              {{ fldrs.title }}
            </ion-label>
          </ion-item>
        </ion-list>
        <ion-list v-if="viewFiles">
          <ion-item
            v-for="(doc, index) in user.documents[folderToView]"
            :key="doc"
            @click="selectDocument(doc._id, doc.title, index)"
          >
            <ion-icon
              class="w-10 h-10 mr-3 opacity-70"
              color="primary"
              :icon="document"
            />
            <ion-label>
              {{ doc.title }}
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
      <div v-else>
        <div v-if="quickAdd.folder" class="mt-3">
          <ion-input
            placeholder="Enter Folder Name"
            v-model="quickAdd.newFolderTitle"
            class="ml-1 mr-1"
          ></ion-input>
          <ion-button class="w-full mt-3" color="success" @click="newFolder"
            >Create Folder</ion-button
          >
        </div>
        <div v-if="quickAdd.document" class="mt-3">
          <ion-input
            placeholder="Enter Document Name"
            v-model="quickAdd.newDocumentTitle"
            class="ml-1 mr-1"
          ></ion-input>
          <ion-button class="w-full mt-3" color="success" @click="newDocument"
            >Create Document</ion-button
          >
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import state from "../composables/state";
import ezapi from "../composables/ezapi";
import { Storage } from "@capacitor/storage";
import { folder, document } from "ionicons/icons";
import {
  IonInput,
  IonButton,
  IonModal,
  IonSearchbar,
  IonToolbar,
  IonTitle,
  IonContent,
  IonHeader,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/vue";

export default defineComponent({
  components: {
    IonInput,
    IonButton,
    IonModal,
    IonSearchbar,
    IonToolbar,
    IonTitle,
    IonContent,
    IonHeader,
    IonButtons,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  },
  name: "selectdocContainer",
  setup(props) {
    const { user, docToEdit } = state;
    const { createDocument, createFolder, getDocuments, getFolders } = ezapi;

    const quickAdd = ref({
      folder: false,
      newFolderTitle: "",
      document: false,
      newDocumentTitle: "",
    });

    const folderToView = ref<string>("");
    const viewFiles = ref(false);

    async function newDocument() {
      if (!quickAdd.value.newDocumentTitle) {
        return;
      }

      const response = await createDocument(
        quickAdd.value.newDocumentTitle,
        folderToView.value,
        ""
      );
      if (response) {
        user.value.documents[folderToView.value] = await getDocuments(
          folderToView.value
        );
        await Storage.set({
          key: `userData`,
          value: JSON.stringify(user.value),
        });
        quickAdd.value.newDocumentTitle = "";
        quickAdd.value.document = false;
      }
    }

    async function newFolder() {
      let response: any;
      if (quickAdd.value.newFolderTitle.length > 0) {
        response = await createFolder(quickAdd.value.newFolderTitle);
      }
      if (response !== null) {
        console.log(response);
      } else {
        console.log(response);
      }
      await Storage.set({
        key: `userData`,
        value: JSON.stringify(user.value),
      });

      quickAdd.value.folder = false;
      quickAdd.value.newFolderTitle = "";
      user.value.folders = await getFolders();
    }

    return { folder, document, newDocument, newFolder };
  },
});
</script>

<style scoped>
</style>
