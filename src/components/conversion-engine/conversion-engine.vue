<script>

import _ from 'lodash';
import convertUnit from 'convert-units';
import numeral from 'numeral';

export default {
  methods:{
    convertNumber(item,materialsStore){
      var ItemStorage = this.getItemStorage(item,materialsStore);
      return this.getMaterialCosts(ItemStorage,item);
    },     
    getItemStorage(item,materialsStore){
      return _.find(materialsStore,function(mStorage){ return mStorage.material == item.material['.key']});
    },
    getMaterialCosts(itemStorage,item){
      var totalQuantity = itemStorage.quantity * itemStorage.unitWeight;
      var minimumCovert = convertUnit(totalQuantity).from(itemStorage.unit.type).to(item.unit.type);
      var cost = numeral((numeral(itemStorage.price)._value / minimumCovert) * numeral(item.quantity)._value).format('0,0.00');
    
      return cost;
    }
  },
  mounted(){
      numeral.locale('pt-BR');
  }
}
</script>