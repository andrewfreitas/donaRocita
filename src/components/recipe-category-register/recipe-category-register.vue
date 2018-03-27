<template>
      <v-dialog v-model="showModal" persistent  max-width="400px">
        <v-card>
            <v-toolbar color="blue-grey darken-2" dark>
            <v-toolbar-title class="white--text">
              <v-icon dark>grain</v-icon>
              Inclusão de Categorias da Receita</v-toolbar-title>
            </v-toolbar>
            <v-spacer></v-spacer>
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-flex shrink>
                  <v-card ref="form">
                    <v-card-text>
                      <v-flex shrink>
                        <v-text-field box dark
                          label="Nome da Categoria de Receita"
                          v-model="recipeCategory.name"
                          hint="Este campo separa as receitas por tipo, por exemplo BRIGADEIROS DE FRUTAS"
                          required
                          :rules="recipeCategoryRules"
                          ref="recipeCategory.name"
                          counter="30"
                        ></v-text-field>
                      </v-flex>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn dark @click="saveRecipeCategory()" color="orange darken-4" :disabled="!valid">
                        Salvar
                        </v-btn>                      
                      <v-btn dark @click="showModal = false" color="orange darken-4">
                        Cancelar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-form>                      
        </v-card>
      </v-dialog>       
</template>

<script>

import _ from 'lodash';
import _guid from 'Guid';
import {db} from '@/components/shared/data-config/data-config.js';

export default {
  name: 'recipeCategoryRegister',
  props: ['showRecipeCategoryRegister','recipeCategoryEditable'],
  data () {
    return {
      recipeCategory:{},
      recipeCategoryRules: [
        v => !!v || 'O nome da categoria de receita é obrigatório',
        v => (v && v.length >= 5) || 'O nome da categoria de receita deve ter no mínimo 5 caracteres',
        v => (v && v.length <= 30) || 'O nome da categoria de receita deve ter no máximo 30 caracteres'
      ],      
      recipeCategories:[],
      valid:true,          
      showModal: false,
      select: null,      
    }
  },
  watch: {
      showRecipeCategoryRegister: function(show){
          this.showModal = show;
          this.clearForm();
          this.getRecipeCategories();
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal);
      },
      recipeCategoryEditable:function(id){
        this.recipeCategory = _.find(this.recipeCategories,function(r){return r['.key'] == id});
      }         
  },
  methods: {
      getRecipeCategories(){
          this.$bindAsArray(
            'recipeCategories',
            db.ref('rcita/recipeCategories')
        );
      },      
      saveRecipeCategory(){

        if (!this.recipeCategory['.key']) {
          this.$firebaseRefs.recipeCategories.push(_.clone(this.recipeCategory));                   
        }else{
          this.updateRecipeCategory(this.recipeCategory);
        }

        this.clearForm();
        this.showModal = false;  

      },
      updateRecipeCategory(recipeCategory){
        const copyObj = _.clone(recipeCategory);
        delete copyObj['.key'];
        this.$firebaseRefs.recipeCategories.child(recipeCategory['.key']).set(copyObj);
      },       
      clearForm(){
        this.recipeCategory ={};
        this.$refs.form.reset();
      }
  }
}
</script>

