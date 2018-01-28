<script>

import _ from 'lodash';
import convertUnit from 'convert-units';

export default {
  data () {
    return {
      materialStorage:{}
    }
  },
  methods:{
    convertNumber(item){
      
      this.getMaterialStorage(item);

      switch(item.unit.type){
        case 'ml':{
          
        }
      }
    },
    getMaterialStorage(item){
      this.materialStorage = JSON.parse(this.$localStorage.get('materialStore'))[0];
      var totalQuantity = this.materialStorage.totalQuantity * this.materialStorage.unitWeight;
      var minimumCovert = convertUnit(totalQuantity).from(this.materialStorage.unit.type).to(item.unit.type);
      var cost = (this.materialStorage.totalPrice / minimumCovert) * item.quantity;
      console.log('TESTE >>>> ' + cost);
    }
  },
  mounted(){

  }
}
</script>