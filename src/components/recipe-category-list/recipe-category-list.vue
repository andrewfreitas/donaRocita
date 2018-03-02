<template>
<div>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar color="blue-grey darken-2" dark>
          <v-toolbar-title>
            <v-icon dark>grain</v-icon>
            Categorias da Receita
              <v-btn fab dark small color="amber darken-4" @click="openModal()">
                <v-icon dark>add</v-icon>
              </v-btn>              
          </v-toolbar-title>
          <v-spacer></v-spacer>
                <v-text-field
        append-icon="search"
        label="Buscar"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>     
        </v-toolbar>
  <v-alert type="success" dismissible v-model="deleteRecipeCategory">
    Não é possível excluir a categoria de receita. Existem receitas cadastradas utilizando categoria de receita existente.
  </v-alert>          
  <v-data-table
      v-bind:headers="headers"
      :items="recipeCategories"
      v-bind:search="search"
      class="elevation-1"
      no-data-text="Não há dados cadastrados"
      no-results-text="Dados não encontrados"
      rows-per-page-text="Itens por página"        
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-left">{{ props.item.name }}</td>
      <td class="text-xs-right">
        <v-btn fab dark  small color="green" @click="editRecipeCategory(props.item)">
          <v-icon dark>mode_edit</v-icon>
        </v-btn>                  
      </td>                 
      <td class="text-xs-right">
        <v-btn fab dark  small color="red" @click="removeRecipeCategory(props.item)">
          <v-icon dark>remove</v-icon>
        </v-btn>                  
      </td>          
    </template>
  </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
  <recipe-category-register :show-recipe-category-register.sync="showRecipeCategoryRegister" :recipe-category-editable="recipeCategoryEditable"></recipe-category-register> 
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
          {text: 'Nome do Categoria',value: 'name', align: 'left'},
          {text: 'Editar',value: 'edit'},
          {text: 'Excluir',value: 'delete'}
        ],
        recipeCategories:[],
        recipeCategoryEditable:{},
        deleteRecipeCategory:false
      }
},
  methods: {
      openModal(){
          this.showRecipeCategoryRegister = true;
      },
      editRecipeCategory(recipeCategory){
        this.recipeCategoryEditable = recipeCategory;
        this.showRecipeCategoryRegister = true;
      },      
      getRecipeCategories(){
          this.recipeCategories = this.$localStorage.get('recipeCategories')? JSON.parse(this.$localStorage.get('recipeCategories')) : this.recipeCategories;
      },
      removeRecipeCategory(recipeCategory){
        if(!this.verifyRelationship(recipeCategory)){
          this.recipeCategories = _.remove(this.recipeCategories, function(item) {
            return item.id != recipeCategory.id;
          });

          this.persistRecipeCategories();
        }else{
          this.deleteRecipeCategory = true;
        }
      },
      verifyRelationship(recipeCategory){
        return _.size(_.filter(this.getRecipes(),function(recipe){
          return _.filter(recipe.items,function(item){
            return item.recipeCategory.id == recipeCategory.id;
          });
        })) > 0;
      },
      persistRecipeCategories(){
        this.$localStorage.set('recipeCategories', JSON.stringify(this.recipeCategories));
      },
      getRecipes(){
        return this.$localStorage.get('recipes')? JSON.parse(this.$localStorage.get('recipes')) : this.recipes;
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