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
          <h4>Summary</h4>
          <p>{{ articleData.summary }}</p>
        </div>
        <div v-if="currentView.notes">
          <h4 v-if="articleData.notes">Notes</h4>
          <div v-for="note in articleData.notes" :key="note">
            <div class="flex border-b border-gray-300 pt-2 pb-2">
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
      summary?: string | undefined | null;
      notes?: string[] | undefined | null;
      title?: string | undefined | null;
    }

    interface view {
      summary: boolean;
      notes: boolean;
    }

    const articleData = ref<article>({
      summary: "",
      notes: [],
      title: "",
    });

    const currentView = ref<view>({
      summary: false,
      notes: false,
    });

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

    function changeView(view: string) {
      if (view == "notes") {
        currentView.value.notes = true;
        currentView.value.summary = false;
      } else if (view == "summary") {
        currentView.value.notes = false;
        currentView.value.summary = true;
      }
    }

    function resetArticle() {
      articleData.value.summary = "";
      articleData.value.notes = [];
      articleData.value.title = "";
      currentView.value.summary = false;
      currentView.value.notes = false;
    }
    return {
      getSummary,
      url,
      currentView,
      articleData,
      getNotes,
      changeView,
      resetArticle,
    };
  },
});
</script>

<style>
.active-tab {
  opacity: 0.65;
}
</style>