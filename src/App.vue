<template>
<v-app dark>
<v-navigation-drawer
      clipped
      fixed
      v-model="drawer"
      app
      v-show="drawer"
      v-if="showDrawer"
    >
      <v-list dense>
        <v-list-tile href="#/category-list" router>
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Categorias de Materiais</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/material-list" router>
          <v-list-tile-action>
            <v-icon>assignment</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Materiais</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/material-store-list" router>
          <v-list-tile-action>
            <v-icon>line_weight</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Estoque de Materiais</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/recipe-category-list" router>
          <v-list-tile-action>
            <v-icon>grain</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Categorias da Receita</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/recipe-list" router>
          <v-list-tile-action>
            <v-icon>gesture</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Inclusão de Receitas</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>                         
      </v-list>
    </v-navigation-drawer>
<v-toolbar app fixed clipped-left color="blue-grey darken-2" v-if="showToolbar">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
       <v-avatar dark>
          <img src="/static/cupWhite.png" alt="avatar">
        </v-avatar>            
        Dona Rocita            
      </v-toolbar-title>
    </v-toolbar>
 <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex shrink>
            <v-container fluid>
              <div id="app">
                <router-view/>
              </div>              
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
<v-footer app fixed>
      <!-- <span>&copy; 2017</span> -->
    </v-footer>              

</v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
      return {
        drawer:true,
        showToolbar:true,
        showDrawer:true
      }
  },
  watch: {
    showDrawer:function(){
      if(this.showDrawer == false){
        this.$nextTick(function () {
            window.print();
        });     
      }
    }
  },
  created(){
      this.$on('hideDrawer',function (recipeObject) {
         this.showDrawer = false;
         this.showToolbar = false;
      });    
  }
}
</script>
