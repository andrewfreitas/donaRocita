<template>
<div>
    <div class="ui container">
        <h2 class="ui dividing header"></h2>                
    </div>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-toolbar color="deep-orange darken-5" dark>
          <v-toolbar-title>Dona Rocita</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
            <v-btn  dark color="amber darken-4" href="#/category-list" router>
              <v-icon dark>web</v-icon>
                Categorias
            </v-btn>          
            <v-btn  dark color="amber darken-4" href="#/material-list" router>
                <v-icon dark>assignment</v-icon>
                Materiais
            </v-btn>
            <v-btn  dark color="amber darken-4" href="#/material-store-list" router>
              <v-icon dark>dns</v-icon>
                Estoque
            </v-btn>
            <v-btn  dark color="amber darken-4" href="#/recipe-category-list" router>
              <v-icon dark>grain</v-icon>
                Categoria Receita
            </v-btn>                               
            <v-btn  dark color="amber darken-4" href="#/recipe-list" router>
              <v-icon dark>gesture</v-icon>
                Receitas
            </v-btn>                                    
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
  <materials-register :show-materials-register.sync="showMaterialsRegister"></materials-register>    
</div>
</template>
<script>

import materialsRegister from '@/components/material-register/material-register'
import _pdf from 'jsPDF';

export default {
  name: 'mainMenu',
  components: {
      materialsRegister
  },
  mounted () {

    //var doc = new _pdf()
    
    //doc.text('Hello world!', 10, 10)
    //doc.save('a4.pdf');

    this.$on('showModal',function (show) {
        this.showMaterialsRegister = show;
    })  
  },
  data () {
    return {
      showMaterialsRegister: false
    }
  },
  methods: {
      openModal(){
          this.showMaterialsRegister = true;
      }
  }
}
</script>
<style>
    .ui.container > h2.dividing.header {
      font-size: 2em;
      font-weight: normal;
      margin: 2em 0em 3em;
    }

</style>
