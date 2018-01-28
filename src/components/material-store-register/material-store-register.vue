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
            <v-flex xs12 sm5>
              <v-text-field
                label="Quantidade Embalagem"
                v-model="material.quantity"
                ref="material.quantity"
                counter="5"
                required
              ></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm5>
              <v-text-field
                label="Quantidade Unitária"
                v-model="material.unitWeight"
                ref="material.unitWeight"
                counter="5"
                required
              ></v-text-field>
            </v-flex>            
            <v-flex xs12 sm5>
                <v-select
                    label="Unid. Medida"
                    placeholder="Selecione"
                    :items.sync="selectedMaterial.unities"
                    item-text="description"
                    v-model="material.unit"
                    ref="material.unit"
                    persistent-hint
                    required
                ></v-select>
            </v-flex>
            <v-spacer></v-spacer>                       
            <v-flex xs12 sm5>
              <v-text-field
                label="Preço Total"
                required
                prefix="R$"
                mask="#.###,##"
                placeholder="00,00"
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
            <v-btn dark small @click="saveMaterialStore()" color="orange darken-4" :disabled="!valid">
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
      materialStore:[],
      recipe:{},
      selectedCategory:{},
      materials:[],
      unities:[],
      valid:true,
      categories:[],
      showModal: false,
      select: null      
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
      selectedMaterial:function(selectedMaterial){
        this.unities
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
      saveMaterialStore(){
        if (this.$refs.form.validate()) {
          this.materialStore.push({
            materialId: this.selectedMaterial.id,
            categoryId: this.selectedCategory.id,
            totalQuantity: this.material.quantity,
            unitWeight: this.material.unitWeight,
            unit:this.material.unit,
            totalPrice: this.material.price
          });
          this.$localStorage.set('materialStore', JSON.stringify(this.materialStore));
          this.$parent.$emit('materialObject', _.clone(this.material));
          this.clearForm();
          this.showModal = false;
        }
      },
      unitConversion(){

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
