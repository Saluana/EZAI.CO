import { ref } from "vue";
import { menuController } from "@ionic/vue";
//import { Storage } from "@capacitor/storage";
interface User {
    _id: string;
    username: string | null;
    email: string | null;
    tokens: number | null;
    role: string | null;
    uid: string | null;
    __v: number | null;
}
const user = ref<User>({
    _id: "",
    username: null,
    email: null,
    tokens: null,
    role: null,
    uid: null,
    __v: null
});
const isLoggedIn = ref<boolean>(false);

const menuIsOpen = ref<boolean>(false);

function toggleMenu(): void {
    menuController.toggle("first");
    menuIsOpen.value = !menuIsOpen.value;
}

export default {
  user,
  isLoggedIn,
  menuIsOpen,
  toggleMenu,
};
