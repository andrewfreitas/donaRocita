
<script>

import _ from 'lodash';
import {db} from '@/components/shared/data-config/data-config.js';

export default {
    methods: {
        data () {
            return {
                materials:[]
            }
        },
        getMaterials(){
            return this.materials;
        },
        bindMaterials(){
            this.$bindAsArray(
                'materials',
                db.ref('rcita/materials')
            ); 
        },
        getMaterialById(id){
            return _.find(this.materials,(r)=>{return r['.key'] == id});
        }          
    },
    mounted () {
        this.getMaterials();
    },   
}

</script>
