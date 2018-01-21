<template>
<div>
  {{message}}
  <button v-on:click="reverseMessage">Reverse Message</button>
  <div class="ui large buttons">
  <button class="ui button">One</button>
  <div class="or"></div>
  <button class="ui button">Two</button>
</div>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      message:'este é um teste'
    }
  },
  methods:{
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
}
</script>
<style>
    .ui.container > h2.dividing.header {
      font-size: 2em;
      font-weight: normal;
      margin: 4em 0em 3em;
    }

</style>
