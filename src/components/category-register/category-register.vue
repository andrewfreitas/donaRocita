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
                ref="category.name"
                counter="30"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field box dark
                label="Descrição da Categoria"
                v-model="category.description"
                ref="category.description"
                counter="50"
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
  props: ['showCategoryRegister'],
  data () {
    return {
      category:{
        id:'',
        name:'',
        description:''
      },
      valid:true,          
      showModal: false,
      select: null,      
    }
  },
  watch: {
      showCategoryRegister: function(show){
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
      saveCategory(){
        if (this.$refs.form.validate()) {
          var guid = _guid.create();
          this.category.id =guid;
          this.$parent.$emit('categoryObject', _.clone(this.category));
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

