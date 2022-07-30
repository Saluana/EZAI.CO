<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button v-if="!editModeOn"></ion-back-button>
          <ion-button v-else @click="toggleEditMode"> Cancel </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button v-if="!editModeOn" @click="toggleEditMode">
            Edit
          </ion-button>
          <ion-button @click="saveDocChanges" v-else> Save </ion-button>
        </ion-buttons>

        <ion-title>Note</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" v-if="!editModeOn">
      <div v-html="rawHTML" v-if="!editModeOn" class="px-4 py-4"></div>
    </ion-content>
    <ion-content :fullscreen="true" v-else>
      <richTextEditor
        :toolBarConfig="toolBarConfig"
        placeHolder="Write a text"
        v-model="rawHTML"
        theme="snow"
        v-if="editModeOn"
      ></richTextEditor>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from "vue";
import ezapi from "../composables/ezapi";
import state from "../composables/state";
import { Storage } from "@capacitor/storage";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
} from "@ionic/vue";

export default defineComponent({
  name: "Tab1Page",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonButtons,
    IonBackButton,
  },
  setup() {
    const { docToEdit, user } = state;
    const { editDocument } = ezapi;

    const rawHTML = ref(docToEdit.value.content ? docToEdit.value.content : "");
    const editModeOn = ref(false);

    const toggleEditMode = () => {
      editModeOn.value = !editModeOn.value;
    };

    async function saveDocChanges() {
      const newDoc = await editDocument(
        docToEdit.value._id,
        docToEdit.value.title,
        rawHTML.value
      );

      console.log(newDoc);

      if (newDoc) {
        user.value.documents[docToEdit.value.folderId as string][
          docToEdit.value.index as number
        ].content = rawHTML;
        await Storage.set({
          key: `docs`,
          value: JSON.stringify(user.value.documents),
        });
        editModeOn.value = false;
      }
    }

    const toolBarConfig = [
      [{ header: [1, 2, 3, false] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      ["clean"],
    ];

    onUnmounted(() => {
      docToEdit.value = {
        _id: "",
        title: "",
        content: "",
        folderId: "",
        index: 0,
      };
    });

    return {
      toolBarConfig,
      rawHTML,
      editModeOn,
      toggleEditMode,
      saveDocChanges,
    };
  },
});
</script>

<style scoped>
#container {
  display: flex;
  align-items: center;
  justify-content: center;
}

#form {
  width: 90%;
  margin-top: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.login-input {
  width: 100%;
  --background: white;
  --color: black;
  --padding-start: 5px;
  --padding-end: 3px;
  border: 1px solid lightgrey;
  border-radius: 8px;
  margin-bottom: 16px;
}

.form-btn {
  width: 100%;
  margin-bottom: 8px;
  --border-radius: 8px;
}

.google-icon {
  margin-left: 40%;
}

.login-image {
  height: 180px;
  width: 180px;
  margin-bottom: 30px;
  margin-top: 30px;
}
</style>
