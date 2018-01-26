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
            <v-btn dark small color="orange darken-4" @click="openModal()">
                <v-icon dark>assignment</v-icon>
                Inclusão de Materiais
            </v-btn>          
        </v-toolbar>
  <v-data-table
      v-bind:headers="headers"
      :items="materials"
      v-bind:search="search"
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-right">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.description }}</td>
      <td class="text-xs-right">{{ props.item.category.name }}</td>
      <td class="text-xs-right">{{ props.item.quantity }}</td>
      <td class="text-xs-right">
        <v-chip x-small v-for="item in props.item.unities" v-bind:key="item.name">{{ item }}</v-chip>
      </td>
      <td class="text-xs-right">{{ props.item.price }}</td>
    </template>
  </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
  <materials-register :show-materials-register.sync="showMaterialsRegister"></materials-register> 
</div>
</template>
<script>
import materialsRegister from '@/components/material-register/material-register';
export default {
  name: 'MaterialList',
  components: {
      materialsRegister
  },
data () {
      return {
          showMaterialsRegister: false,
          search: '',
        headers: [
          {
            text: 'Nome do Material',
            value: 'name'
          },
          { text: 'Descrição do Material', value: 'description' },
          { text: 'Categoria', value: 'category' },
          { text: 'Quantidade', value: 'quantity' },
          { text: 'Unid. Medida', value: 'unit' },
          { text: 'Preço', value: 'price' }
        ],
        materials:[],
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
          this.showMaterialsRegister = true;
      }
  },
    mounted () {
      this.$on('showModal',function (show) {
          this.showMaterialsRegister = show;
      }); 

      this.$on('materialObject',function (materialObject) {
          this.materials.push(materialObject);
           this.$localStorage.set('materials', JSON.stringify(this.materials));
          console.log(this.materials);
      });
      
      this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
  },  
}
</script>