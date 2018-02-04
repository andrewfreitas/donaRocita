<script>
import _pdf from 'jsPDF';

export default {
  methods: {
      recipePrint(recipeList){
            var doc = new _pdf();


const templateOfAdvanceTemplatePage = '<div class="content edit-page management"> ' +
    '<md-card class="page-card">' +
    '</md-card>' +
    'TESTE' +
  '</div>'

doc.fromHTML(templateOfAdvanceTemplatePage, 15, 15, {
	'width': 170
});
                doc.save('a4.pdf');
      }  
  }  
}

</script>