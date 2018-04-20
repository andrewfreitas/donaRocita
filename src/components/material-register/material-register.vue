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
                item-value=".key"
                v-model="materialCategory"
                ref="materialCategory"
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
              <v-flex xs12 sm4>
                <v-text-field
                  label="Preço Unitário"
                  required
                  prefix="R$"
                  v-model="material.price"
                  ref="material.price"
                  persistent-hint="true"
                  hint="Preço Unitário do produto">
                </v-text-field>               
                <money style="display:none" v-model="material.price" v-bind="money"></money>    
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm7>              
                  <v-select
                    label="Preço Unitário por "
                    placeholder="Selecione"
                    :items="priceUnities"
                    item-text="description"
                    item-value="description"
                    return-object
                    v-model="material.unitPrice"
                    ref="material.unitPrice"
                    :rules="fieldRules.materialUnitPriceRules"
                    hint="Unidade de medida relacionada ao preço unitário"
                    persistent-hint="true"
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
import numeral from 'numeral';
import {db} from '@/components/shared/data-config/data-config.js';
import {VMoney} from 'v-money';

export default {
  name: 'materialsRegister',
  props: ['showMaterialsRegister','materialEditable'],
  data () {
    return {
      row:1,
      money: {
        decimal: ',',
        thousands: '.',
        precision: 2,
        masked: true /* doesn't work with directive */
      },      
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
        ],
        materialUnitPriceRules:[
          (v) => !!v || 'Selecione a Unid. Medida referente ao Preço Unitário'
        ],                   
      },                    
      showModal: false,
      items: [{description:'Gramas',type:'g', ref:'mg'},
              {description:'Miligramas',type:'mg', ref:'mg'},
              {description:'Quilogramas',type:'kg', ref:'mg'},
              {description:'Litros',type:'l', ref:'ml'},
              {description:'Mililitros',type:'ml', ref:'ml'}], 
      priceUnities: [{description:'Grama',type:'g', ref:'mg'},
              {description:'Miligrama',type:'mg', ref:'mg'},
              {description:'Quilograma',type:'kg', ref:'mg'},
              {description:'Litro',type:'l', ref:'ml'},
              {description:'Mililitro',type:'ml', ref:'ml'}],                    
    }
  },
  watch: {
      showMaterialsRegister: function(show){
          this.showModal = show;
          this.clearForm();
          this.getCategories();
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal);
      },
      materialEditable:function(material){
        this.material = material;
        this.materialCategory = this.getCategoryById(material.category);
      }      
  },
  mounted(){
    this.getCategories();
  },
  methods: {
      getMaterials(){
         this.$bindAsArray(
           'materials',
           db.ref('rcita/materials'),
           null,
           ()=> this.showLoader = false
        );
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
        return _.find(this.categories,function(c) { return c['.key'] == id});
      },     
      actvModal(showModal){
          this.showModal = showModal;
      },
      saveMaterial(){
        
        this.material.category = this.materialCategory['.key'];
        this.material.formattedPrice =  numeral(numeral(this.material.price)._value).format('$ 0,0.00');

        if (!this.material['.key']) {
          this.$firebaseRefs.materials.push(_.clone(this.material));                   
        }else{
          this.updateMaterial(this.material);
        }

        this.clearForm();        
        this.showModal = false;        
      },
      updateMaterial(material){
        const copyObj = _.clone(material);
        delete copyObj['.key'];
        this.$firebaseRefs.materials.child(material['.key']).set(copyObj);
      },      
      clearForm(){
        this.material = {};
        this.categories = [];
        this.$refs.form.reset();
      }  
  },
  beforeCreate () {
    numeral.register('locale', 'pt-BR', {
        delimiters: {
            thousands: '.',
            decimal: ','
        },
        abbreviations: {
            thousand: 'mil',
            million: 'milhões',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            return 'º';
        },
        currency: {
            symbol: 'R$'
        }
    });
    numeral.locale('pt-BR');
  }  
}
</script>

