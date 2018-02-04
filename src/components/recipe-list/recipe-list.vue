<template>
<div>
        <div class="ui container">
        <h2 class="ui dividing header"></h2>                
    </div>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-toolbar color="deep-orange darken-3" dark>
          <v-toolbar-title>Dona Rosita</v-toolbar-title>
          <v-spacer></v-spacer>
                <v-text-field
        append-icon="search"
        label="Buscar"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
      <v-spacer></v-spacer>
            <v-btn dark small color="amber darken-4" @click="openModal('showRecipeRegister')">
                <v-icon dark>gesture</v-icon>
                Inclusão de Receitas
            </v-btn>
            <v-btn dark small color="amber darken-4" @click="openModal('showRecipePrint')">
                <v-icon dark>weekend</v-icon>
                Imprimir Receitas
            </v-btn>                           
        </v-toolbar>
  <v-data-table
      v-bind:headers="headers"
      :items="recipes"
      v-bind:search="search"
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
    </template>
    <template slot="expand" slot-scope="props">
      <v-card flat>
        <v-card-text>Peek-a-boo!</v-card-text>
      </v-card>
    </template>    
  </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
  <recipe-register :show-recipe-register.sync="showRecipeRegister"></recipe-register>
  <recipe-print :show-recipe-print.sync="showRecipePrint"></recipe-print> 
</div>
</template>
<script>
import recipeRegister from '@/components/recipe-register/recipe-register';
import recipePrint from '@/components/recipe-print/recipe-print';

export default {
  name: 'RecipeList',
  components: {
      recipeRegister,
      recipePrint
  },
data () {
      return {
          showRecipeRegister: false,
          showRecipePrint:false,
          search: '',
        headers: [
          {
            text: 'Nome da Receita',
            value: 'name'
          },
          {
            text: 'Descrição da Receita',
            value: 'description'
          }          
        ],
        recipes:[]
      }
},
  methods: {
      openModal(modalItem){
        this[modalItem] = true;
      },
      getRecipes(){
        this.recipes = this.$localStorage.get('recipes')? JSON.parse(this.$localStorage.get('recipes')) : this.recipes;
      }
  },
    mounted () {
      this.$on('showModal',function (show,modalName) {
          this[modalName] = show;
      }); 

      this.$on('recipeObject',function (recipeObject) {
          this.getRecipes();
      });
      
      this.getRecipes();
  },  
}
</script>