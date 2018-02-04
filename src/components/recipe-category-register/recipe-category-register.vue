<template>
      <v-dialog v-model="showModal" persistent  max-width="400px">
        <v-card>
            <v-toolbar color="deep-orange darken-3" dark>
              <v-icon dark>grain</v-icon>
            <v-toolbar-title class="white--text">Inclusão de Categorias da Receita</v-toolbar-title>
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
                          label="Nome da Categoria de Receita"
                          v-model="recipeCategory.name"
                          required
                          ref="recipeCategory.name"
                          counter="30"
                        ></v-text-field>
                      </v-flex>
                      </v-layout>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn dark small @click="showModal = false" color="indigo darken-4">
                        <v-icon dark>replay</v-icon>
                        Fechar</v-btn>
                      <v-btn dark small @click="saveRecipeCategory()" color="indigo darken-4" :disabled="!valid">
                        <v-icon dark>done</v-icon>
                        Salvar
                        </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-form>
            </v-layout>                        
        </v-card>
      </v-dialog>       
</template>

<script>

import _ from 'lodash';
import _guid from 'Guid';

export default {
  name: 'recipeCategoryRegister',
  props: ['showRecipeCategoryRegister'],
  data () {
    return {
      recipeCategory:{
        id:'',
        name:'',
        description:''
      },
      recipeCategories:[],
      valid:true,          
      showModal: false,
      select: null,      
    }
  },
  watch: {
      showRecipeCategoryRegister: function(show){
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
      saveRecipeCategory(){
        if (this.$refs.form.validate()) {
          var guid = _guid.create();
          this.recipeCategory.id =guid;
          this.recipeCategories.push(_.clone(this.recipeCategory));
          this.$localStorage.set('recipeCategories', JSON.stringify(this.recipeCategories));
          this.$parent.$emit('categoryObject', _.clone(this.recipeCategories));
          this.clearForm();
          this.showModal = false;
        }
      },
      clearForm(){
        this.$refs.form.reset();
      }
  }
}
</script>

