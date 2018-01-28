<template>
      <v-dialog v-model="showModal" persistent  max-width="800px">
        <v-card>
            <v-toolbar color="deep-orange darken-3" dark>
              <v-icon dark>gesture</v-icon>
            <v-toolbar-title class="white--text">Inclusão de Receita</v-toolbar-title>
            </v-toolbar>
            <v-spacer></v-spacer>
    <v-stepper v-model="e1" dark class="mt-2">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="e1 > 1">Nome da Receita</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="e1 > 2">Itens da Receita</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Salvar a Receita</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card color="secondary" class="mb-5" height="300px">
            <v-card-text>
              <v-text-field dark
                label="Nome da Receita"
                v-model="recipe.name"
                required
                ref="recipe.name"
                counter="30"
              ></v-text-field>
            <v-flex xs12>
              <v-text-field dark
                label="Descrição da Receita"              
                v-model="recipe.description"
                required
                ref="recipe.description"
                counter="30"
                multi-line
              ></v-text-field>
            </v-flex>                  
            </v-card-text>        
          </v-card>
          <v-btn color="deep-orange darken-3" @click.native="e1 = 2">Continuar</v-btn>
          <v-btn color="deep-orange darken-3" @click="showModal = false">Cancelar</v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card color="secondary" class="mb-2" height="100px">
            <v-form v-model="valid" ref="form" lazy-validation>
            <v-card-text ref="form">
              <v-layout row wrap>
                <v-flex xs12 sm2>
                  <v-select
                    label="Categorias"
                    placeholder="Selecione"
                    :items="categories"
                    item-text="name"
                    v-model="selectedCategory"
                    ref="recipe.categories"
                    required
                    @change="getMaterials()"
                  ></v-select>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs12 sm4>
                  <v-select
                    label="Materiais Disponíveis"
                    placeholder="Selecione"
                    :items="materials"
                    item-text="name"
                    v-model="selectedMaterial"
                    ref="recipe.materials"
                    required
                  ></v-select>
                </v-flex>    
                <v-spacer></v-spacer>            
                <v-flex xs12 sm1>
                  <v-text-field
                    label="Quantidade"
                    placeholder="0"
                    v-model="recipe.quantity"
                    ref="recipe.quantity"
                    counter="5"
                    required
                  ></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs12 sm2>
                  <v-select
                    label="Unid. Medida"
                    placeholder="Selecione"
                    :items.sync="items"
                    v-model="recipe.unit"
                    item-text="description"
                    ref="recipe.unit"
                    persistent-hint
                    required
                  ></v-select>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs12 sm1>
                  <v-btn dark fab small @click="addRecipe()" color="indigo" :disabled="!valid">
                    <v-icon dark>add</v-icon>
                  </v-btn>                   
                </v-flex>                              
              </v-layout>
            </v-card-text>
            </v-form>          
          </v-card>
        <v-layout row>
        <v-flex xs12>
          <v-card>
            <v-data-table
                v-bind:headers="headers"
                :items="recipes"
                class="elevation-1"
                rows-per-page-text = "Itens por página"
              >
              <template slot="items" slot-scope="props"> 
                <td class="text-xs-right">{{ props.item.material.name }}</td>
                <td class="text-xs-right">{{ props.item.quantity }}</td>
                <td class="text-xs-right">{{ props.item.unit.description }}</td>
                <td class="text-xs-right">
                  <v-btn fab dark  small color="red" @click="removeMaterial(props.item.recipeItemId)">
                    <v-icon dark>remove</v-icon>
                  </v-btn>                  
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>             
          <v-btn color="deep-orange darken-3" @click.native="e1 = 3">Continuar</v-btn>
          <v-btn color="deep-orange darken-3" @click.native="e1 = 1">Voltar</v-btn>
          <v-btn color="deep-orange darken-3" @click="showModal = false">Cancelar</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card color="secondary" class="mb-5" height="200px">
              <v-list>
                <v-list-tile v-for="item in recipes" v-bind:key="recipe.materialName">
                  <v-list-tile-action>
                    <v-icon v-if="item.icon" color="green">star</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="item.materialName"></v-list-tile-title>
                  </v-list-tile-content>                  
                  <v-list-tile-content>
                    <v-list-tile-title v-text="item.quantity"></v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="item.unit"></v-list-tile-title>
                  </v-list-tile-content>                  
                </v-list-tile>
              </v-list>
          </v-card>
          <v-btn color="deep-orange darken-3" @click.native="e1 = 3">Salvar Receita</v-btn>
          <v-btn color="deep-orange darken-3" @click.native="e1 = 2">Voltar</v-btn>
          <v-btn color="deep-orange darken-3" @click="showModal = false">Cancelar</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
                       
        </v-card>
      </v-dialog>       
</template>

<script>

import _ from 'lodash';
import _guid from 'Guid';
import conversionEngine from '@/components/conversion-engine/conversion-engine';

export default {
  name: 'recipeRegister',
  props: ['showRecipeRegister'],
  mixins:[conversionEngine],
  data () {
    return {
      e1: 0,
      items:[],     
      recipe:{
        name:'',
        description:'',
        materials:[]
      },
      headers: [
        {
          text: 'Nome do Material',
          value: 'name'
        },
        { text: 'Quantidade', value: 'quantity' },
        { text: 'Unidade de Medida', value: 'unit' },
        { text: 'Excluir', value: 'delete',align: 'right', }
      ],      
      selectedMaterial:{},
      selectedCategory:{},
      categories:[],
      recipes:[],
      materials:[],
      valid:true,          
      showModal: false,
      select: null,      
    }
  },
  watch: {
      selectedCategory: function(category){
        this.materials = _.filter(this.materials,function(material){ 
          return material.category.id == category.id;
        });       
      },    
      selectedMaterial: function(material){
        this.items = material.unities;
      },
      showRecipeRegister: function(show){
          this.showModal = show;
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal);
      }
  },
  methods: {
      actvModal(showModal){
          this.showModal = showModal;
      },
      addRecipe(){
        if (this.$refs.form.validate()) {
          var guid = _guid.create();
          var recipeItem = {
            recipeItemId:guid.value,
            material: this.selectedMaterial,
            quantity: this.recipe.quantity,
            unit: this.recipe.unit
          };
          this.convertNumber(recipeItem);
          this.recipes.push(recipeItem);
          this.clearForm();
        }
      },
      getCategories(){
        this.categories = this.$localStorage.get('categories')? JSON.parse(this.$localStorage.get('categories')) : this.categories;
      },
      getMaterials(){
        this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
      },
      removeMaterial(itemId){
        this.recipes = _.remove(this.recipes, function(recipeItem) {
          return recipeItem.recipeItemId != itemId;
        })
      },
      saveRecipe(){
        this.$parent.$emit('recipeObject', _.clone(this.recipes));
      },
      clearForm(){
        this.$refs.form.reset();
      }
  },
  mounted () {
    this.getCategories();
  }
}
</script>

