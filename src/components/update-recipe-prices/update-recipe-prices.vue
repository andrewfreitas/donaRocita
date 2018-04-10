<script>

import _ from 'lodash';
import convertUnit from 'convert-units';
import numeral from 'numeral';
import {db} from '@/components/shared/data-config/data-config.js';
import conversionEngine from '@/components/conversion-engine/conversion-engine';
import _ from 'lodash';

export default {
    data () {
        return {
            materials:[]
        }
    },
    mixins:[conversionEngine],         
    methods:{
        getMaterials(){
            this.$bindAsArray(
                'materials',
                db.ref('rcita/materials'),
                null,
                ()=> this.getRecipes()
            );   
        },
        getMaterialById(id){
            return _.find(this.materials,function(m){ return material['.key'] == id});
        },
        getSummaryCost(recipe){
            var totalCost = 0.00;

            _.forEach(recipe.items, function(item){
                totalCost += numeral(item.cost)._value;
            });

            recipe.cost = numeral(totalCost).format('$ 0,0.00');

            return numeral(totalCost).format('$ 0,0.00');
        },
        getRecipes(){
            this.$bindAsArray(
                'recipes',
                db.ref('rcita/recipes')
            );               
        },
        updateRecipeMaterialPrice(){
            _.each(this.recipes,(r)=>{
                _.each(r.items,function(item){
                    this.item.cost = numeral(this.convertNumber(item,this.getMaterialById(item.material)).format('$ 0,0.00'));     
                });
            });
        }
    }
}
</script>