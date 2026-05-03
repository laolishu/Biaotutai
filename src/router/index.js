import { createRouter, createWebHistory } from 'vue-router'
import Upload from '../views/Upload.vue'
import Workbench from '../views/Workbench.vue'
import Viewer from '../views/Viewer.vue'

const routes = [
  { path: '/', name: 'Upload', component: Upload },
  { path: '/workbench', name: 'Workbench', component: Workbench },
  { path: '/viewer', name: 'Viewer', component: Viewer }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
