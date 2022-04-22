import { createRouter, createWebHistory } from "@ionic/vue-router";
import TabsPage from "../views/TabsPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/tabs/chat",
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "chat",
        component: () => import("@/views/ChatPage.vue"),
      },
      {
        path: "profile",
        component: () => import("@/views/ProfilePage.vue"),
      },
      {
        path: "write",
        component: () => import("@/views/WritePage.vue"),
      },
      {
        path: "settings",
        component: () => import("@/views/SettingsPage.vue"),
      },
      {
        path: "login",
        component: () => import("@/views/LoginPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
