<template>
      <v-dialog v-model="showModal" persistent  max-width="500px">
        <v-card>
            <v-toolbar color="grey darken-2" dark>
              <v-icon dark>assignment</v-icon>
            <v-toolbar-title class="white--text">Estoque de Materiais</v-toolbar-title>
            </v-toolbar>
            <v-spacer></v-spacer>
  <v-layout justify-center>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-flex xs12>
        <v-card ref="form">
          <v-card-text>
            <v-layout row wrap>
            <v-flex xs12>
                  <v-select
                    label="Categorias"
                    placeholder="Selecione"
                    :items="categories"
                    item-text="name"
                    v-model="selectedCategory"
                    ref="recipe.categories"
                    required
                    @change="getMaterials()"
                  ></v-select>
            </v-flex>
            <v-flex xs12>
                  <v-select
                    label="Materiais Disponíveis"
                    placeholder="Selecione"
                    :items="materials"
                    item-text="name"
                    v-model="selectedMaterial"
                    ref="recipe.materials"
                    required
                  ></v-select>
            </v-flex>                      
            <v-flex xs12 sm2>
              <v-text-field
                label="Quantidade"
                :rules="quantityMaterialRules"
                v-model="material.quantity"
                ref="material.quantity"
                counter="5"
                required
              ></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm2>
              <v-text-field
                label="Quantidade Unitária"
                :rules="quantityMaterialRules"
                v-model="material.quantity"
                ref="material.quantity"
                counter="5"
                required
              ></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>            
            <v-flex xs12 sm3>
                <v-select
                    label="Unid. Medida"
                    placeholder="Selecione"
                    :items.sync="items"
                    v-model="recipe.unit"
                    ref="recipe.unit"
                    persistent-hint
                    required
                ></v-select>
            </v-flex>
            <v-spacer></v-spacer>                       
            <v-flex xs12 sm2>
              <v-text-field
                label="Preço"
                required
                prefix="R$"
                mask="#.###,##"
                placeholder="00,00"
                :rules="priceMaterialRules"
                v-model="material.price"
                ref="material.price"
              ></v-text-field>
            </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark small @click="showModal = false" color="orange darken-4">
              <v-icon dark>replay</v-icon>
              Fechar</v-btn>
            <v-btn dark small @click="saveMaterial()" color="orange darken-4" :disabled="!valid">
              <v-icon dark>done</v-icon>
              Salvar
              </v-btn>
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
  name: 'MaterialStoreRegister',
  props: ['showMaterialRegister'],
  data () {
    return {
      material:{
        id:'',
        name:'',
        category:'',
        description:'',
        quantity:'',
        unities:'',
        price:'',
      },
      selectedMaterial:{},
      recipe:{},
      selectedCategory:{},
      materials:[],
      items: [
        'Gramas(Gr)',
        'Miligramas(Mg)',
        'Quilogramas(Kg)',
        'Litros(Lt)',
        'Mililitros(Ml)',
      ],  
      valid:true,
      categories:[],
      nameMaterialRules: [
        (v) => !! this.material.name || 'Campo obrigatório',
        (v) => !Number(this.material.name) || 'Nome inválido',
        (v) => v.length <= 30 || 'Máximo de 30 caracteres'
      ],
      descriptionMaterialRules: [
        (v) => !! this.material.description || 'Campo obrigatório',
        (v) => !Number(this.material.description) || 'Descrição inválida',
        (v) => v.length <= 50 || 'Máximo de 50 caracteres'
      ],
      unitMaterialRules:[
        (v) => v.length > 0 || 'Campo obrigatório'
      ],
      priceMaterialRules:[
        (v) => v.length > 0 || 'Campo obrigatório'
      ],
      quantityMaterialRules:[
        (v) => this.material.quantity.length > 0 || 'Campo obrigatório'
      ],               
      showModal: false,
      select: null,
      items: [
        'Gramas(Gr)',
        'Miligramas(Mg)',
        'Quilogramas(Kg)',
        'Litros(Lt)',
        'Mililitros(Ml)',
      ],      
    }
  },
  watch: {
      selectedCategory: function(category){
        this.materials = _.filter(this.materials,function(material){ 
          return material.category.id == category.id;
        });       
      },         
      showMaterialRegister: function(show){
          this.showModal = show;
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal);
      }
  },
  mounted(){
    this.categories = JSON.parse(this.$localStorage.get('categories'));
  },
  methods: {
      actvModal(showModal){
          this.showModal = showModal;
      },
      saveMaterial(){
        if (this.$refs.form.validate()) {
          var guid = _guid.create();
          this.material.id =guid;
          this.$parent.$emit('materialObject', _.clone(this.material));
          this.clearForm();
          this.showModal = false;
        }
      },
      getMaterials(){
        this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
      },      
      addCategory(category){
        this.categories.push(category);
      },
      clearForm(){
        this.$refs.form.reset();
      }
  }
}
</script>

