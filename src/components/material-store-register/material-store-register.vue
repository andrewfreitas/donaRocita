<template>
  <v-dialog v-model="showModal" persistent  max-width="500px">
    <v-card>
      <v-toolbar color="blue-grey darken-2" dark>
        <v-toolbar-title class="white--text">
          <v-icon dark>line_weight</v-icon>
          Estoque de Materiais</v-toolbar-title>
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
                      item-value="id"
                      return-object
                      :disabled = "isEditing"
                      v-model="materialStore.category"
                      ref="materialStore.category"
                      :rules="fieldRules.categoryRules"
                      required>
                    </v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      label="Materiais Disponíveis"
                      placeholder="Selecione"
                      :items="availableMaterials"
                      item-text="name"
                      item-value="id"
                      :disabled = "isEditing"
                      return-object
                      v-model="materialStore.material"
                      ref="materialStore.material"
                      :rules="fieldRules.materialRules"
                      required>
                    </v-select>
                  </v-flex>                      
                  <v-flex xs12 sm5>
                    <v-text-field
                      label="Quantidade Embalagem"
                      v-model="materialStore.unitWeight"
                      ref="materialStore.unitWeight"
                      :rules="fieldRules.unitWeightRules"
                      counter="4"
                      mask="####"
                      required>
                    </v-text-field>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm5>
                    <v-text-field
                      label="Quantidade Unitária"
                      v-model="materialStore.quantity"
                      ref="materialStore.quantity"
                      :rules="fieldRules.quantityRules"
                      counter="5"
                      mask="#####"
                      required>
                    </v-text-field>
                  </v-flex>           
                  <v-flex xs12 sm5>
                    <v-select
                      label="Unid. Medida"
                      placeholder="Selecione"
                      :items.sync="availableUnities"
                      item-text="description"
                      item-value="type"
                      return-object
                      v-model="materialStore.unit"
                      ref="materialStore.unit"
                      :rules="fieldRules.unitMaterialRules"
                      persistent-hint
                      required>
                    </v-select>
                  </v-flex>
                  <v-spacer></v-spacer>                       
                  <v-flex xs12 sm5>
                    <v-text-field
                      label="Preço"
                      required
                      prefix="R$"
                      v-model="materialStore.price"
                      :rules="fieldRules.priceRules"
                      ref="materialStore.price">
                    </v-text-field>
                    <money style="display:none" v-model="materialStore.price" v-bind="money"></money>             
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="saveMaterialsStore()" color="deep-orange darken-3" :disabled="!valid">
                  Salvar
                </v-btn>                
                <v-btn @click="showModal = false" color="deep-orange darken-3">
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-form>
      </v-layout>                        
    </v-card>
    <v-snackbar
      :timeout="6000"
      :top="true"
      :right="true"
      v-model="showSnackbar"
      color = "green darken-2"
    >
    {{snackBarText}} 
    </v-snackbar>     
  </v-dialog>       
</template>

<script>
import _ from 'lodash';
import _guid from 'Guid';
import {VMoney} from 'v-money';
import numberFunctions from '@/components/shared/number-functions';
import {db} from '@/components/shared/data-config/data-config.js';

export default {
  name: 'materialsStoreRegister',
  props: ['showMaterialRegister','materialStoreEditable'],
  mixins: [numberFunctions],
  data () {
    return {
      snackBarText:'',
      money: {
        decimal: ',',
        thousands: '.',
        precision: 2,
        masked: true /* doesn't work with directive */
      },
      fieldRules:{
        categoryRules:[
          (v) => !!v || 'Selecione a Categoria do Material'
        ],
        materialRules:[
          (v) => !!v || 'Selecione o Material desejado'
        ],
        unitWeightRules:[
          (v) => !!v || 'Digite a quantidade da Embalagem'
        ],
        quantityRules:[
          (v) => !!v || 'Digite a quantidade de cada Item'
        ],
        priceRules:[
          (v) => !!v || 'Digite a quantidade de cada Item'
        ],                                                       
        unitMaterialRules:[
          (v) =>!!v || 'Selecione ao menos uma Unidade de medida'
        ]          
      },       
      materialStore:{
        material:{},
        category:{},
        price:0
      },
      materialsStore:[],
      categories:[],
      materials:[],
      availableMaterials:[],
      valid:true,
      showModal: false,
      isEditing:false,
      availableUnities:[],
      showSnackbar:false
    }
  },
  watch: {
      'materialStore.category': function(category){
          if(category){
            this.availableMaterials = _.filter(this.materials,function(material){ 
              return material.category == category['.key'];
            });
            this.availableUnities = [];   
          };
      },
      'materialStore.material':function(material){
        if(material){
          this.availableUnities = material.unities;
        }else{
          this.availableUnities = [];
        }
      },        
      showMaterialRegister: function(show){
          this.showModal = show;
          this.clearForm();
          this.getMaterialsStore();
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal);
      },
      materialStoreEditable:function(id){
        this.materialStore = _.find(this.materialsStore,function(m) {return m['.key'] == id});
        this.materialStore.category = this.getCategoryById(this.materialStore.category);
        this.materialStore.material = this.getMaterialById(this.materialStore.material);
        this.isEditing = true;
      }      
  },
  mounted(){
    this.getCategories();
    this.getMaterialsStore();
  },
  methods: {
      saveMaterialsStore(){

        this.materialStore.category = this.materialStore.category['.key'];
        this.materialStore.material = this.materialStore.material['.key'];

        if (!this.materialStore['.key']) {

          if(this.storeExists(this.materialStore) > 0){
            this.showSnackbar = true;
            this.snackBarText = 'Já existe estoque para o produto selecionado.';
            return;
          }
          this.$firebaseRefs.materialsStore.push(_.clone(this.materialStore));                   
        }else{
          this.updateMaterialStore(this.materialStore);
        }

        this.clearForm();
        this.showModal = false;  
      },
      storeExists(storeItem){
        return _.filter(this.materialsStore, function(item){ 
          return item.material == storeItem.material
          }).length;        
      },
      updateMaterialStore(materialStore){
        const copyObj = _.clone(materialStore);
        delete copyObj['.key'];
        this.$firebaseRefs.materialsStore.child(materialStore['.key']).set(copyObj);
      },
      getCategories(){
          this.$bindAsArray(
            'categories',
            db.ref('rcita/categories'),
            null,
            () => this.getMaterials()
        );
      },
      getMaterials(){
         this.$bindAsArray(
           'materials',
           db.ref('rcita/materials')
        );
      },
      getMaterialsStore(){
          this.$bindAsArray(
            'materialsStore',
            db.ref('rcita/materialsStore'),
            null,
            () => this.getMaterials()
        );
      },
      getMaterialById(material){
        return _.find(this.materials,function(m){return m['.key'] == material});
      },
      getCategoryById(category){
        return _.find(this.categories,function(c){ return c['.key'] == category });
      },                                          
      clearForm(){
        this.materialStore = new Object(this.materialStore);
        this.$refs.form.reset();
      }
  }
}
</script>

