<template>
<div>
        <div class="ui container">
        <h2 class="ui dividing header"></h2>                
    </div>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-toolbar color="deep-orange darken-3" dark>
          <v-toolbar-title>Dona Rocita</v-toolbar-title>
          <v-spacer></v-spacer>
                <v-text-field
        append-icon="search"
        label="Buscar"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
      <v-spacer></v-spacer>
            <v-btn dark small color="amber darken-4" @click="openModal()">
                <v-icon dark>grain</v-icon>
                Inclusão de Categoria da Receita
            </v-btn>          
        </v-toolbar>
  <v-data-table
      v-bind:headers="headers"
      :items="recipeCategories"
      v-bind:search="search"
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
    </template>
  </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
  <recipe-category-register :show-recipe-category-register.sync="showRecipeCategoryRegister"></recipe-category-register> 
</div>
</template>
<script>

import recipeCategoryRegister from '@/components/recipe-category-register/recipe-category-register';

export default {
  name: 'recipeCategoryList',
  components: {
      recipeCategoryRegister
  },
data () {
      return {
          showRecipeCategoryRegister: false,
          search: '',
        headers: [
          {
            text: 'Nome do Categoria',
            value: 'name'
          }
        ],
        recipeCategories:[]
      }
},
  methods: {
      openModal(){
          this.showRecipeCategoryRegister = true;
      },
      getRecipeCategories(){
          this.recipeCategories = this.$localStorage.get('recipeCategories')? JSON.parse(this.$localStorage.get('recipeCategories')) : this.recipeCategories;
      }
  },
    mounted () {
      this.$on('showModal',function (show) {
          this.showRecipeCategoryRegister = show;
      }); 

      this.$on('categoryObject',function (categoryObject) {
            this.getRecipeCategories();
      });
      
      this.getRecipeCategories();
  },  
}
</script>