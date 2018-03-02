<template>
<v-dialog v-model="showModal" persistent  max-width="800px">
  <v-card>
    <v-toolbar color="blue-grey darken-2" dark>
    <v-toolbar-title class="white--text">
      <v-icon dark>gesture</v-icon>
      Inclusão de Receita</v-toolbar-title>
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
                  item-value="id"
                  return-object
                  v-model="recipe.recipeCategory"
                  ref="recipe.recipeCategory"
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
                  <td class="text-xs-right">{{ props.item.material.name }}</td>
                  <td class="text-xs-right">{{ props.item.quantity }}</td>
                  <td class="text-xs-right">{{ props.item.unit.description }}</td>
                  <td class="text-xs-right">{{ props.item.cost }}</td>
                  <td class="text-xs-right">
                    <v-btn fab dark  small color="red" @click="removeMaterial(props.item.id)">
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
                <td class="text-xs-right">{{ props.item.material.name }}</td>
                <td class="text-xs-right">{{ props.item.quantity }}</td>
                <td class="text-xs-right">{{ props.item.unit.description }}</td>
                <td class="text-xs-right">{{ props.item.cost }}</td>
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
                <v-radio-group v-model="profitType" :mandatory="true" row>
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
                  v-show="profitType=='valuePrice'">
                </v-text-field>
                <money style="display:none" v-model="recipe.priceProfit" v-bind="money"></money>
                <v-text-field
                  label="Percentual de Lucro"
                  required
                  suffix="%"
                  v-model="recipe.percentProfit"
                  ref="recipe.percentProfit"
                  v-show="profitType!='valuePrice'">
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
                  ref="recipeTotalCost"
                  readonly="true"
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
                  ref="recipeTotalCost"
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
                  prefix="R$"
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
import conversionEngine from '@/components/conversion-engine/conversion-engine';
import numeral from 'numeral';
import {VMoney} from 'v-money';

export default {
  name: 'recipeRegister',
  props: ['showRecipeRegister','recipeEditable'],
  mixins:[conversionEngine],
  data () {    
    return {
    price: 123.45,
    ex3: { label: 'thumb-color', val: 50, color: 'red' },
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
      profitType:'valuePrice',
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
        items:[]
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
      showModal: false     
    }
  },
  computed: {
    summaryCost: function(){
      
      var totalCost = 0.00;

      _.forEach(this.recipe.items, function(item){
        totalCost += numeral(item.cost)._value;
      });

      this.recipe.cost = numeral(totalCost).format('$ 0,0.00');

      return numeral(totalCost).format('$ 0,0.00');
    },
    recipeProfitPrice: function(){
      if(this.profitType != 'valuePrice'){
        return numeral(this.summaryCost)._value * (numeral(this.recipe.percentProfit)._value / 100);
      }

      return numeral(this.recipe.priceProfit)._value;
    },
    unitPrice: function(){

      var unitPrice = 0;

      if(numeral(this.recipe.qtdRecipe)._value >= 1){
        unitPrice =  numeral(this.recipeTotalCost)._value / numeral(this.recipe.qtdRecipe)._value;
      }

      this.recipe.unitPriceRecipe = unitPrice; 
      this.recipe.unitPriceRecipeFormatted = numeral(unitPrice).format('$ 0,0.00'); 

      return numeral(unitPrice).format('$ 0,0.00');
    },
    recipeTotalCost: function(){
      this.recipe.totalCost = numeral(this.summaryCost)._value +
                              numeral(this.recipeProfitPrice)._value + 
                              numeral(this.recipe.adctionalPrice || 0)._value;
      
      this.recipe.totalCostFormatted = numeral(this.recipe.totalCost).format('$ 0,0.00');

      return numeral(this.recipe.totalCost).format(' 0,0.00');
    }
  },
  watch: {
      adctionalCosts: function(){
        this.recipe.adctionalPrice = this.adctionalCosts == false ? 0.00 : this.recipe.adctionalPrice;
        this.recipe.adctionalPriceFormatted = numeral(this.recipe.adctionalPrice).format('$ 0,0.00');
      },
      'recipeItem.category': function(category){
          if(category){
            this.availableMaterials = _.filter(this.materials,function(material){ 
              return material.category.id == category.id;
            }); 
          };
      },         
      'recipeItem.material': function(material){
        this.items = material.unities || null;
      },
      showRecipeRegister: function(show){
          this.showModal = show;
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal,'showRecipeRegister');
          this.e1 = 1;
          this.getRecipes();
          this.clearForm();
      },
      recipeEditable:function(recipe){
        this.recipe = recipe;
      }      
  },
  methods: {
      actvModal(showModal){
          this.showModal = showModal;
      },
      getRecipes(){
        this.recipes = this.$localStorage.get('recipes')? JSON.parse(this.$localStorage.get('recipes')) : this.recipes;
      },
      getMaterialStore(){
        this.materialsStore = this.$localStorage.get('materialStore')? JSON.parse(this.$localStorage.get('materialStore')) : this.materialsStore;
      },            
      addItemRecipe(){
        if (this.$refs.form.validate()) {
          var guid = _guid.create();
          this.recipeItem.id = guid.value;

          if(this.blockMaterialStoreItems(this.recipeItem) > 0){
            this.recipeItem.cost = numeral(this.convertNumber(this.recipeItem)).format('$ 0,0.00');
          }else{
            this.showSnackbar = true;
            this.snackBarText = 'Não há estoque para o material selecionado!'; 
            return;           
          }
          

          if(this.blockAddedRecipeItems(this.recipeItem) == 0){
            this.recipe.items.push(_.clone(this.recipeItem));
          }
          else{
            this.showSnackbar = true;
            this.snackBarText = 'Produto adicionado anteriormente!';
            return;
          }
                     
          this.clearForm();
        }
      },
      blockMaterialStoreItems(recipeItem){
        return _.filter(this.materialsStore, function(item){ 
          return item.material.id == recipeItem.material.id
          }).length;        
      },
      blockAddedRecipeItems(recipeItem){
        return _.filter(this.recipe.items, function(item){ 
          return item.material.id == recipeItem.material.id
          }).length;
      },
      getCategories(){
        this.categories = this.$localStorage.get('categories')? JSON.parse(this.$localStorage.get('categories')) : this.categories;
      },
      getRecipeCategories(){
        this.recipeCategories = this.$localStorage.get('recipeCategories')? JSON.parse(this.$localStorage.get('recipeCategories')) : this.recipeCategories;
      },      
      getMaterials(){
        this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
      },
      removeMaterial(recipeItemId){
        this.recipe.items = _.remove(this.recipe.items, function(item) {
          return item.id != recipeItemId;
        })
      },
      saveRecipe(){
        var guid = _guid.create();
        this.recipe.id = guid.value;
        this.recipes.push(_.clone(this.recipe));
        this.$localStorage.set('recipes', JSON.stringify(this.recipes));
        this.$parent.$emit('recipeObject', _.clone(this.recipe));
        this.showModal = false;
        this.clearForm();
      },
      clearForm(){
        this.$refs.form.reset();
        this.$refs.step1.reset();
      }
  },
  mounted () {
    this.getCategories();
    this.getRecipeCategories();
    this.getMaterials();
    this.getMaterialStore();
  },
  beforeCreate () {
    numeral.register('locale', 'pt-BR', {
        delimiters: {
            thousands: '.',
            decimal: ','
        },
        abbreviations: {
            thousand: 'mil',
            million: 'milhões',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            return 'º';
        },
        currency: {
            symbol: 'R$'
        }
    });
    numeral.locale('pt-BR');
  }
}
</script>

