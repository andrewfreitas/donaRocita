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
                :items="recipes"
                class="elevation-1"
                rows-per-page-text = "Itens por página"
                no-data-text = "Nenhum material adicionado foi adicionado a receita."
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
                :items="recipes"
                no-data-text = "Nenhum material adicionado foi adicionado a receita."
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
import numeral from 'numeral';

export default {
  name: 'recipeRegister',
  props: ['showRecipeRegister'],
  mixins:[conversionEngine],
  data () {
    return {
      e1: 0,
      items:[],
      recipeItem:{},     
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
      categories:[],
      recipes:[],
      materials:[],
      valid:true,          
      showModal: false     
    }
  },
  computed: {
    summaryCost: function(){
      
      var totalCost = 0;

      _.forEach(this.recipes, function(item){
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
          this.recipeItem.id = guid.value;
          this.recipeItem.cost = numeral(this.convertNumber(this.recipeItem)).format('$ 0,0.00');           
          this.recipes.push(_.clone(this.recipeItem));
          this.clearForm();
        }
      },
      getCategories(){
        this.categories = this.$localStorage.get('categories')? JSON.parse(this.$localStorage.get('categories')) : this.categories;
      },
      getMaterials(){
        this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
      },
      removeMaterial(recipeItemId){
        this.recipes = _.remove(this.recipes, function(item) {
          return item.id != recipeItemId;
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

