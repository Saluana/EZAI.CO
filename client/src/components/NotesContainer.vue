<template>
  <div id="container">
    <img :src="photo" />
    <div v-if="photo">
      <button @click="getText(photo)">Get Text</button>
      <p v-if="photoText">{{ photoText }}</p>
    </div>
    <button @click="getImage">Scan document</button>
  </div>
</template>

<script>
import { ref } from "vue";
import { createWorker, PSM, OEM } from "tesseract.js";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import ezapi from "../composables/ezapi";
const worker = createWorker({
  logger: (m) => console.log(m),
});
export default {
  setup() {
    const { correctGrammar } = ezapi;
    let photo = ref(null);
    let photoText = ref(null);

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
        resultType: CameraResultType.Uri,
      });

      photo.value = image.webPath;
    }

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
          photoText.value = result;
        } else {
          photoText.value = "No text found";
        }
      });
    }

    return {
      getImage,
      getText,
      photo,
      photoText,
    };
  },
};
</script>

<style>
button {
  width: 100px;
  height: 40px;
}
</style>