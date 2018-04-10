<template>
<v-dialog v-model="showModal" persistent  max-width="800px">
  <v-card>
    <v-toolbar color="blue-grey darken-2" dark>
    <v-toolbar-title class="white--text">
      <v-icon dark>gesture</v-icon>
      {{recipeAction}} de Receita {{e1 > 1 ? ' - ' + recipe.name : ''}}</v-toolbar-title>
    </v-toolbar>
    <v-spacer></v-spacer>
    <v-stepper v-model="e1" dark class="mt-2">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="e1 > 1">Nome da Receita</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="e1 > 2">Itens da Receita</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" :complete="e1 > 3">Itens da Receita</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="4">Salvar a Receita</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-form v-model="validStep1" ref="step1" lazy-validation>
            <v-card color="secondary" class="mb-5" height="250px" ref="step1">
              <v-card-text>
                <v-text-field dark
                  label="Nome da Receita"
                  v-model="recipe.name"
                  :autofocus=true
                  required
                  ref="recipe.name"
                  counter="30"
                ></v-text-field>
              <v-flex xs12>
                <v-select
                  label="Categoria da Receita"
                  placeholder="Selecione"
                  :items="recipeCategories"
                  item-text="name"
                  return-object
                  v-model="recipeCategory"
                  ref="recipeCategory"
                  :rules ="fieldRules.recipeCategoryRules"
                  required>
                </v-select>
              </v-flex>               
              <v-flex xs12>
                <v-text-field dark
                  label="Descrição da Receita"              
                  v-model="recipe.description"
                  required
                  ref="recipe.description"
                  counter="30"
                ></v-text-field>
              </v-flex>                  
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="deep-orange darken-3" @click.native="e1 = 2" :disabled="!validStep1">Continuar</v-btn>
                <v-btn color="deep-orange darken-3" @click="showModal = false;">Cancelar</v-btn>           
              </v-card-actions>                      
            </v-card>
          </v-form>
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
                      v-model="recipeItem.category"
                      ref="recipeItem.category"
                      required
                    ></v-select>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm4>
                    <v-select
                      label="Materiais Disponíveis"
                      placeholder="Selecione"
                      :items="availableMaterials"
                      item-text="name"
                      v-model="recipeItem.material"
                      ref="recipeItem.material"
                      required
                    ></v-select>
                  </v-flex>    
                  <v-spacer></v-spacer>            
                  <v-flex xs12 sm1>
                    <v-text-field
                      label="Quantidade"
                      placeholder="0"
                      v-model="recipeItem.quantity"
                      ref="recipeItem.quantity"
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
                      v-model="recipeItem.unit"
                      item-text="description"
                      ref="recipeItem.unit"
                      persistent-hint
                      required
                    ></v-select>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm1>
                    <v-btn dark fab small @click="addItemRecipe()" color="indigo" :disabled="!valid">
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
                  :items="recipe.items"
                  class="elevation-1"
                  rows-per-page-text = "Itens por página"
                  no-data-text = "Nenhum material foi adicionado a receita."
                >
                <template slot="items" slot-scope="props"> 
                  <td class="text-xs-right">{{ getMaterialById(props.item.material).name }}</td>
                  <td class="text-xs-right">{{ props.item.quantity }}</td>
                  <td class="text-xs-right">{{ props.item.unit.description }}</td>
                  <td class="text-xs-right">{{ getRecipeItemCost(props.item) }}</td>
                  <td class="text-xs-right">
                    <v-btn fab dark  small color="red" @click="removeMaterial(props.item.material)">
                      <v-icon dark>remove</v-icon>
                    </v-btn>                  
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
          </v-layout>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="deep-orange darken-3" @click.native="e1 = 3">Continuar</v-btn>
            <v-btn color="deep-orange darken-3" @click.native="e1 = 1">Voltar</v-btn>
            <v-btn color="deep-orange darken-3" @click="showModal = false">Cancelar</v-btn>
          </v-card-actions>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card color="secondary" class="mb-5" height="200px">
            <v-data-table
                v-bind:headers="summaryHeaders"
                :items="recipe.items"
                no-data-text = "Nenhum material foi adicionado a receita."
                hide-actions
                class="elevation-1">
              <template slot="headerCell" slot-scope="props">
                <v-tooltip bottom>
                  <span slot="activator">
                    {{ props.header.text }}
                  </span>
                  <span>
                    {{ props.header.text }}
                  </span>
                </v-tooltip>
              </template>              
              <template slot="items" slot-scope="props"> 
                <td class="text-xs-right">{{ getMaterialById(props.item.material).name }}</td>
                <td class="text-xs-right">{{ props.item.quantity }}</td>
                <td class="text-xs-right">{{ props.item.unit.description }}</td>
                <td class="text-xs-right">{{ getRecipeItemCost(props.item) }}</td>
              </template>
              <template slot="footer">              
                <td colspan="3" class="text-xs-right">
                  <strong>Valor de custo desta receita:</strong>
                </td>
                <td class="text-xs-right">
                  <strong>{{summaryCost}}</strong>
                  <v-spacer></v-spacer>
                </td>                
              </template>              
            </v-data-table>
          </v-card>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="deep-orange darken-3" @click.stop="e1 = 4">Continuar</v-btn>
            <v-btn color="deep-orange darken-3" @click.native="e1 = 2">Voltar</v-btn>
            <v-btn color="deep-orange darken-3" @click="showModal = false">Cancelar</v-btn>
          </v-card-actions>
        </v-stepper-content>
        <v-stepper-content step="4">
          <v-card color="secondary" class="mb-5" height="250px">
            <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm4>
                <v-radio-group v-model="recipe.profitType" :mandatory="true" row>
                  <v-radio label="Valor" value="valuePrice" color="green"></v-radio>
                  <v-radio label="Percentual" value="percentPrice" color="green"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Valor de Lucro"
                  required
                  prefix="R$"
                  v-model="recipe.priceProfit"
                  ref="recipe.priceProfit"
                  v-show="recipe.profitType=='valuePrice'">
                </v-text-field>
                <money style="display:none" v-model="recipe.priceProfit" v-bind="money"></money>
                <v-text-field
                  label="Percentual de Lucro"
                  required
                  suffix="%"
                  v-model="recipe.percentProfit"
                  ref="recipe.percentProfit"
                  v-show="recipe.profitType!='valuePrice'">
                </v-text-field>
                <money style="display:none" v-model="recipe.percentProfit" v-bind="money"></money>             
              </v-flex>           
              <v-flex xs12 sm6>
                <v-switch label="Adicionar Custos Extras" v-model="adctionalCosts" color="green"></v-switch>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Custos adicionais"
                  required
                  prefix="R$"
                  v-model="recipe.adctionalPrice"
                  ref="recipe.adctionalPrice"
                  :disabled="!adctionalCosts">
                </v-text-field>
                <money style="display:none" v-model="recipe.adctionalPrice" v-bind="money"></money>    
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm2>
                <v-text-field
                  label="Qtd. Receita"
                  v-model="recipe.qtdRecipe"
                  ref="recipe.qtdRecipe"
                  box>
                </v-text-field>
                <money style="display:none" v-model="recipe.qtdRecipe" v-bind="money"></money>    
              </v-flex>
              <v-spacer></v-spacer>                            
              <v-flex xs12 sm2>
                <v-text-field
                  label="Custo Receita"
                  v-model="summaryCost"
                  ref="summaryCost"
                  :readonly=true
                  disabled                
                  box >
                </v-text-field>
                <money style="display:none" v-model="summaryCost" v-bind="money"></money>                            
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm3>
                <v-text-field
                  label="Valor Total por Item"
                  v-model="unitPrice"
                  ref="unitPrice"
                  readonly="true"
                  disabled                
                  box >
                </v-text-field>
                <money style="display:none" v-model="unitPrice" v-bind="money"></money>                            
              </v-flex>
              <v-spacer></v-spacer>              
              <v-flex xs12 sm3>
                <v-text-field
                  label="Valor total da Receita"
                  required
                  v-model="recipeTotalCost"
                  ref="recipeTotalCost"
                  disabled                
                  box>
                </v-text-field>
                <money style="display:none" v-model="recipeTotalCost" v-bind="money"></money>    
              </v-flex>                          
            </v-layout>          
            </v-card-text>                              
          </v-card>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="deep-orange darken-3" @click.stop="saveRecipe()">Salvar Receita</v-btn>
            <v-btn color="deep-orange darken-3" @click.native="e1 = 3">Voltar</v-btn>          
            <v-btn color="deep-orange darken-3" @click="showModal = false">Cancelar</v-btn>
          </v-card-actions>
        </v-stepper-content>        
      </v-stepper-items>
    </v-stepper>             
