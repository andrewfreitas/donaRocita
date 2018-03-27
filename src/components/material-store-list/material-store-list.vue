<template>
<div>
  <v-layout row>
    <v-flex xs12 sm11>
      <v-card>
        <v-toolbar color="blue-grey darken-2" dark>
          <v-toolbar-title>
            <v-icon>line_weight</v-icon>
            Estoque de Materiais
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
  <v-alert type="success" dismissible v-model="deleteMaterialStore">
    Não é possível excluir a categoria. Existem receitas cadastradas utilizando o estoque do material existente.
  </v-alert>         
  <v-data-table
      v-bind:headers="headers"
      :items="materialsStore"
      v-bind:search="search"
      :loading="showLoader"
      class="elevation-1"
      no-data-text="Não há dados cadastrados"
      no-results-text="Dados não encontrados"
      rows-per-page-text="Itens por página"      
    >
    <template slot="items" slot-scope="props">
      <!-- <td class="text-xs-right">{{ props.item.category.name }}</td> -->
      <td class="text-xs-right">{{ getMaterialById(props.item.material).name }}</td>
      <td class="text-xs-right">{{ props.item.unitWeight }}</td>
      <td class="text-xs-right">{{ props.item.quantity }}</td>
      <td class="text-xs-right">{{ props.item.unit.description }}</td>
      <td class="text-xs-right">{{ props.item.price }}</td>
      <td class="text-xs-right">
        <v-btn fab dark  small color="green" @click="editMaterialStore(props.item)">
          <v-icon dark>mode_edit</v-icon>
        </v-btn>                  
      </td>                 
      <td class="text-xs-right">
        <v-btn fab dark  small color="red" @click="removeMaterialStore(props.item)">
          <v-icon dark>remove</v-icon>
        </v-btn>                  
      </td>       
    </template>
  </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
  <material-store-register :show-material-register.sync="showMaterialStoreRegister" :material-store-editable="materialStoreEditable"></material-store-register> 
</div>
</template>
<script>
import materialStoreRegister from '@/components/material-store-register/material-store-register';
import {db} from '@/components/shared/data-config/data-config.js';

export default {
  name: 'MaterialStoreList',
  components: {
      materialStoreRegister
  },
data () {
      return {
          showMaterialStoreRegister: false,
          search: '',
        headers: [
          // { text: 'Categoria',value: 'category'},
          { text: 'Descrição Material', value: 'unitWeight' },
          { text: 'Qtd. Embalagem', value: 'unitWeight' },
          { text: 'Qtd Unitária', value: 'quantity' },
          { text: 'Unid. de Medida', value: 'unity' },
          { text: 'Preço', value: 'totalPrice' },
          { text: 'Editar', value: 'edit' },
          { text: 'Excluir', value: 'delete' }
        ],
        categories:[],
        materialsStore:[],
        recipes:[],
        materialStoreEditable:{},
        deleteMaterialStore:false,
        showLoader:true
      }
},
  methods: {
      openModal(){
          this.showMaterialStoreRegister = true;
      },
      editMaterialStore(materialStore){
        this.materialStoreEditable = materialStore['.key'];
        this.showMaterialStoreRegister = true;
      },
      removeMaterialStore(materialStore){
        if(this.verifyRelationship(materialStore)){
          this.deleteMaterialStore = true;
          return;
        }

        this.$firebaseRefs.materialsStore.child(materialStore['.key']).remove();
      },
      verifyRelationship(material){
        return _.size(_.filter(this.getRecipes(),function(recipe){
          return _.filter(recipe.items,function(item){
            return item.material['.key'] == material.id;
          });
        })) > 0;
      },
      getRecipes(){
        return this.$localStorage.get('recipes')? JSON.parse(this.$localStorage.get('recipes')) : this.recipes;
      },
      getCategories(){
          this.$bindAsArray(
            'categories',
            db.ref('rcita/categories'),
            null,
            () => this.getMaterials()
        );
      },
      getMaterials(){
         this.$bindAsArray(
           'materials',
           db.ref('rcita/materials'),
           null,
           () => this.getMaterialsStore()
        );
      },
      getMaterialsStore(){
          this.$bindAsArray(
            'materialsStore',
            db.ref('rcita/materialsStore'),
            null,
            ()=>this.showLoader = false
        );
      },
      getMaterialById(material){
        return _.find(this.materials,function(m){return m['.key'] == material});
      }                    
  },
    mounted () {
      this.$on('showModal',function (show) {
          this.showMaterialStoreRegister = show;
      }); 
      
      this.getCategories();
  },  
}
</script>