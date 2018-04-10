<script>

import _ from 'lodash';
import convertUnit from 'convert-units';
import numeral from 'numeral';

export default {
  methods:{
    convertNumber(item,material,updateMaterialPrice){
      return this.getMaterialCosts(item,material,updateMaterialPrice);
    },     
    getMaterialCosts(item,material,updateMaterialPrice){
      var minimumCovert = convertUnit(1).from(material.unitPrice.type).to(item.unit.type);
      var materialPrice = (updateMaterialPrice && updateMaterialPrice == true) ? material.price : item.price;
      var cost = numeral((numeral(materialPrice)._value / minimumCovert) * numeral(item.quantity)._value).format('0,0.00');
    
      return cost;
    }
  },
  mounted(){
      numeral.locale('pt-BR');
  }
}
</script>