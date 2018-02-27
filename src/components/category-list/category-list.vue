<template>
  <div>
    <div class="ui container">
    <h2 class="ui dividing header"></h2>                
  </div>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card>
          <v-toolbar color="deep-orange darken-3" dark>
            <v-toolbar-title>Dona Rocita</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              append-icon="search"
              label="Buscar"
              single-line
              hide-details
              v-model="search"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn dark small color="amber darken-4" @click="openModal()">
            <v-icon dark>web</v-icon>
            Inclusão de Categoria
            </v-btn>          
          </v-toolbar>
          <v-alert type="warning" dismissible v-model="deleteCategory">
            Não é possível excluir a categoria. Existem materiais cadastrados com a categoria existente.
          </v-alert>             
          <v-data-table
              v-bind:headers="headers"
              :items="categories"
              v-bind:search="search"
              class="elevation-1"
              no-data-text="Não há dados cadastrados"
              no-results-text="Dados não encontrados"
              rows-per-page-text="Itens por página"
            >
            <template slot="items" slot-scope="props">
              <td class="text-xs-right">{{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.description }}</td>
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
    <category-register :show-category-register.sync="showCategoryRegister" :category-editable="categoryEditable"></category-register> 
  </div>
</template>
<script>

import categoryRegister from '@/components/category-register/category-register';
// import dataConfig from '@/components/shared/data-config/data-config';
// import firebase from 'firebase';

//       var config = {
//         apiKey: "AIzaSyACO70rez3ZgOMQh-z6LVjsEV_ZNkbKV2o",
//         authDomain: "rocita-dc5e6.firebaseapp.com",
//         databaseURL: "https://rocita-dc5e6.firebaseio.com",
//         projectId: "rocita-dc5e6",
//         storageBucket: "rocita-dc5e6.appspot.com",
//         messagingSenderId: "721654080292"
//       };
//       var firebaseApp = firebase.initializeApp(config);
//       var db = firebaseApp.database();

export default {
  name: 'MaterialList',
  components: {
      categoryRegister
  },
  // mixins: [dataConfig],
  // firebase: function (){
  //   return{
  //     users: db.ref('categories/materials')
  //   }
  // },
  data () {
    return {
      showCategoryRegister: false,
      showPopMessage:false,
      search: '',   
      headers: [
        {text: 'Nome da Categoria', value: 'name'},
        {text: 'Descrição da Categoria', value: 'description' },
        {text: 'Editar Categoria', value: 'delete' },
        {text: 'Excluir Categoria', value: 'delete' }
      ],
      categories:[],
      categoryEditable:{},
      deleteCategory:false
    }
  },
  methods: {
    openModal(){
      this.showCategoryRegister = true;
      this.getCategories();
    },
    getCategories(){
      this.categories = this.$localStorage.get('categories')? JSON.parse(this.$localStorage.get('categories')) : this.categories;
    },
    editCategory(category){
      this.categoryEditable = category;
      this.showCategoryRegister = true;
    },
    removeCategory(category){
      if(!this.verifyRelationship(category)){
        this.categories = _.remove(this.categories, function(item) {
          return item.id != category.id;
        });

        this.persistCategories();
      }else{
        this.deleteCategory = true;
      }
    },
    verifyRelationship(category){
      return _.size(_.filter(this.getMaterials(),function(item){
        return item.category.id == category.id;
      })) > 0;
    },
    getMaterials(){
      return this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
    },
    persistCategories(){
      this.$localStorage.set('categories', JSON.stringify(this.categories));
    }    
  },
  mounted () {



      this.$on('showModal',function (show) {
        this.showCategoryRegister = show;
      }); 
      this.$on('categoryObject',function (categoryObject) {
        this.getCategories();
      });

      this.getCategories();
  },  
}
</script>