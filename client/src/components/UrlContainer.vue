<template>
  <div class="container flex w-full justify-center">
    <div class="flex flex-col w-11/12 justify-center">
      <div v-if="!articleData.summary">
        <ion-input
          v-model="url"
          clear-input
          class="mt-10 ml-0 w-full"
          style="
            --background: white;
            --color: #000;
            border-radius: 10px;
            --padding-start: 5px;
          "
          placeholder="Enter URL"
        ></ion-input>
        <ion-button class="w-full ml-0" @click="getSummary">
          Summarize
        </ion-button>
      </div>
      <div v-if="articleData.title">
        <h1 class="text-2xl font-bold mt-2 mb-2">{{ articleData.title }}</h1>
      </div>
      <div v-if="articleData.summary" class="flex flex-col w-full mt-4">
        <ion-button color="warning" class="w-full ml-0" @click="resetArticle">
          Reset
        </ion-button>
        <div class="flex flex-row w-full">
          <ion-button
            @click="changeView('summary')"
            class="w-1/2"
            :class="{ 'active-tab': currentView.summary }"
            >Summary</ion-button
          >
          <ion-button
            @click="getNotes"
            v-if="articleData.notes <= 0"
            class="w-1/2"
            >Create Notes</ion-button
          >
          <ion-button
            @click="changeView('notes')"
            v-else
            class="w-1/2"
            :class="{ 'active-tab': currentView.notes }"
            >Notes</ion-button
          >
        </div>
      </div>
      <div v-if="articleData.summary">
        <div v-if="currentView.summary" class="pb-4">
          <div class="flex items-center justify-between">
            <h4>Summary</h4>
            <ion-button
              v-if="!selectedDocument.title"
              @click="modalIsOpen = !modalIsOpen"
              color="medium"
              class="w-2/3 h-7"
              >Select Document</ion-button
            >
            <ion-button
              v-else
              @click="modalIsOpen = !modalIsOpen"
              color="medium"
              class="w-2/3 h-7"
              >{{ selectedDocument.title }}</ion-button
            >
          </div>
          <p>{{ articleData.summary }}</p>

          <ion-button
            color="success"
            class="w-full mt-5"
            v-if="selectedDocument._id && selectedDocument.title"
            @click="appendSummaryToDoc"
            >Add Summary To Document</ion-button
          >
        </div>
        <div v-if="currentView.notes">
          <div class="flex items-center justify-between">
            <h4 v-if="articleData.notes">Notes</h4>
            <ion-button
              v-if="!selectedDocument.title"
              @click="modalIsOpen = !modalIsOpen"
              color="medium"
              class="w-2/3 h-7"
              >Select Document</ion-button
            >
            <ion-button
              v-else
              @click="modalIsOpen = !modalIsOpen"
              color="medium"
              class="w-2/3 h-7"
              >{{ selectedDocument.title }}</ion-button
            >
          </div>
          <div v-for="note in articleData.notes" :key="note">
            <div
              class="flex border-b border-gray-300 pt-2 pb-2"
              :class="{
                'bg-gray-200': selectedDocument.content.includes(note),
              }"
              @click="
                if (selectedDocument.title) {
                  toggleSelectNotes(note);
                }
              "
            >
              <p>{{ note }}</p>
            </div>
          </div>
          <div>
            <ion-button
              color="success"
              class="w-full mt-5"
              v-if="
                selectedDocument._id &&
                selectedDocument.title &&
                selectedDocument.content.length > 0
              "
              @click="appendNotesToDoc()"
              >Append Notes To Document</ion-button
            >
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
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
import ezapi from "../composables/ezapi";
import state from "../composables/state";
import Notes from "../composables/Notes";
import { useRouter } from "vue-router";
import { Storage } from "@capacitor/storage";

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
  setup() {
    const {
      getUrlSummary,
      getUrlNotes,
      createDocument,
      getDocuments,
      createFolder,
      getFolders,
    } = ezapi;
    const { addNotesToDoc, addSummaryToDoc } = Notes;

    const url = ref<string>("");
    const modalIsOpen = ref(false);
    const { user, docToEdit } = state;
    const Router = useRouter();
    const quickAdd = ref({
      folder: false,
      newFolderTitle: "",
      document: false,
      newDocumentTitle: "",
    });

    interface article {
      summary?: string | undefined | null;
      notes?: string[] | undefined | null;
      title?: string | undefined | null;
    }

    interface view {
      summary: boolean;
      notes: boolean;
    }

    //Store all data for the current article
    const articleData = ref<article>({
      summary: "",
      notes: [],
      title: "",
    });

    //Keep track of the current view
    const currentView = ref<view>({
      summary: false,
      notes: false,
    });

    //Get a summary for the URL
    async function getSummary() {
      const article = await getUrlSummary(url.value);
      console.log("SUMMARY: ", article);
      if (article != null) {
        articleData.value.summary = article.summary;
        articleData.value.title = article.title;
        currentView.value.summary = true;
      } else {
        articleData.value.summary = "Problem getting article summary";
      }
    }

    //Get a list of notes from the server
    async function getNotes() {
      const article = await getUrlNotes(url.value);

      if (article != null) {
        console.log(article);
        articleData.value.notes = article.notes;
        currentView.value.summary = false;
        currentView.value.notes = true;
        if (articleData.value.title == "") {
          articleData.value.title = article.title;
        }
      } else {
        articleData.value.notes = ["Problem getting article notes"];
      }
    }

    //Change the current view
    function changeView(view: string) {
      if (view == "notes") {
        currentView.value.notes = true;
        currentView.value.summary = false;
      } else if (view == "summary") {
        currentView.value.notes = false;
        currentView.value.summary = true;
      }
    }

    //Reset all the article data and allow user to enter a new URL
    function resetArticle() {
      articleData.value.summary = "";
      articleData.value.notes = [];
      articleData.value.title = "";
      currentView.value.summary = false;
      currentView.value.notes = false;

      selectedDocument.value = {
        _id: "",
        title: "",
        content: [],
        index: -1,
        folderId: "",
      };
    }

    //Store the current folder ID while selecting a document
    const folderToView = ref<string>("");
    const viewFiles = ref(false);

    interface SelectedDoc {
      _id: string;
      title: string;
      content: any[];
      index: number;
      folderId: string;
    }

    //Store data about the selected document
    const selectedDocument = ref<SelectedDoc>({
      _id: "",
      title: "",
      content: [],
      index: -1,
      folderId: "",
    });

    function selectDocument(id: string, title: string, index: number) {
      selectedDocument.value._id = id;
      selectedDocument.value.title = title;
      selectedDocument.value.content = [];
      selectedDocument.value.index = index;
      selectedDocument.value.folderId = folderToView.value;
      viewFiles.value = false;
      folderToView.value = "";
      modalIsOpen.value = false;
    }

    function pushNote(noteText: string) {
      selectedDocument.value.content.push(noteText);
    }

    function removeNote(noteText: string) {
      selectedDocument.value.content.splice(
        selectedDocument.value.content.indexOf(noteText),
        1
      );
    }

    function toggleSelectNotes(noteText: string) {
      if (selectedDocument.value.content.includes(noteText)) {
        removeNote(noteText);
      } else {
        pushNote(noteText);
      }
    }

    async function appendNotesToDoc() {
      if (!selectedDocument.value.index && !selectedDocument.value.title) {
        return;
      }

      await addNotesToDoc(selectedDocument)
        .then(() => {
          Router.push(`/tabs/note/${selectedDocument.value._id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    async function appendSummaryToDoc() {
      if (
        !selectedDocument.value.index &&
        !selectedDocument.value.title &&
        !articleData.value.summary
      ) {
        return;
      }

      await addSummaryToDoc(selectedDocument, articleData)
        .then(() => {
          Router.push(`/tabs/note/${selectedDocument.value._id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }

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

    onMounted(() => {
      docToEdit.value = {
        _id: "",
        title: "",
        content: "",
        folderId: "",
        index: -1,
      };
    });

    return {
      getSummary,
      url,
      currentView,
      articleData,
      getNotes,
      changeView,
      resetArticle,
      modalIsOpen,
      folder,
      document,
      user,
      viewFiles,
      folderToView,
      selectedDocument,
      selectDocument,
      toggleSelectNotes,
      appendNotesToDoc,
      appendSummaryToDoc,
      quickAdd,
      newDocument,
      newFolder,
    };
  },
});
</script>

<style>
.active-tab {
  opacity: 0.65;
}
</style>