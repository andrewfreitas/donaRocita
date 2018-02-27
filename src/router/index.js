import Vue from 'vue'
import Router from 'vue-router'
import MainMenu from '@/components/main-menu/main-menu'
import MaterialList from '@/components/material-list/material-list'
import CategoryList from '@/components/category-list/category-list'
import RecipeList from '@/components/recipe-list/recipe-list'
import MaterialStoreList from '@/components/material-store-list/material-store-list'
import RecipeCategoryList from '@/components/recipe-category-list/recipe-category-list'
import RecipePrintView from '@/components/recipe-print-view/recipe-print-view'


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
    },
    {
      path: '/category-list',
      name: 'CategoryList',
      component: CategoryList
    },
    {
      path: '/recipe-list',
      name: 'RecipeList',
      component: RecipeList
    },
    {
      path: '/material-store-list',
      name: 'MaterialStoreList',
      component: MaterialStoreList
    },
    {
      path: '/recipe-category-list',
      name: 'recipeCategoryList',
      component: RecipeCategoryList
    },
    {
      path: '/recipe-print-view',
      name: 'recipePrintView',
      component: RecipePrintView
    }                                              
  ]
})