</v-card>
        
    <v-snackbar
      :timeout="6000"
      :top="true"
      :right="true"
      v-model="showSnackbar"
      color = "green darken-2"
    >
    {{snackBarText}} 
    </v-snackbar>      
</v-dialog>       
</template>

<script>

import _ from 'lodash';
import _guid from 'Guid';
import recipeData from '@/components/recipe/shared/recipe-data/recipe-data';
//import conversionEngine from '@/components/conversion-engine/conversion-engine';
import {db} from '@/components/shared/data-config/data-config.js';
//import numeral from 'numeral';
import {VMoney} from 'v-money';

export default {
  name: 'recipeRegister',
  props: ['showRecipeRegister','recipeEditable'],
  mixins:[recipeData],
  data () {    
    return {
    showSnackbar:false,
    snackBarText:'',
    validStep1:false,
    money: {
      decimal: ',',
      thousands: '.',
      precision: 2,
      masked: true /* doesn't work with directive */
    },
    quantity: {
      decimal: ',',
      thousands: '.',
      precision: 0,
      masked: true /* doesn't work with directive */
    },    
      adctionalCosts:false, 
      e1: 0,
      items:[],
      recipeCategories:[],
      recipeItem:{},
      fieldRules:{
        recipeCategoryRules:[
          (v) => !!v || 'Selecione a Categoria do Material'
        ],          
        unitMaterialRules:[
          (v) => v.length > 0 || 'Selecione ao menos uma Unidade de medida'
        ]          
      },           
      recipe:{
        name:'',
        description:'',
        items:[],
        profitType:'valuePrice'
      },
      headers: [
        {
          text: 'Nome do Material',
          value: 'name'
        },
        { text: 'Quantidade', value: 'quantity' },
        { text: 'Unidade de Medida', value: 'unit' },
        { text: 'Vlr Custo', value: 'cost' },
        { text: 'Excluir', value: 'delete',align: 'right', }
      ],
      summaryHeaders: [
        {
          text: 'Nome do Material',
          value: 'name'
        },
        { text: 'Quantidade', value: 'quantity' },
        { text: 'Unidade de Medida', value: 'unit' },
        { text: 'Vlr Custo', value: 'cost' }
      ],              
      recipes:[],
      categories:[],
      materials:[],
      materialsStore:[],
      availableMaterials:[],
      valid:true,          
      showModal: false,
      recipeCategory:{},
      recipeAction:'Inclusão',
      recipeEdit:false     
    }
  },
  computed: {
    summaryCost: function(){
      return this.getSummaryCost(this.recipe);
    },
    recipeProfitPrice: function(){
      this.getRecipeProfitPrice(this.recipe);
    },
    unitPrice: function(){
      return this.getUnitPrice(this.recipe);
    },
    recipeTotalCost: function(){
      return this.getTotalCost(this.recipe);
    }
  },
  watch: {
      adctionalCosts: function(){
        this.recipe.adctionalPrice = this.adctionalCosts == false ? 0.00 : this.recipe.adctionalPrice;
      },
      'recipe.adctionalPrice':function(){
          this.recipe.adctionalPriceFormatted = this.formatPrice(this.recipe.adctionalPrice);
      },
      'recipeItem.category': function(category){
          if(category){
            this.availableMaterials = _.filter(this.materials,function(material){ 
              return material.category == category['.key'];
            }); 
          };
      },         
      'recipeItem.material': function(material){
        if(material){
          this.items = material.unities || null;
        }
      },
      showRecipeRegister: function(show){
          this.showModal = show;
          this.recipeEdit = show;
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal,'showRecipeRegister');
          this.e1 = 1;
          this.getRecipes();
          this.clearForm();
      },
      recipeEditable:function(recipe){
        this.recipeEdit = recipe;
        this.recipe = _.find(this.recipes,function(r){return r['.key'] == recipe});
        this.recipeCategory = this.getRecipeCategoryById(this.recipe.recipeCategory);
        this.recipeAction = 'Alteração';
      }      
  },
  methods: { 
      addItemRecipe(){
        if (this.$refs.form.validate()) {
          
          if(this.blockAddedRecipeItems(this.recipeItem)){
            this.showSnackbar = true;
            this.snackBarText = 'Produto adicionado anteriormente!';
            return;
          };

          this.recipeItem.category = this.recipeItem.category['.key'];
          this.recipeItem.material = this.recipeItem.material['.key'];
          this.recipeItem.price = this.getMaterialById(this.recipeItem.material).price;
          this.recipe.items.push(_.clone(this.recipeItem));                     
          this.clearFormItem();
        }
      },
      blockAddedRecipeItems(recipeItem){
        return _.filter(this.recipe.items, function(item){ 
          return item.material == recipeItem.material['.key']
          }).length > 0;
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
            ()=> this.getRecipeCategories()
        );
      },
      // getMaterialStore(){
      //     this.$bindAsArray(
      //       'materialsStore',
      //       db.ref('rcita/materialsStore'),
      //       null,
      //       ()=> this.getRecipeCategories()
      //   );
      // },                     
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
            db.ref('rcita/recipes')
        );
      },
      getMaterialById(id){
        return _.find(this.materials,function(m){ return m['.key'] ==  id});
      },
      getRecipeCategoryById(id){
        return _.find(this.recipeCategories,function(rC){ return rC['.key'] == id});
      },               
      removeMaterial(recipeItemId){
        this.recipe.items = _.remove(this.recipe.items, function(item) {
          return item.material != recipeItemId;
        })
      },
      saveRecipe(){

        this.recipe.recipeCategory = this.recipeCategory['.key'];

        if(!this.recipe['.key']){  
          this.$firebaseRefs.recipes.push(_.clone(this.recipe));  
        }else{
          this.updateRecipe(this.recipe);
        }
  
        this.showModal = false;
        this.clearForm();
      },
      updateRecipe(recipe){
        const copyObj = _.clone(recipe);
        delete copyObj['.key'];
        this.$firebaseRefs.recipes.child(recipe['.key']).set(copyObj);
      },         
      clearForm(){
        this.$refs.form.reset();
        this.$refs.step1.reset();
        this.validStep1 = false;
      },
      clearFormItem(){
        this.$refs.form.reset();
      }
  },
  mounted () {
    this.getCategories();
    this.recipe.qtdRecipe = 1.00;
  }
}
</script>

