import { ref } from "vue";
import { menuController } from "@ionic/vue";

const user = ref({
  isLoggedIn: false,
  username: null,
  tokens: null,
  id: null,
});

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

export default { user, menuIsOpen, toggleMenu };
