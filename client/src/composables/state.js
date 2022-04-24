import { ref } from "vue";
import { menuController } from "@ionic/vue";
import { Storage } from "@capacitor/storage";

const user = ref({
  isLoggedIn: false,
  username: null,
  email: null,
  tokens: null,
  uid: null,
  role: null,
});

async function updateUser(loggedIn) {
  console.log("updateUser called");
  const jsonUserData = await Storage.get({ key: "user" });
  let userData;
  if (jsonUserData) {
    console.log("jsonUserData parsing..");
    userData = JSON.parse(jsonUserData.value);
    console.log(userData);
  }

  user.value.uid = loggedIn ? userData.uid : null;
  user.value.username = loggedIn ? userData.username : null;
  user.value.email = loggedIn ? userData.email : null;
  user.value.tokens = loggedIn ? userData.tokens : null;
  user.value.role = loggedIn ? userData.role : null;
  user.value.isLoggedIn = loggedIn ? true : false;
}

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

export default { user, menuIsOpen, toggleMenu, updateUser };
