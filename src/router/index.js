import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MainMenu from '@/components/main-menu/main-menu'
import MaterialList from '@/components/material-list/material-list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainMenu',
      component: MainMenu
    },
    {
      path: '/material-list',
      name: 'MaterialList',
      component: MaterialList
    }    
  ]
})
