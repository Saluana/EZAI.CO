import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginPage from '../views/LoginPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'scan',
        component: () => import('@/views/ScanPage.vue')
      },
      {
        path: 'extract',
        component: () => import('@/views/ExtractPage.vue')
      },
      {
        path: 'folder',
        component: () => import('@/views/FolderPage.vue'),
      },
      {
        path: 'folder/:id',
        component: () => import('@/views/FilesPage.vue'),
      },
      {
        path: 'note/:id',
        component: () => import('@/views/EditPage.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
