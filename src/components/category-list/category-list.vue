<template>
<div>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-toolbar color="blue-grey darken-2" dark>
            <v-toolbar-title>
              <v-icon>dashboard</v-icon>
              Categorias de Materiais
              <v-btn fab dark small color="amber darken-4" @click="openModal()">
                <v-icon dark>add</v-icon>
              </v-btn>                 
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              append-icon="search"
              label="Buscar"
              single-line
              hide-details
              v-model="search"
            ></v-text-field>   
          </v-toolbar>
          <v-alert type="warning" dismissible v-model="deleteCategory">
            Não é possível excluir a categoria. Existem materiais cadastrados com a categoria existente.
          </v-alert>             
          <v-data-table
              v-bind:headers="headers"
              :items="categories"
              v-bind:search="search"
              class="elevation-1"
              :loading="showLoader"
              no-data-text="Não há dados cadastrados"
              no-results-text="Dados não encontrados"
              rows-per-page-text="Itens por página"
            >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.name }}</td>
              <!-- <td class="text-xs-left">{{ props.item.description }}</td> -->
              <td class="text-xs-right">
                <v-btn fab dark  small color="green" @click="editCategory(props.item)">
                  <v-icon dark>mode_edit</v-icon>
                </v-btn>                  
              </td>                 
              <td class="text-xs-right">
                <v-btn fab dark  small color="red" @click="removeCategory(props.item)">
                  <v-icon dark>remove</v-icon>
                </v-btn>                  
              </td>              
            </template>
          </v-data-table>       
        </v-card>
      </v-flex>
    </v-layout>
    <category-register :category-register.sync="categoryRegister" :category-editable.sync="categoryEditable"></category-register> 
    <!-- {{users}} -->
  </div>
</template>
<script>

import categoryRegister from '@/components/category-register/category-register';
import {db} from '@/components/shared/data-config/data-config.js';

export default {
  name: 'MaterialList',
  components: {
      categoryRegister
  },
  data () {
    return {
      categoryRegister: {},
      showPopMessage:false,
      search: '',   
      headers: [
        {text: 'Nome da Categoria', value: 'name', align: 'left'},
        // {text: 'Descrição da Categoria', value: 'description' , align: 'left'},
        {text: 'Editar Categoria', value: 'delete' },
        {text: 'Excluir Categoria', value: 'delete' }
      ],
      showLoader:true,
      categories:[],
      categoryEditable:{},
      deleteCategory:false
    }
  },
  methods: {
    openModal(){
      this.categoryRegister = {
        isEditing:false,
        categoryEditable:null,
        showModal:true
      }
    },
    getMaterials(){
        this.$bindAsArray(
          'materials',
          db.ref('rcita/materials'),
          null,
          ()=> this.showLoader = false
      );
      //this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
    },    
    getCategories(){
        this.$bindAsArray(
          'categories',
          db.ref('rcita/categories'),
          null,
          ()=> this.showLoader = false
      );
    },
    editCategory(category){
      this.categoryRegister = {
        isEditing:true,
        categoryEditable:category,
        showModal:true
      }
    },
    removeCategory(category){
      if(this.verifyRelationship(category)){
        this.deleteCategory = true;
        return;
      }

      this.$firebaseRefs.categories.child(category['.key']).remove();
    },
    verifyRelationship(category){
      return _.size(_.filter(this.materials,function(item){
        return item.category == category['.key'];
      })) > 0;
    }
  },
  mounted () {

      this.$on('showModal',function (show) {
        this.showCategoryRegister = show;
      }); 

      this.getCategories();
      this.getMaterials();
  },  
}
</script>