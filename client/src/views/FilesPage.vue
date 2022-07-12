<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="setModal(true)">
            <ion-icon
              class="w-9 h-9 mr-3 opacity-70"
              color="primary"
              :icon="addCircle"
          /></ion-button>
        </ion-buttons>
        <ion-title>Documents</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item-sliding v-for="doc in documents" :key="doc._id" class="m-0">
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="removeDocument(doc._id)"
              >Remove</ion-item-option
            >
          </ion-item-options>

          <ion-item @click="editDocument(doc._id, doc.title, doc.content)">
            <ion-icon
              class="w-12 h-12 mr-3 opacity-70"
              color="primary"
              :icon="document"
            />
            <ion-label class="pt-2 mt-2 pb-2 mb-2">{{ doc.title }}</ion-label>
          </ion-item>
        </ion-item-sliding>
      </ion-list>

      <ion-modal :is-open="modalIsOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title>Create Document</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setModal(false)">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="container flex w-full justify-center">
            <div class="flex flex-col w-11/12 justify-center">
              <ion-input
                v-model="newDocumentTitle"
                clear-input
                class="mt-6 ml-0 w-full"
                style="
                  --background: white;
                  --color: #000;
                  border-radius: 10px;
                  --padding-start: 5px;
                "
                placeholder="Enter Document Name"
              ></ion-input>
              <ion-button class="w-full ml-0 mt-3" @click="newDocument">
                Save
              </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import ezapi from "../composables/ezapi";
import state from "../composables/state";
import { useRoute, useRouter } from "vue-router";
import { defineComponent, onMounted, ref } from "vue";
import { document, addCircle } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonItemOptions,
  IonItemOption,
  IonItemSliding,
  IonButton,
  IonModal,
  IonInput,
  //IonIcon,
} from "@ionic/vue";

export default defineComponent({
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonItemOptions,
    IonItemOption,
    IonItemSliding,
    IonButton,
    IonModal,
    IonInput,
    //IonIcon,
  },
  setup() {
    const { getDocuments, deleteDocument, createDocument } = ezapi;
    const route = useRoute();
    const router = useRouter();
    const { docToEdit } = state;

    const modalIsOpen = ref(false);
    const newDocumentTitle = ref("");

    function setModal(bool: any) {
      if (bool) {
        modalIsOpen.value = true;
      } else if (bool === false) {
        modalIsOpen.value = false;
      }
    }

    const documents = ref([]);

    onMounted(async () => {
      documents.value = await getDocuments(route.params.id);
      console.log(documents.value);
    });

    async function removeDocument(fileId: string) {
      const response = await deleteDocument(fileId);
      if (response) {
        documents.value = await getDocuments(route.params.id);
      }
    }

    async function newDocument() {
      if (!newDocumentTitle.value) {
        return;
      }

      const response = await createDocument(
        newDocumentTitle.value,
        route.params.id,
        ""
      );
      if (response) {
        documents.value = await getDocuments(route.params.id);
        newDocumentTitle.value = "";
        setModal(false);
      }
    }

    function editDocument(_id: string, title: string, content: string) {
      if (_id && title && content) {
        docToEdit.value = {
          _id,
          title,
          content,
        };
        router.push(`/tabs/note/${_id}`);
      } else {
        return;
      }
    }

    return {
      documents,
      document,
      addCircle,
      removeDocument,
      setModal,
      modalIsOpen,
      newDocumentTitle,
      newDocument,
      editDocument,
    };
  },
});
</script>
