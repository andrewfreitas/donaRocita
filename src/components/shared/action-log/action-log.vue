
<script>
    
    import {db} from '@/components/shared/data-config/data-config.js';
    import _ from 'lodash';

    export default {
        data () {
            return {
                logs:[]
            }
        },        
        methods: {
            saveLog: function(scr,act,desc) {
                this.$firebaseRefs.logs.push(_.clone({screen:scr,action:act,description:desc, date:Date.now()}));  
            } 
        },
        mounted () {
            this.$bindAsArray(
                'logs',
                db.ref('rcita/logs')
            );            
        }  
    }

</script>