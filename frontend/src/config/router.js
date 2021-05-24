import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import Author from '@/components/register/Author'
import Book from '@/components/register/Book'
import Student from '@/components/register/Student'
import Loan from '@/components/loan/Loan'
import ReturnLoan from '@/components/loan/ReturnLoan'
import Auth from '@/components/auth/Auth'
import UserChangePass from '@/components/auth/UserChangePass'

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
  name: 'userChangePass',
  path: '/change-pass',
  component: UserChangePass
}, {
  name: 'author',
  path: '/authors',
  component: Author
}, {
  name: 'student',
  path: '/students',
  component: Student
}, {
  name: 'book',
  path: '/books',
  component: Book
}, {
  name: 'loan',
  path: '/loans',
  component: Loan
}, {
  name: 'returnLoan',
  path: '/return',
  component: ReturnLoan
}, {
  name: 'auth',
  path: '/auth',
  component: Auth
}]

export default new VueRouter({
  mode: 'history', // sem o sinal de #
  routes
})