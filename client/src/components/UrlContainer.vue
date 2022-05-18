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
        ></ion-input>
        <ion-button class="w-full ml-0" @click="getSummary">
          Scrape link
        </ion-button>
      </div>
      <div v-if="articleData.summary" class="flex flex-row w-full mt-4">
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
      <div v-if="articleData.summary">
        <div v-if="currentView.summary" class="pt-4 pb-4">
          <p>{{ articleData.summary }}</p>
        </div>
        <div v-if="currentView.notes">
          <div v-for="note in articleData.notes" :key="note">
            <div class="flex border-b border-gray-700 pt-2 pb-2">
              <p>{{ note }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { IonInput, IonButton } from "@ionic/vue";
import ezapi from "../composables/ezapi";
//import { camera, document } from "ionicons/icons";
export default defineComponent({
  components: {
    IonInput,
    IonButton,
  },
  setup() {
    const { getUrlSummary, getUrlNotes } = ezapi;
    const url = ref<string>("");

    interface article {
      summary: string;
      notes: string[];
    }

    interface view {
      summary: boolean;
      notes: boolean;
    }

    const articleData = ref<article>({
      summary: "",
      notes: [],
    });

    const currentView = ref<view>({
      summary: false,
      notes: false,
    });

    async function getSummary() {
      const encodedUrl = encodeURIComponent(url.value);
      const summary = await getUrlSummary(encodedUrl);

      if (summary != null) {
        articleData.value.summary = summary;
        currentView.value.summary = true;
      } else {
        articleData.value.summary = "Problem getting article summary";
      }
    }

    async function getNotes() {
      const encodedUrl = encodeURIComponent(url.value);
      const notes = await getUrlNotes(encodedUrl);

      if (notes != null) {
        console.log(notes);
        articleData.value.notes = notes;
        currentView.value.summary = false;
        currentView.value.notes = true;
      } else {
        articleData.value.notes = ["Problem getting article notes"];
      }
    }

    function changeView(view: string) {
      if (view == "notes") {
        currentView.value.notes = true;
        currentView.value.summary = false;
      } else if (view == "summary") {
        currentView.value.notes = false;
        currentView.value.summary = true;
      }
    }
    return { getSummary, url, currentView, articleData, getNotes, changeView };
  },
});
</script>

<style>
.active-tab {
  opacity: 0.65;
}
</style>