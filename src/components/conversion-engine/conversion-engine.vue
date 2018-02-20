<script>

import _ from 'lodash';
import convertUnit from 'convert-units';
import numeral from 'numeral';

export default {
  data () {
    return {
      materialStorage:{}
    }
  },
  methods:{
    convertNumber(item){
      
      return this.getMaterialStorage(item);
    },     
    getMaterialStorage(item){
      this.materialStorage = JSON.parse(this.$localStorage.get('materialStore'))[0];
      var totalQuantity = this.materialStorage.quantity * this.materialStorage.unitWeight;
      var minimumCovert = convertUnit(totalQuantity).from(this.materialStorage.unit.type).to(item.unit.type);
      var cost = numeral((numeral(this.materialStorage.price)._value / minimumCovert) * numeral(item.quantity)._value).format('0,0.00');
    
      return cost;
    }
  },
  mounted(){
      numeral.locale('pt-BR');
  }
}
</script>