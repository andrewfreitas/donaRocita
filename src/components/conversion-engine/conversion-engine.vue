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
      var ItemStorage = this.getItemStorage(item);
      return this.getMaterialCosts(ItemStorage,item);
    },     
    getMaterialStorage(){
      this.materialStorage = JSON.parse(this.$localStorage.get('materialStore'));
    },
    getItemStorage(item){
      return _.find(this.materialStorage,function(mStorage){ return mStorage.material.id == item.material.id});
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
      this.getMaterialStorage();
  }
}
</script>