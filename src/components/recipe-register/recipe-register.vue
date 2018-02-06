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
        <v-stepper-step step="3" :complete="e1 > 3">Itens da Receita</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="4">Salvar a Receita</v-stepper-step>
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
                  <v-select
                    label="Categoria da Receita"
                    placeholder="Selecione"
                    :items="recipeCategories"
                    item-text="name"
                    v-model="recipeItem.recipeCategory"
                    ref="recipeItem.recipeCategory"
                    required
                  ></v-select>
            </v-flex>               
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
                    v-model="recipeItem.category"
                    ref="recipeItem.category"
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
          <v-btn color="deep-orange darken-3" @click.native="e1 = 3">Continuar</v-btn>
          <v-btn color="deep-orange darken-3" @click.native="e1 = 1">Voltar</v-btn>
          <v-btn color="deep-orange darken-3" @click="showModal = false">Cancelar</v-btn>
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
          <v-btn color="deep-orange darken-3" @click.stop="e1 = 4">Continuar</v-btn>
          <v-btn color="deep-orange darken-3" @click.native="e1 = 3">Voltar</v-btn>
          <v-btn color="deep-orange darken-3" @click="showModal = false">Cancelar</v-btn>
        </v-stepper-content>
        <v-stepper-content step="4">
          <v-card color="secondary" class="mb-5" height="200px">
            <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm5>
                <v-radio-group v-model="ex8" :mandatory="false" row>
                  <v-radio label="Valor" value="radio-1" color="green"></v-radio>
                  <v-radio label="Percentual" value="radio-2" color="green"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 sm5>
                <v-text-field
                  label="Preço"
                  required
                  prefix="R$"
                  v-model="recipe.price"
                  ref="recipe.price">
                </v-text-field>
                <money style="display:none" v-model="recipe.price" v-bind="money"></money>             
              </v-flex>              
              <v-flex xs12 sm5>
                <v-text-field dark
                  label="Nome da Receita"
                  v-model="recipe.name"
                  required
                  ref="recipe.name"
                  counter="30"
                ></v-text-field>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm5>
                    <v-select
                      label="Categoria da Receita"
                      placeholder="Selecione"
                      :items="recipeCategories"
                      item-text="name"
                      v-model="recipeItem.recipeCategory"
                      ref="recipeItem.recipeCategory"
                      required
                    ></v-select>
              </v-flex>
            </v-layout>               
            </v-card-text>                    
          </v-card>
          <v-btn color="deep-orange darken-3" @click.stop="saveRecipe()">Salvar Receita</v-btn>
          <v-btn color="deep-orange darken-3" @click.native="e1 = 3">Voltar</v-btn>
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
import numeral from 'numeral';
import {VMoney} from 'v-money';

export default {
  name: 'recipeRegister',
  props: ['showRecipeRegister'],
  mixins:[conversionEngine],
  data () {    
    return {
    price: 123.45,
    money: {
      decimal: ',',
      thousands: '.',
      precision: 2,
      masked: true /* doesn't work with directive */
    },      
      e1: 0,
      items:[],
      recipeCategories:[],
      recipeItem:{},     
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
      selectedMaterial:{},
      selectedCategory:{},
      recipes:[],
      categories:[],
      materials:[],
      valid:true,          
      showModal: false     
    }
  },
  computed: {
    summaryCost: function(){
      
      var totalCost = 0;

      _.forEach(this.recipe.items, function(item){
        totalCost += numeral(item.cost)._value;
      });

      return numeral(totalCost).format('$ 0,0.00');
    }
  },
  watch: {
      selectedCategory: function(category){
        this.materials = _.filter(this.materials,function(material){ 
          return material.category.id == category.id;
        });       
      },    
      'recipeItem.material': function(material){
        this.items = material.unities || null;
      },
      showRecipeRegister: function(show){
          this.showModal = show;
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal,'showRecipeRegister');
      }
  },
  methods: {
      actvModal(showModal){
          this.showModal = showModal;
      },
      addRecipe(){
        if (this.$refs.form.validate()) {
          var guid = _guid.create();
          this.recipeItem.id = guid.value;
          this.recipeItem.cost = numeral(this.convertNumber(this.recipeItem)).format('$ 0,0.00');
          this.recipe.items.push(_.clone(this.recipeItem));           
          this.clearForm();
        }
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
        this.recipes.push(_.clone(this.recipe));
        this.$localStorage.set('recipes', JSON.stringify(this.recipes));
        this.$parent.$emit('recipeObject', _.clone(this.recipe));
        this.showModal = false;
        this.clearForm();
      },
      clearForm(){
        this.$refs.form.reset();
      }
  },
  mounted () {
    this.getCategories();
    this.getRecipeCategories();
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

