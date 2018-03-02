<template>
      <v-dialog v-model="showModal" persistent  max-width="500px">
        <v-card>
            <v-toolbar color="blue-grey darken-2" dark>
            <v-toolbar-title class="white--text">
              <v-icon dark>assignment</v-icon>
              Inclusão de Materiais</v-toolbar-title>
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
                label="Nome do Material"
                v-model="material.name"
                required
                ref="material.name"
                :rules="fieldRules.materialNameRules"
                counter="30"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field box dark
                label="Descrição do Material"
                v-model="material.description"
                ref="material.description"
                counter="50"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-select
                label="Categoria"
                placeholder="Selecione"
                :items="categories"
                item-text="name"
                item-value="id"
                return-object
                v-model="material.category"
                ref="material.category"
                :rules="fieldRules.materialCategoryRules"
                required
              ></v-select>
            </v-flex>
            <v-flex xs12>
                  <v-select
                    label="Unidades de Medida para o Material"
                    placeholder="Selecione"
                    :items="items"
                    item-text="description"
                    item-value="description"
                    chips
                    tags
                    return-object
                    v-model="material.unities"
                    ref="material.unities"
                    :rules="fieldRules.unitMaterialRules"
                    required
                  ></v-select>
            </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark  @click="saveMaterial()" color="orange darken-4" :disabled="!valid">
              Salvar
              </v-btn>            
            <v-btn dark  @click="showModal = false" color="orange darken-4">
              Cancelar</v-btn>
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
  name: 'materialsRegister',
  props: ['showMaterialsRegister','materialEditable'],
  data () {
    return {
      material:{},
      valid:true,
      categories:[],
      materials:[],
      fieldRules:{
        materialNameRules: [
          v => !!v || 'O nome do material é obrigatório',
          v => (v && v.length >= 5) || 'O nome do material deve ter no mínimo 5 caracteres',
          v => (v && v.length <= 30) || 'O nome do material deve ter no máximo 30 caracteres'
        ],
        materialCategoryRules:[
          (v) => !!v || 'Selecione a Categoria do Material'
        ],          
        unitMaterialRules:[
          (v) => v.length > 0 || 'Selecione ao menos uma Unidade de medida'
        ]          
      },                    
      showModal: false,
      items: [{description:'Gramas',type:'g'},
              {description:'Miligramas',type:'mg'},
              {description:'Quilogramas',type:'kg'},
              {description:'Litros',type:'l'},
              {description:'Mililitros',type:'ml'}],      
    }
  },
  watch: {
      showMaterialsRegister: function(show){
          this.showModal = show;
          this.clearForm();
          this.getMaterials();
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal);
      },
      materialEditable:function(material){
        this.material = material;
      }      
  },
  mounted(){
    this.getCategpries();
    this.getMaterials();
  },
  methods: {
      getCategpries(){
         this.categories = JSON.parse(this.$localStorage.get('categories'));
      },
      actvModal(showModal){
          this.showModal = showModal;
      },
      saveMaterial(){
        if (!this.material.id && this.$refs.form.validate()) {
          var guid = _guid.create();
          this.material.id =guid; 
          this.materials.push(_.clone(this.material));         
        }else if(this.material.id && this.$refs.form.validate()){
          this.updateMaterial(this.material);
        }
        else {
          return;
        }

        this.persistMaterials();
        this.clearForm();
        this.$parent.$emit('materialObject');        
        this.showModal = false;        
      },
      persistMaterials(){
        this.$localStorage.set('materials', JSON.stringify(this.materials));
      },
      updateMaterial(material){
        var indexArray = _.findIndex(this.materials, function(o) { return o.id == material.id; });
        this.materials[indexArray] = material;
      },      
      clearForm(){
        this.material = {};
        this.$refs.form.reset();
      },
      getMaterials(){
        this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
      },      
  }
}
</script>

