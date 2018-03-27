<template>
  <v-dialog v-model="showModal" persistent  max-width="500px">
    <v-card>
      <v-toolbar color="blue-grey darken-2" dark>
        <v-toolbar-title class="white--text">
          <v-icon dark>dashboard</v-icon>
          Inclusão de Categorias</v-toolbar-title>
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
                    label="Nome da Categoria"
                    v-model="category.name"
                    required
                    :autofocus=true
                    ref="category.name"
                    counter="30"
                    hint="Escolha um nome para a categoria do produto"
                    :rules="fieldRules.categoryNameRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field box dark
                    label="Descrição da Categoria"
                    v-model="category.description"
                    ref="category.description"
                    counter="50"
                    hint="Descrição da categoria do produto"
                  ></v-text-field>
                </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark @click="saveCategory()" color="deep-orange darken-3" :disabled="!valid">
                  Salvar
                  </v-btn>                
                <v-btn dark @click="showModal = false" color="deep-orange darken-3">
                  Cancelar</v-btn>
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
import {db} from '@/components/shared/data-config/data-config.js';

export default {
  name: 'categoryRegister',
  props: ['showCategoryRegister','categoryEditable'],
  data () {
    return {
      fieldRules:{
        categoryNameRules: [
          v => !!v || 'Nome da categoria é obrigatório',
          v => (v && v.length >= 5) || 'O nome da categoria deve ter no mínimo 5 caracteres',
          v => (v && v.length <= 30) || 'O nome da categoria deve ter no máximo 30 caracteres'
        ]  
      },    
      category:{},
      categories:[],
      valid:false,          
      showModal: false   
    }
  },
  watch: {
      showCategoryRegister: function(show){
          this.showModal = show;
          this.clearForm();
          this.getCategories();
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal);
      },
      categoryEditable:function(category){
        this.category = _.find(this.categories,function(c){ return c['.key'] ==  category['.key']});
      }
  },
  methods: {
      actvModal(showModal){
          this.showModal = showModal;
      },
      saveCategory(){

        if (!this.category['.key']) {
          this.$firebaseRefs.categories.push(_.clone(this.category));                   
        }else{
          this.updateCategory(this.category);
        }

        this.clearForm();
        this.showModal = false;        
      },
      updateCategory(category){
        const copyObj = _.clone(category);
        delete copyObj['.key'];
        this.$firebaseRefs.categories.child(category['.key']).set(copyObj);        
      },
      getCategories(){
          this.$bindAsArray(
            'categories',
            db.ref('rcita/categories'),
            null,
            ()=> this.showLoader = false
        );
      },     
      clearForm(){
        this.category = {};
        this.$refs.form.reset();
      }
  }  
}
</script>

