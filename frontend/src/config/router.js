import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import Author from '@/components/register/Author'
import ArticlesByCategory from '@/components/article/ArticlesByCategory'
import ArticleById from '@/components/article/ArticleById'
import Auth from '@/components/auth/Auth'

Vue.use(VueRouter)

const routes = [{
  name: 'home',
  path: '/',
  component: Home
}, {
  name: 'adminPages',
  path: '/admin',
  component: AdminPages
}, {
  name: 'author',
  path: '/authors',
  component: Author
}, {
  name: 'articlesByCategory',
  path: '/categories/:id/articles',
  component: ArticlesByCategory
}, {
  name: 'articleById',
  path: '/articles/:id',
  component: ArticleById
}, {
  name: 'auth',
  path: '/auth',
  component: Auth
}]

export default new VueRouter({
  mode: 'history', // sem o sinal de #
  routes
})