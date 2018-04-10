<template>
<div>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar color="blue-grey darken-2" dark>
          <v-toolbar-title>
            <v-icon dark>gesture</v-icon>
            Inclusão de Receitas
              <v-btn fab dark small color="amber darken-4" @click="openModal('showRecipeRegister')">
                <v-icon dark>add</v-icon>
              </v-btn>
              <v-tooltip top>
                <v-btn fab dark small color="amber darken-4" @click="openModal('showRecipePrint')" slot="activator">
                  <v-icon dark>print</v-icon>
                </v-btn>
                <span>Imprimir Receitas</span>
              </v-tooltip>              
              <v-tooltip top>
                <v-btn fab dark small color="amber darken-4" @click="updateRecipes()" slot="activator">
                  <v-icon dark>cached</v-icon>
                </v-btn> 
                <span>Atualizar valores</span>
              </v-tooltip>                                              
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
  <v-data-table
      v-bind:headers="headers"
      :items="recipes"
      :loading="showLoader"
      v-bind:search="search"
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-left">{{ props.item.name }}</td>
      <!-- <td class="text-xs-left">{{ getRecipeCategoryById(props.item.recipeCategory).name }}</td> -->
      <td class="text-xs-right">{{ props.item.formattedCost }}</td>
      <td class="text-xs-right">{{ props.item.priceProfitFormatted }}</td>
      <td class="text-xs-right">{{ props.item.adctionalPriceFormatted }}</td>
      <td class="text-xs-right">{{ props.item.totalCostFormatted }}</td>
      <td class="text-xs-right">
        <v-btn fab dark  small color="green" @click="editRecipe(props.item,'showRecipeRegister')">
          <v-icon dark>mode_edit</v-icon>
        </v-btn>                  
      </td>                 
      <td class="text-xs-right">
        <v-btn fab dark  small color="red" @click="removeRecipe(props.item)">
          <v-icon dark>remove</v-icon>
        </v-btn>                  
      </td>       
    </template>   
  </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
  <recipe-register :show-recipe-register.sync="showRecipeRegister" :recipe-editable.sync="recipeEditable"></recipe-register>
  <recipe-print :show-recipe-print.sync="showRecipePrint"></recipe-print> 
</div>
</template>
<script>
import recipeRegister from '@/components/recipe-register/recipe-register';
import recipePrint from '@/components/recipe-print/recipe-print';
import {db} from '@/components/shared/data-config/data-config.js';
import logAction from '@/components/shared/action-log/action-log';
import recipeData from '@/components/recipe/shared/recipe-data/recipe-data';

export default {
  name: 'RecipeList',
  components: {
      recipeRegister,
      recipePrint
  },
  mixins: [logAction,recipeData],
data () {
      return {
          showRecipeRegister: false,
          showRecipePrint:false,
          search: '',
        headers: [
          {text: 'Nome da Receita', value: 'name', align: 'left'},
          // {text: 'Categoria da Receita',value: 'description', align: 'left'},
          {text: 'Vlr de Custo',value: 'cost'},
          {text: 'Vlr de Lucro',value: 'profit'},
          {text: 'Custos Adicionais',value: 'cost'},
          {text: 'Vlr de Venda',value: 'cost'},
          {text: 'Editar',value: 'cost'},
          {text: 'Excluir',value: 'cost'}
        ],
        recipes:[],
        recipeEditable:{},
        showLoader:true,
      }
},
  methods: {
      openModal(modalItem){
        this[modalItem] = true;
      },
      editRecipe(recipe, modalItem){
        this.recipeEditable = recipe['.key'];
        this[modalItem] = true;
      },
      updateRecipes(){
        this.updateRecipePrices();
      },
      getCategories(){
          this.$bindAsArray(
            'categories',
            db.ref('rcita/categories'),
            null,
            () => this.getMaterials()
        );
      },
      getMaterials(){
          this.$bindAsArray(
            'materials',
            db.ref('rcita/materials'),
            null,
            ()=> this.getMaterialStore()
        );
      },
      getMaterialStore(){
          this.$bindAsArray(
            'materialsStore',
            db.ref('rcita/materialsStore'),
            null,
            ()=> this.getRecipeCategories()
        );
      },                     
      getRecipeCategories(){
          this.$bindAsArray(
            'recipeCategories',
            db.ref('rcita/recipeCategories'),
            null,
            () => this.getRecipes()
        );
      },
      getRecipes(){
          this.$bindAsArray(
            'recipes',
            db.ref('rcita/recipes'),
            null,
            ()=> this.showLoader= false
        );
      },
      getRecipeCategoryById(id){
        return _.find(this.recipeCategories,function(r){return r['.key'] == id});
      },       
      removeRecipe(recipe){
        this.$firebaseRefs.recipes.child(recipe['.key']).remove();
      },
  },
    mounted () {
      this.$on('showModal',function (show,modalName) {
          this[modalName] = show;
      }); 
      
      this.getCategories();
  },  
}
</script>