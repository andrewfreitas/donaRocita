
<script>

import _ from 'lodash';
import numeral from 'numeral';
import {db} from '@/components/shared/data-config/data-config.js';
import conversionEngine from '@/components/conversion-engine/conversion-engine';

export default {
    mixins:[conversionEngine],
    methods: {
        data () {
            return {
                recipes:[],
                materials:[]
            }
        },
        getMaterials(){
            this.$bindAsArray(
                'materials',
                db.ref('rcita/materials')
            );               
        },        
        getRecipes(){
            this.$bindAsArray(
                'recipes',
                db.ref('rcita/recipes')
            );               
        },
        getRecipeById(id){
            return _.find(this.recipes,(r)=>{return r['.key'] == id})
        },
        getMaterialById(id){
            return _.find(this.materials,(r)=>{return r['.key'] == id});
        },
        getRecipeItemCost(item,updateMaterialPrice){
            var material = this.getMaterialById(item.material);
            item.price = material.price;
            let recipeItemCost = this.formatPrice(this.convertNumber(item,material,updateMaterialPrice));
            return recipeItemCost;
        },
        getSummaryCost(recipe, updateMaterialPrice){
            var totalCost = 0.00;

            _.forEach(recipe.items, (item)=>{
                totalCost += numeral(this.getRecipeItemCost(item,updateMaterialPrice))._value;
            });

            recipe.formattedCost = this.formatPrice(totalCost,2);
            recipe.cost = totalCost;

            return recipe.formattedCost;
        },
        getTotalCost(recipe,updateMaterialPrice){
            recipe.totalCost = numeral(this.getSummaryCost(recipe,updateMaterialPrice) || 0)._value +
                               numeral(this.getRecipeProfitPrice(recipe) || 0)._value + 
                               numeral(recipe.adctionalPrice || 0)._value;
            
            recipe.adctionalPriceFormatted = this.formatPrice(recipe.adctionalPrice,2);
            recipe.totalCostFormatted = this.formatPrice(recipe.totalCost,2);

            return recipe.totalCostFormatted;
        },
        getUnitPrice(recipe,updateMaterialPrice){
            var unitPrice = 0;

            if(numeral(recipe.qtdRecipe)._value >= 1){
                unitPrice =  numeral(this.getTotalCost(recipe,updateMaterialPrice))._value / numeral(recipe.qtdRecipe)._value;
            }

            recipe.unitPriceRecipe = unitPrice; 
            recipe.unitPriceRecipeFormatted = this.formatPrice(unitPrice,2); 

            return recipe.unitPriceRecipeFormatted;            
        },
        getRecipeProfitPrice(recipe){
            if(recipe.profitType != 'valuePrice'){
                return numeral(this.getSummaryCost(recipe))._value * (numeral(recipe.percentProfit)._value / 100);
            }

            recipe.priceProfitFormatted = this.formatPrice(recipe.priceProfit,2);

            return numeral(recipe.priceProfit)._value;
        },
        formatPrice(value,precision){
            return (precision && _.isNumber(precision) && precision > 0) ? numeral(_.round(value,2)).format('$ 0,0.00[0]') : numeral(value).format('$ 0,0.00[000]');
        },        
        saveRecipe(recipe){

            if(!recipe['.key']){  
                this.insertRecipe(_.clone(recipe));
                return;  
            };

            this.updateRecipe(recipe);

            return recipe;
        },
        insertRecipe(recipe){
            this.$firebaseRefs.recipes.push(_.clone(recipe)); 
        },
        updateRecipe(recipe){
            const copyObj = _.clone(recipe);
            delete copyObj['.key'];
            this.$firebaseRefs.recipes.child(recipe['.key']).set(copyObj);
        },
        updateRecipePrices(){
            _.each(this.recipes,(recipe)=>{
                this.getSummaryCost(recipe,true);
                this.getTotalCost(recipe,true);
                this.getUnitPrice(recipe,true);
                this.updateRecipe(recipe);
            });
        }          
    },
    mounted () {
        this.getMaterials();
    },
    beforeCreate () {
        numeral.register('locale', 'pt-BR', {
            delimiters: {
                thousands: '.',
                decimal: ','
            },
            abbreviations: {
                thousand: 'mil',
                million: 'milhões',
                billion: 'b',
                trillion: 't'
            },
            ordinal: function (number) {
                return 'º';
            },
            currency: {
                symbol: 'R$'
            }
        });
        numeral.locale('pt-BR');
    }    
}

</script>
