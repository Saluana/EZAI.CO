<template>
  <div id="container">
    <strong>{{ name }}</strong>
    <p>
      Explore
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://ionicframework.com/docs/components"
        >UI Components</a
      >
    </p>
    <button
      @click="
        getCurrentUser();
        checkStorage();
      "
    >
      Click me
    </button>
  </div>
</template>

<script>
import firebase from "../firebase/firebase";
import { Storage } from "@capacitor/storage";
export default {
  name: "ExploreContainer",
  props: {
    name: String,
  },
  setup() {
    const { getCurrentUser } = firebase;
    async function checkStorage() {
      const { value } = await Storage.get({ key: "user" });
      console.log(value);
    }

    return { getCurrentUser, checkStorage };
  },
};
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>