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
                Estoque de Materiais
            </v-btn>          
        </v-toolbar>
  <v-alert type="success" dismissible v-model="deleteMaterialStore">
    Não é possível excluir a categoria. Existem receitas cadastradas utilizando o estoque do material existente.
  </v-alert>         
  <v-data-table
      v-bind:headers="headers"
      :items="materialsStore"
      v-bind:search="search"
      class="elevation-1"
      no-data-text="Não há dados cadastrados"
      no-results-text="Dados não encontrados"
      rows-per-page-text="Itens por página"      
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-right">{{ props.item.category.name }}</td>
      <td class="text-xs-right">{{ props.item.material.description }}</td>
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
          { text: 'Categoria',value: 'category'},
          { text: 'Descrição do Material', value: 'unitWeight' },
          { text: 'Qtd da Embalagem', value: 'unitWeight' },
          { text: 'Qtd Unitária', value: 'quantity' },
          { text: 'Unidade de Medida', value: 'unity' },
          { text: 'Preço Total', value: 'totalPrice' },
          { text: 'Editar', value: 'edit' },
          { text: 'Excluir', value: 'delete' }
        ],
        categories:[],
        materialsStore:[],
        recipes:[],
        materialStoreEditable:{},
        deleteMaterialStore:false
      }
},
  methods: {
      openModal(){
          this.showMaterialStoreRegister = true;
      },
      getStore(){
        this.materialsStore = this.$localStorage.get('materialStore')? JSON.parse(this.$localStorage.get('materialStore')) : this.materialsStore;
      },
      editMaterialStore(materialStore){
        this.materialStoreEditable = materialStore;
        this.showMaterialStoreRegister = true;
      },
      removeMaterialStore(materialStore){
        if(!this.verifyRelationship(materialStore)){
          this.materialsStore = _.remove(this.materialsStore, function(item) {
            return item.id != materialStore.id;
          });

          this.persistMaterialStore();
        }else{
          this.deleteMaterialStore = true;
        }
      },
      verifyRelationship(material){
        return _.size(_.filter(this.getRecipes(),function(recipe){
          return _.filter(recipe.items,function(item){
            return item.material.id == material.id;
          });
        })) > 0;
      },
      persistMaterialStore(){
        this.$localStorage.set('materialStore', JSON.stringify(this.materialsStore));
      },
      getRecipes(){
        return this.$localStorage.get('recipes')? JSON.parse(this.$localStorage.get('recipes')) : this.recipes;
      }             
  },
    mounted () {
      this.$on('showModal',function (show) {
          this.showMaterialStoreRegister = show;
      }); 

      this.$on('materialStoreObject',function () {
        this.getStore();
      });
      
      this.getStore();
  },  
}
</script>