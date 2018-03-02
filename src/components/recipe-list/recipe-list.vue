<template>
<div>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar color="blue-grey darken-2" dark>
          <v-icon dark>gesture</v-icon>
          <v-toolbar-title>
            Inclusão de Receitas
              <v-btn fab dark small color="amber darken-4" @click="openModal('showRecipeRegister')">
                <v-icon dark>add</v-icon>
              </v-btn>
              <v-btn fab dark small color="amber darken-4" @click="openModal('showRecipePrint')">
                <v-icon dark>print</v-icon>
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
  <v-data-table
      v-bind:headers="headers"
      :items="recipes"
      v-bind:search="search"
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.recipeCategory.name }}</td>
      <td class="text-xs-right">{{ props.item.cost }}</td>
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
  <recipe-register :show-recipe-register.sync="showRecipeRegister" :recipe-editable="recipeEditable"></recipe-register>
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
          {text: 'Nome da Receita', value: 'name'},
          {text: 'Categoria da Receita',value: 'description'},
          {text: 'Preço de Custo',value: 'cost'},
          {text: 'Custos Adicionais',value: 'cost'},
          {text: 'Preço de Venda',value: 'cost'},
          {text: 'Editar',value: 'cost'},
          {text: 'Excluir',value: 'cost'}
        ],
        recipes:[],
        recipeEditable:{},
      }
},
  methods: {
      openModal(modalItem){
        this[modalItem] = true;
      },
      getRecipes(){
        this.recipes = this.$localStorage.get('recipes')? JSON.parse(this.$localStorage.get('recipes')) : this.recipes;
      },
      editRecipe(recipe, modalItem){
        this.recipeEditable = recipe;
        this[modalItem] = true;
      },
      removeRecipe(recipe){
        this.recipes = _.remove(this.recipes, function(item) {
          return item.id != recipe.id;
        });

        this.persistRecipes();
      },
      persistRecipes(){
        this.$localStorage.set('recipes', JSON.stringify(this.recipes));
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