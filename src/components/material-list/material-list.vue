<template>
<div>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar color="blue-grey darken-2" dark>
          <v-toolbar-title>
            <v-icon>assignment</v-icon>
            Materiais
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
          <v-alert type="warning" dismissible v-model="deleteMaterial">
            Não é possível excluir o material. Existe estoque associado ao material selecionado.
          </v-alert>          
  <v-data-table
      v-bind:headers="headers"
      :items="materials"
      v-bind:search="search"
      class="elevation-1"
      :loading="showLoader"
      no-data-text="Não há dados cadastrados"
      no-results-text="Dados não encontrados"
      rows-per-page-text="Itens por página"      
    >
    <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ getCategoryById(props.item.category) }}</td>
        <td class="text-xs-right">
          <v-chip x-small v-for="item in props.item.unities" v-bind:key="item.description">{{ item.description }}</v-chip>
        </td>
        <td class="text-xs-right">
          <v-btn fab dark  small color="green" @click="editMaterial(props.item)">
            <v-icon dark>mode_edit</v-icon>
          </v-btn>                  
        </td>                 
        <td class="text-xs-right">
          <v-btn fab dark  small color="red" @click="removeMaterial(props.item)">
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
import {db} from '@/components/shared/data-config/data-config.js';

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
          {text: 'Nome do Material',value: 'name', align: 'left'},
          {text: 'Descrição do Material', value: 'description' , align: 'left'},
          {text: 'Categoria', value: 'category' , align: 'left'},
          {text: 'Unid. Medida', value: 'unit' , align: 'center'},
          {text: 'Editar', value: 'edit' },
          {text: 'Excluir', value: 'delete' }
        ],
        materials:[],
        showLoader:true,
        materialsStore:[],
        deleteMaterial:false
      }
},
  methods: {
      openModal(){
        this.showMaterialsRegister = true;
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
           () => this.getMaterials()
        );
      },
      getCategoryById(id){
        return _.find(this.categories,function(category){ return category['.key'] == id }).name;
      },
      getMaterialsStore(){
        return this.$localStorage.get('materialStore')? JSON.parse(this.$localStorage.get('materialStore')) : this.materialsStore;
      },      
      editMaterial(material){
        this.materialEditable = _.clone(material);
        this.showMaterialsRegister = true;
      },
      removeMaterial(material){
        if(this.verifyRelationship(material)){
          this.deleteMaterial = true;
          return;
        }
        
        this.$firebaseRefs.materials.child(material['.key']).remove();
      },  
      verifyRelationship(material){
        return _.size(_.filter(this.getMaterialsStore(),function(item){
          return item.materialId == material['.key'];
        })) > 0;
      },                  
  },
    mounted () {
      this.$on('showModal',function (show) {
          this.showMaterialsRegister = show;
      }); 
      
      this.getCategories();
  },  
}
</script>