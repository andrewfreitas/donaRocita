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
                <v-icon dark>assignment</v-icon>
                Inclusão de Materiais
            </v-btn>          
        </v-toolbar>
  <v-data-table
      v-bind:headers="headers"
      :items="materials"
      v-bind:search="search"
      class="elevation-1"
      no-data-text="Não há dados cadastrados"
      no-results-text="Dados não encontrados"
      rows-per-page-text="Itens por página"      
    >
    <template slot="items" slot-scope="props">
        <td class="text-xs-right">{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.description }}</td>
        <td class="text-xs-right">{{ props.item.category.name }}</td>
        <td class="text-xs-right">
          <v-chip x-small v-for="item in props.item.unities" v-bind:key="item.description">{{ item.description }}</v-chip>
        </td>
        <td class="text-xs-right">
          <v-btn fab dark  small color="green" @click="editMaterial(props.item)">
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
  <materials-register :show-materials-register.sync="showMaterialsRegister" :material-editable="materialEditable"></materials-register> 
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
          materialEditable:{},
          search: '',
        headers: [
          {text: 'Nome do Material',value: 'name'},
          {text: 'Descrição do Material', value: 'description' },
          {text: 'Categoria', value: 'category' },
          {text: 'Unid. Medida', value: 'unit' },
          {text: 'Editar', value: 'edit' },
          {text: 'Excluir', value: 'delete' }
        ],
        materials:[]
      }
},
  methods: {
      openModal(){
        this.showMaterialsRegister = true;
      },
      getMaterials(){
        this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
      },
      editMaterial(material){
        this.materialEditable = _.clone(material);
        this.showMaterialsRegister = true;
      },      
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
      
      this.getMaterials();
  },  
}
</script>