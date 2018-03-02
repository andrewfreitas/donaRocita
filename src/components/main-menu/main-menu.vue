<template>
<div>
</div>
</template>
<script>

import _pdf from 'jsPDF';

export default {
  name: 'mainMenu',
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
  }
}
</script>
