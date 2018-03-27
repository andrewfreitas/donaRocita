<template>
<div>
  <v-dialog v-model="showModal" persistent  max-width="500px">
    <v-card>
        <v-toolbar color="blue-grey darken-2" dark>
          <v-icon dark>printer</v-icon>
          <v-toolbar-title class="white--text">Impressão de Receitas</v-toolbar-title>
        </v-toolbar>
        <v-spacer></v-spacer>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-flex xs12>
            <v-card ref="form">
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-select
                      label="Categoria da Receita"
                      placeholder="Todas"
                      :items="recipeCategories"
                      item-text="name"
                      v-model="recipePrinter.category"
                      ref="recipePrinter.category"
                      required
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm7>
                    <v-card color="secondary" flat>
                      <v-card-text>
                        <v-switch label="Descrição da Receita"
                              v-model="recipePrinter.recipeDescription"
                              color="green"
                              value="red"
                              hide-details>
                        </v-switch>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12 sm5>
                    <v-card color="secondary" flat>
                      <v-card-text>
                        <v-switch label="Valor Venda"
                              v-model="recipePrinter.price"
                              color="green"
                              value="red"
                              hide-details>
                        </v-switch>
                      </v-card-text>
                    </v-card>
                  </v-flex>            
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                  <v-btn dark @click="print()" router color="orange darken-4" :disabled="!valid">
                    Imprimir
                  </v-btn>
                  <v-btn dark @click="showModal = false" color="orange darken-4">
                    Cancelar
                  </v-btn>                  
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-form>                   
    </v-card>
  </v-dialog>
</div>     
</template>
<script>
// import pdfPrinter from '@/components/shared/pdf-print';
import _ from 'lodash';
import {db} from '@/components/shared/data-config/data-config.js';
// import _guid from 'Guid';

export default {
  name: 'recipePrint', 
  props: ['showRecipePrint'],
  // mixins:[pdfPrinter],
  data () {
    return {
      recipePrinter:{
        recipeDescription:true,
        price:false
      },
      recipeCategories:[],             
      showModal: false,
      showPrintPreview:false,
      select: null,
      valid:true    
    }
  },
  watch: {
    showRecipePrint: function(show){
        this.showModal = show;
    },
    showModal:function(showModal){
        this.$parent.$emit('showModal', showModal,'showRecipePrint');
    }
  },
  mounted(){
    this.getRecipeCategories();
  },
  methods: {
    getRecipeCategories(){
      this.recipeCategories = this.$localStorage.get('recipeCategories')? JSON.parse(this.$localStorage.get('recipeCategories')) : this.recipeCategories;
      this.recipeCategories.push({id:'0',name:'Todas'});
      this.recipeCategories = _.sortBy(this.recipeCategories, function(item){return item.id});
    },       
    print(){
      window.open('#/recipe-print-view', '_blank');
      //this.showPrintPreview = true;
    },
    clearForm(){
      this.$refs.form.reset();
    }
  }
}
</script>

