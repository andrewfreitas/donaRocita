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
            <v-btn dark small color="amber darken-4" @click="openModal()">
                <v-icon dark>gesture</v-icon>
                Inclusão de Receitas
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
</div>
</template>
<script>
import recipeRegister from '@/components/recipe-register/recipe-register';
export default {
  name: 'RecipeList',
  components: {
      recipeRegister
  },
data () {
      return {
          showRecipeRegister: false,
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
        recipes:[],
        items: [
          {
            value: false,
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0
          },
          {
            value: false,
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3
          }


        ]
      }
},
  methods: {
      openModal(){
          this.showRecipeRegister = true;
      }
  },
    mounted () {
      this.$on('showModal',function (show) {
          this.showRecipeRegister = show;
      }); 

      this.$on('recipeObject',function (recipeObject) {
          this.recipes.push(recipeObject);
           this.$localStorage.set('recipes', JSON.stringify(this.recipeObject));
      });
      
      this.recipes = this.$localStorage.get('recipes')? JSON.parse(this.$localStorage.get('recipes')) : this.recipes;
  },  
}
</script>