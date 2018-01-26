<template>
<div>
        <div class="ui container">
        <h2 class="ui dividing header"></h2>                
    </div>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-toolbar color="grey" dark>
          <v-toolbar-title>Dona Rosita</v-toolbar-title>
          <v-spacer></v-spacer>
                <v-text-field
        append-icon="search"
        label="Buscar"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
      <v-spacer></v-spacer>
            <v-btn dark small color="brown darken-2" @click="openModal()">
                <v-icon dark>web</v-icon>
                Estoque de Materiais
            </v-btn>          
        </v-toolbar>
  <v-data-table
      v-bind:headers="headers"
      :items="categories"
      v-bind:search="search"
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.description }}</td>
    </template>
  </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
  <material-store-register :show-material-register.sync="showMaterialStoreRegister"></material-store-register> 
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
          {
            text: 'Nome do Material',
            value: 'name'
          },
          { text: 'Descrição do Material', value: 'description' }
        ],
        categories:[]
      }
},
  methods: {
      openModal(){
          this.showMaterialStoreRegister = true;
      }
  },
    mounted () {
      this.$on('showModal',function (show) {
          this.showMaterialStoreRegister = show;
      }); 

      this.$on('categoryObject',function (categoryObject) {
          this.categories.push(categoryObject);
          this.$localStorage.set('categories', JSON.stringify(this.categories));
      });
      
      this.categories = this.$localStorage.get('categories')? JSON.parse(this.$localStorage.get('categories')) : this.categories;
  },  
}
</script>