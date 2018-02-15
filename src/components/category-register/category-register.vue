<template>
  <v-dialog v-model="showModal" persistent  max-width="500px">
    <v-card>
      <v-toolbar color="deep-orange darken-3" dark>
        <v-icon dark>web</v-icon>
        <v-toolbar-title class="white--text">Inclusão de Categorias</v-toolbar-title>
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
                <v-btn dark small @click="showModal = false" color="deep-orange darken-3">
                  <v-icon dark>replay</v-icon>
                  Fechar</v-btn>
                <v-btn dark small @click="saveCategory()" color="deep-orange darken-3" :disabled="!valid">
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
      valid:true,          
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
        this.category = category;
      }
  },
  methods: {
      actvModal(showModal){
          this.showModal = showModal;
      },
      saveCategory(){

        if (!this.category.id && this.$refs.form.validate()) {
          var guid = _guid.create();
          this.category.id =guid;
          this.categories.push(_.clone(this.category));
        }else if(this.category.id && this.$refs.form.validate()){
          this.updateCategory(this.category);
        }
        else{
          return;
        }

        this.persistCategories();
        this.clearForm();
        this.$parent.$emit('categoryObject', _.clone(this.category));
        this.showModal = false;        
      },
      updateCategory(category){
        var indexArray = _.findIndex(this.categories, function(o) { return o.id == category.id; });
        this.categories[indexArray] = category;
      },
      persistCategories(){
        this.$localStorage.set('categories', JSON.stringify(this.categories));
      },
      getCategories(){
        this.categories = this.$localStorage.get('categories')? JSON.parse(this.$localStorage.get('categories')) : this.categories;
      },      
      clearForm(){
        this.category = {};
      }
  },
  mounted () {
      this.getCategories();
  }  
}
</script>

