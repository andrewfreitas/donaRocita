<template>
<div>
        <div class="ui container">
        <h2 class="ui dividing header"></h2>                
    </div>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-toolbar color="indigo darken-4" dark>
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
            <v-btn dark small color="indigo" @click="openModal()">
                <v-icon dark>web</v-icon>
                Inclusão de Categoria
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
  <category-register :show-category-register.sync="showCategoryRegister"></category-register> 
</div>
</template>
<script>
import categoryRegister from '@/components/category-register/category-register';
export default {
  name: 'MaterialList',
  components: {
      categoryRegister
  },
data () {
      return {
          showCategoryRegister: false,
          search: '',
        headers: [
          {
            text: 'Nome do Material',
            value: 'name'
          },
          { text: 'Descrição do Material', value: 'description' }
        ],
        categories:[],
        items: [
          {
            value: false,
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0
          },
          {
            value: false,
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3
          }


        ]
      }
},
  methods: {
      openModal(){
          this.showCategoryRegister = true;
      }
  },
    mounted () {
      this.$on('showModal',function (show) {
          this.showCategoryRegister = show;
      }); 

      this.$on('categoryObject',function (categoryObject) {
          this.categories.push(categoryObject);
      });         
  },  
}
</script>