<template>
  <body class="A4">
    <header class="dr-header">
      <img class="dr-header-logo" src="static/donarocita-logo.png" alt="Dona Rocita: Logotipo">
      <ul class="dr-header-list">
        <li class="dr-header-item">Fone/WhatsApp: 97358-4275</li>
        <li class="dr-header-item">Website: www.donarocita.com.br</li>
        <li class="dr-header-item">Facebook: www.facebook.com/donarocita</li>
        <li class="dr-header-item">Instagram: @donarocita</li>
        <li class="dr-header-item">E-mail: donarocita@gmail.com</li>
      </ul>
      <h1 class="dr-header-title">tabela de preços para Doces Finos</h1>
    </header>
    <table class="dr-values-table" v-for="recipeCategory in recipesArray">
        <caption class="dr-values-caption">
            {{recipeCategory.categoryName}}
        </caption>
        <tr class="dr-values-row" v-for="recipe in recipeCategory.categoryRecipes">
            <td class="dr-values-heading">
            <span class="dr-values-copy">{{recipe.name}}</span>
            </td>
            <td class="dr-values-price">
            <span class="dr-values-copy">{{recipe.totalCostFormatted}}</span>
            </td>
        </tr>
    </table>
  </body>
</template>
<script>
    export default {
        name: 'recipePrintView',
        data () {
            return {
                recipes:[],
                recipeCategories:[],
                recipesArray:[]
            }
        },        
        created(){
            this.getRecipes();
        },
        mounted () {
            this.$nextTick(function () {
                window.print();
            });         
            
        },
        methods: {
            getRecipes(){
                this.recipes = this.$localStorage.get('recipes')? JSON.parse(this.$localStorage.get('recipes')) : this.recipes;
                this.getCategories();
            },
            getCategories(){
                this.recipeCategories = _.sortedUniqBy(_.map(this.recipes,function(item){ return item.recipeCategory}),'id');
                this.getRecipeCategories(this.recipeCategories);
            },
            getRecipeCategories(recipeCategories){
                var thisRecipes =  this.recipes;
                var rArray =  this.recipesArray;

                _.each(recipeCategories,function(item){
                     var recipe = {
                            categoryId:item.id,
                            categoryName:item.name,
                            categoryRecipes:_.filter(thisRecipes,function(itemRecipe){ return itemRecipe.recipeCategory.id ==item.id })
                        }
                    rArray.push(recipe);
                });

                this.recipesArray = rArray;
            }        
        }               
    }
</script>
<style>

@page { margin: 2.5cm; 
        visibility: hidden } 

</style>