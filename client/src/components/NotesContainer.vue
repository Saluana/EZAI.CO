<template>
  <div id="container" class="flex flex-col items-center">
    <div class="w-11/12 h-auto" v-if="photo.base64String">
      <img :src="photo.uri" />
    </div>
    <div
      v-if="photo.uri && !photoText"
      class="flex items-center w-11/12 h-auto mt-1"
    >
      <ion-button
        @click="async () => await getImageText()"
        class="w-9/12 h-auto"
        expand="block"
      >
        <div class="flex flex-row items-center pt-1 pb-1">
          <ion-icon class="w-8 h-8 mr-1" :icon="document" />
          <p class="antialiased text-lg">Render Text</p>
        </div>
      </ion-button>
      <ion-button
        @click="resetPhoto"
        class="w-3/12 h-auto"
        expand="block"
        color="danger"
      >
        <div class="flex flex-row items-center pt-1 pb-1">
          <ion-icon class="w-8 h-8 mr-1" :icon="closeCircleOutline" />
        </div>
      </ion-button>
    </div>
    <div v-if="photoText" class="flex flex-col w-11/12 mt-2">
      <div class="flex flex-row w-full">
        <ion-button
          class="w-1/3"
          :class="{ 'active-tab': currentView.text }"
          @click="changeView('text')"
        >
          Text
        </ion-button>
        <ion-button v-if="!notes" class="w-1/3" @click="getNotes">
          Create Notes
        </ion-button>
        <ion-button
          v-else
          class="w-1/3"
          :class="{ 'active-tab': currentView.notes }"
          @click="changeView('notes')"
        >
          Notes
        </ion-button>
        <ion-button v-if="!summary" class="w-1/3" @click="getSummary">
          Summarize
        </ion-button>
        <ion-button
          v-else
          class="w-1/3"
          :class="{ 'active-tab': currentView.summary }"
          @click="changeView('summary')"
        >
          Summary
        </ion-button>
      </div>
      <ion-button class="w-full" @click="resetPhoto">Reset</ion-button>
      <div v-if="currentView.text">
        <h4>Text</h4>
        <div class="flex flex-col items-center">
          <p v-if="photoText" v-html="photoText" class="mt-2 mb-2"></p>
          <ezai-spinner v-else />
        </div>
      </div>
      <div v-if="currentView.notes">
        <h4>Notes</h4>
        <div class="flex flex-col items-center">
          <div v-if="notes">
            <div v-for="note in notes" :key="note">
              <div class="flex border-b border-gray-300 pt-2 pb-2">
                <p>{{ note }}</p>
              </div>
            </div>
          </div>
          <ezai-spinner v-else />
        </div>
      </div>
      <div v-if="currentView.summary">
        <h4>Summary</h4>
        <div class="flex flex-col items-center">
          <p v-if="summary" v-html="summary" class="mt-2 mb-2"></p>
          <ezai-spinner v-else />
        </div>
      </div>
    </div>
    <div id="image-button" v-if="!photo.uri" class="w-11/12 flex items-center">
      <ion-button @click="getImage" class="w-full h-auto mt-12" expand="block">
        <div class="flex flex-col items-center pt-1 pb-1">
          <ion-icon class="w-10 h-10" :icon="camera" />
          <p class="antialiased text-lg">Scan Document</p>
        </div>
      </ion-button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { createWorker, PSM, OEM } from "tesseract.js";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import ezapi from "../composables/ezapi";
import { IonButton, IonIcon } from "@ionic/vue";
import { camera, document, closeCircleOutline } from "ionicons/icons";
import EzaiSpinner from "./animations/EzaiSpinner.vue";
const worker = createWorker({
  logger: (m) => console.log(m),
});
export default {
  components: { IonButton, IonIcon, EzaiSpinner },
  setup() {
    const { correctGrammar, createNotes, summarizeText, scanImage } = ezapi;
    const photo = ref({
      uri: "",
      base64String: "",
      blob: "",
    });
    const photoText = ref(null);
    const notes = ref(null);
    const summary = ref(null);
    const currentView = ref({
      text: true,
      notes: false,
      summary: false,
    });

    function resetPhoto() {
      photo.value = {
        uri: "",
        base64String: "",
        blob: "",
      };
      photoText.value = null;
      notes.value = null;
      summary.value = null;
    }

    //Parse the incoming response from openAPI
    function parseText(text) {
      //Replace new line with <br>
      text = text.replace(/\n/g, "<br>");

      while (text.startsWith("<br>") || text.endsWith("<br>")) {
        if (text.startsWith("<br>")) {
          text = text.replace("<br>", "");
        }
        if (text.endsWith("<br>")) {
          text = text.replace("<br>", "");
        }
      }
      return text;
    }

    //Take or upload a photo
    async function getImage() {
      if (Capacitor.isNativePlatform()) {
        await Camera.checkPermissions().then(async (result) => {
          if (result.camera != "granted") {
            await Camera.requestPermissions().then((res) => {
              if (res.camera != "granted") {
                alert("Camera permission denied");
                return;
              }
            });
          }
        });
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
      });

      console.log(image);

      //convert base64 image to uri
      const uri = `data:image/jpeg;base64,${image.base64String}`;

      //get blob from uri
      const blob = await fetch(uri).then((res) => res.blob());
      console.log(blob);

      photo.value.base64String = image.base64String;
      photo.value.uri = uri;
      photo.value.blob = blob;
    }

    //Extract text from the image and send it to be corrected
    async function getText(image) {
      const img = image;
      console.log(img);
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng", OEM.LSTM_ONLY);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      const {
        data: { text },
      } = await worker.recognize(img);
      console.log(text);

      correctGrammar(text).then((result) => {
        if (result) {
          console.log("result", result);

          photoText.value = parseText(result);
        } else {
          photoText.value = "No text found";
        }
      });
    }

    async function getNotes() {
      if (photoText.value) {
        changeView("notes");
        let generatedNotes = await createNotes(photoText.value);
        console.log("NOTES: ", generatedNotes);
        notes.value = generatedNotes;
      }
    }

    async function getSummary() {
      if (photoText.value) {
        changeView("summary");
        let generatedSummary = await summarizeText(photoText.value);
        summary.value = parseText(generatedSummary);
      }
    }

    function changeView(view) {
      if (view == "text") {
        currentView.value.text = true;
        currentView.value.notes = false;
        currentView.value.summary = false;
      } else if (view == "notes") {
        currentView.value.text = false;
        currentView.value.notes = true;
        currentView.value.summary = false;
      } else if (view == "summary") {
        currentView.value.text = false;
        currentView.value.notes = false;
        currentView.value.summary = true;
      }
    }

    async function getImageText() {
      let imgText = await scanImage(photo.value.blob);
      console.log("FIRST", imgText);
      if (imgText) {
        let correctedText = await correctGrammar(imgText);
        console.log("CORRECTED", correctedText);
        if (correctedText) {
          photoText.value = parseText(correctedText);
        } else {
          photoText.value = "No text found";
        }
      }
    }

    return {
      getImage,
      getText,
      photo,
      photoText,
      camera,
      document,
      closeCircleOutline,
      getNotes,
      getSummary,
      notes,
      summary,
      currentView,
      changeView,
      scanImage,
      getImageText,
      resetPhoto,
    };
  },
};
</script>

<style>
button {
  width: 100px;
  height: 40px;
}
.active-tab {
  opacity: 0.65;
}
</style>