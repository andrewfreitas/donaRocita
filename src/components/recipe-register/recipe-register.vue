<template>
      <v-dialog v-model="showModal" persistent  max-width="500px">
        <v-card>
            <v-toolbar color="deep-orange darken-3" dark>
              <v-icon dark>gesture</v-icon>
            <v-toolbar-title class="white--text">Inclusão de Receita</v-toolbar-title>
            </v-toolbar>
            <v-spacer></v-spacer>
  <v-layout justify-center>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-flex xs12>
        <v-card ref="form">
          <v-card-text>
            <v-layout row wrap>
            <v-flex xs12>
              <v-text-field box dark
                label="Nome da Receita"
                v-model="recipe.name"
                required
                ref="recipe.name"
                counter="30"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
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
            <v-flex xs12 sm5>
              <v-text-field
                label="Quantidade"
                placeholder="0"
                v-model="recipe.quantity"
                ref="recipe.quantity"
                counter="5"
                :suffix="selectedMaterial.unit"
                required
              ></v-text-field>
            </v-flex>                  
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark small @click="showModal = false" color="deep-orange darken-3">
              <v-icon dark>replay</v-icon>
              Fechar</v-btn>
            <v-btn dark small @click="addRecipe()" color="deep-orange darken-3" :disabled="!valid">
              <v-icon dark>done</v-icon>
              Incluir Material
              </v-btn>
            <v-btn dark small @click="saveCategory()" color="green" :disabled="!valid">
              <v-icon dark>done</v-icon>
              Salvar Receita
              </v-btn>              
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-form>
  </v-layout>
    <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-divider></v-divider>
  <v-data-table
      v-bind:headers="headers"
      :items="recipes"
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-right">{{ props.item.materialName }}</td>
      <td class="text-xs-right">{{ props.item.quantity }}</td>
    </template>
  </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>                        
        </v-card>
      </v-dialog>       
</template>

<script>

import _ from 'lodash';

export default {
  name: 'recipeRegister',
  props: ['showRecipeRegister'],
  data () {
    return {
      recipe:{
        name:'',
        materials:[]
      },
      headers: [
        {
          text: 'Nome do Material',
          value: 'name'
        },
        { text: 'Quantididade', value: 'quantity' }
      ],      
      selectedMaterial:{},
      recipes:[],
      materials:[],
      valid:true,          
      showModal: false,
      select: null,      
    }
  },
  watch: {
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
          this.recipes.push({
            materialName: this.selectedMaterial.name,
            quantity: this.recipe.quantity
          });
          this.clearForm();
        }
      },
      clearForm(){
        this.$refs.form.reset();
      }
  },
  mounted () {
    this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
  }
}
</script>

