import { ref } from "vue";
import { menuController } from "@ionic/vue";
//import { Storage } from "@capacitor/storage";

const user = ref(null);
const isLoggedIn = ref(false);
const checkForSavedUser = (router) => {
  let savedUser = JSON.parse(window.localStorage.getItem("user"));
  console.log(savedUser);
  if (!isLoggedIn.value && !savedUser) {
    console.log("replaced");
    router.replace("/tabs/login");
  }
};
let menuIsOpen = ref(false);

function toggleMenu() {
  if (menuIsOpen.value) {
    menuController.close("first");
    menuIsOpen.value = false;
  } else if (!menuIsOpen.value) {
    menuController.open("first");
    menuIsOpen.value = true;
  }
}

export default {
  user,
  isLoggedIn,
  menuIsOpen,
  toggleMenu,
  checkForSavedUser,
};
