import { ref } from "vue";
import { menuController } from "@ionic/vue";
//import { Storage } from "@capacitor/storage";
interface Folder {
    date: string;
    documents: string[];
    title: string;
    user: {
        username: string,
        uid: string,
    };
    __v: number;
    _id: string;
}

interface User {
    _id: string;
    username: string | null;
    email: string | null;
    tokens: number | null;
    role: string | null;
    uid: string | null;
    __v: number | null;
    folders?: Folder[] | null;
    documents?: any | null;
}
const user = ref<User>({
    _id: "",
    username: null,
    email: null,
    tokens: null,
    role: null,
    uid: null,
    __v: null,
    folders: null,
    documents: {}
});

interface Note {
    _id: string;
    title: string;
    content: string;
    folderId?: string;
    index?: number | null;
}

const docToEdit = ref<Note>({
    _id: "",
    title: "",
    content: "", 
    folderId: "",
    index: null
})

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
  docToEdit,
};

export { User }
