<template>
  <v-dialog v-model="showModal" persistent  max-width="500px">
    <v-card>
      <v-toolbar color="deep-orange darken-3" dark>
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
                      item-value="id"
                      return-object
                      :disabled = "isEditing"
                      v-model="materialStore.category"
                      ref="materialStore.category"
                      :rules="fieldRules.categoryRules"
                      required
                      @change="getMaterials()">
                    </v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      label="Materiais Disponíveis"
                      placeholder="Selecione"
                      :items="materials"
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
                      counter="5"
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
                <v-btn dark small @click="showModal = false" color="deep-orange darken-3">
                  <v-icon dark>replay</v-icon>
                  Fechar
                </v-btn>
                <v-btn dark small @click="saveMaterialsStore()" color="deep-orange darken-3" :disabled="!valid">
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
import {VMoney} from 'v-money';

export default {
  name: 'materialsStoreRegister',
  props: ['showMaterialRegister','materialStoreEditable'],
  data () {
    return {
      price: 123.45,
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
        category:{}
      },
      materialsStore:[],
      categories:[],
      materials:[],
      valid:true,
      showModal: false,
      isEditing:false,
      availableUnities:[]
    }
  },
  watch: {
      'materialStore.category': function(category){
          if(category){
            this.materials = _.filter(this.materials,function(material){ 
              return material.category.id == category.id;
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
          this.getMaterialsStore();
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal);
      },
      materialStoreEditable:function(materialStore){
        this.materialStore = materialStore;
        this.materials = [materialStore.material];
        this.isEditing = true;
      }      
  },
  mounted(){
    this.categories = JSON.parse(this.$localStorage.get('categories'));
  },
  methods: {
      actvModal(showModal){
          this.showModal = showModal;
      },
      saveMaterialsStore(){
        if (!this.materialStore.id && this.$refs.form.validate()) {
          var guid = _guid.create();
          this.materialStore.id =guid;
          this.materialsStore.push(_.clone(this.materialStore));
        }else if(this.materialStore.id && this.$refs.form.validate()){
          this.updateMaterialStore(this.materialStore);
        }
        else{
          return;
        }

        this.persistMaterialStore();
        this.$parent.$emit('materialStoreObject', _.clone(this.materialStore));
        this.clearForm();
        this.showModal = false;  
      },
      updateMaterialStore(materialStore){
        var indexArray = _.findIndex(this.materialsStore, function(o) { return o.id == materialStore.id; });
        this.materialsStore[indexArray] = materialStore;
      },
      persistMaterialStore(){
        this.$localStorage.set('materialStore', JSON.stringify(this.materialsStore));
      },      
      getMaterials(){
        this.materials = this.$localStorage.get('materials')? JSON.parse(this.$localStorage.get('materials')) : this.materials;
      },
      getMaterialsStore(){
        this.materialsStore = this.$localStorage.get('materialStore')? JSON.parse(this.$localStorage.get('materialStore')) : this.materialsStore;
      },      
      clearForm(){
        this.materialStore = {};
      }
  }
}
</script>

