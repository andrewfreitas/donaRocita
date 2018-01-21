<template>
      <v-dialog v-model="showModal" persistent  max-width="500px">
        <v-card>
            <v-toolbar color="grey darken-2" dark>
              <v-icon dark>assignment</v-icon>
            <v-toolbar-title class="white--text">Inclusão de Materiais</v-toolbar-title>
            </v-toolbar>
            <v-spacer></v-spacer>
  <v-layout justify-center>
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
              :rules="nameMaterialRules"
              :error-messages="errorMessages"
              counter="15"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field box dark
              label="Descrição do Material"
              :rules="[
                () => !!material && material.description || 'O preenchimento deste campo é obrigatório',
                () => !!material && material.description && material.description.length <= 25 || 'O número de caracteres foi excedido.',
                this.addressCheck
              ]"
              v-model="material.description"
              ref="material.description"
              counter="25"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-select
              label="Categoria"
              placeholder="Selecione"
              :rules="[() => !!material && material.unit || 'Preenchimento obrigatório']"
              :items="items"
              v-model="material.unit"
              ref="material.unit"
              required
            ></v-select>
          </v-flex>          
          <v-flex xs12 sm4>
            <v-text-field
              label="Quantidade"
              :rules="[() => !!material && material.quantity || 'O preenchimento deste campo é obrigatório', this.addressCheck]"
              v-model="material.quantity"
              ref="material.quantity"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm4>
            <v-select
              label="Unid. Medida"
              placeholder="Selecione"
              :rules="[() => !!material && material.unit || 'This field is required']"
              :items="items"
              v-model="material.unit"
              ref="material.unit"
              required
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4>
            <v-text-field
              label="Preço"
              required
              prefix="R$"
              mask="#.###,##"
              placeholder="00,00"
              :rules="[() => !!material && material.price || 'This field is required']"
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
          <v-btn dark small @click="getDataModel()" color="orange darken-4">
            <v-icon dark>done</v-icon>
            Salvar
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>                        
        </v-card>
      </v-dialog>       
</template>

<script>
export default {
  name: 'materialsRegister',
  props: ['showMaterialsRegister'],
  data () {
    return {
      material:{
        name:'',
        category:'',
        description:'',
        quantity:'',
        unit:'',
        price:'',
      },
      nameMaterialRules: [
        (v) => () => !!material.name || 'O preenchimento deste campo é obrigatório',
        (v) => v.length <= 30 || 'Máximo de 30 caracteres'
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
      showMaterialsRegister: function(show){
          this.showModal = show;
      },
      showModal:function(showModal){
          this.$parent.$emit('showModal', showModal);
      }
  },
  methods: {
      actvModal(showModal){
          this.showModal = showModal;
      },
      getDataModel(){
        this.$parent.$emit('materialObject', this.material);
      }
  }
}
</script>

