<template>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-btn color="primary" dark slot="activator">Open Dialog</v-btn>
      <v-card>
        <v-card-title class="headline">{{title}}</v-card-title>
        <v-card-text>{{text}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialog = false, accept(true)">Sim</v-btn>
          <v-btn color="green darken-1" flat @click.native="dialog = false, accept(false)">Não</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'PopSimpleMessage',
    props:['text','title','showPop'],
    methods: {
        accept(value){
            this.$parent.$emit('acceptMessage', value);
        }
    },
    watch: {
        showPop:function(){
            this.dialog = true;
        }
    }
}    
</script>