import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Login from '@/views/Login/index.vue'
import Category from '@/views/Category/index.vue'
import Home from '@/views/Home/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      // 不能加s
      component:Layout,
      children:[
        {
          path:'',
          component:Home
        },
        {
          // :为占位符
          path:'/category/:id',
          component:Category
        }
      ]
    },
    {
      path:'/login',
      component:Login,
    }
  ]
})

export default router
