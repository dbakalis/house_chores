$(document).ready(function(){

    // quick activity change
    $(".quickCategoryActive").change(function() {
        var checkStatusBool = $(this).is(':checked');
        var catId           = $(this).attr("catId");
        var checkStatus;

        if(checkStatusBool){
            checkStatus = 1;
        }else{
            checkStatus = 0;
        }

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickActivityChange', catId: catId, newStatus: checkStatus},
            type: "POST", 
            success: function(output){	
                location.reload();
            }
        });
    });

    // delete category
    $(".deleteCategory").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var catId           = $(this).attr('catid');
            var numberOfNews    = $("#catNewsNum_"+catId).text();
            var numberOfSubCats = $("#catSubsNum_"+catId).text();

            if((numberOfNews > 0) || (numberOfSubCats > 0)){
                alert("Η κατηγορία αυτή περιέχει υποκατηγορίες ή και προϊόντα. Για να προχωρήσετε διαγράψτε όλες τις υποκατηγορίες ή και όλα τα προϊόντα της κατηγορίας αυτής.")
            }else{
                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {values: 'deleteCategory', catId: catId},
                    type: "POST", 
                    success: function(output){	
                        location.reload();
                    }
                });
            }
        }
    });

    // delete category translation
    $(".deleteTranslation").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var transId         = $(this).attr('transId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteCategoryTranslation', transId: transId},
                type: "POST", 
                success: function(output){	
                    buttonDeleteObj.closest('tr').find('td').fadeOut('slow', 
                    function(buttonDelete){ 
                        $(buttonDelete).parents('tr:first').remove();                    
                    });
                }
            });
            
        }
    });

    // -------------- ADD / EDIT CATEGORY -------------- //

    // show / hide - enable / disable news number per page
    $("#newsPerPage_switch").change(function() {

        if($(this).is(':checked')){
            $("#newsPerPage").addClass('d-none');
            $("#newsPerPage").prop('disabled', true);
        }else{
            $("#newsPerPage").removeClass('d-none');
            $("#newsPerPage").prop('disabled', false);
        }
    });
    
    // show / hide - enable / disable news sorting per page
    $("#category_sorting_switch").change(function() {
        if($(this).is(':checked')){
            $("#cat_sorting_way").addClass('d-none');
            $("#cat_sorting_way").prop('disabled', true);
        }else{
            $("#cat_sorting_way").removeClass('d-none');
            $("#cat_sorting_way").prop('disabled', false);
        }
    });
    

});

function replaceUrlBrowser(urlToGo){
    // relace the hash in the browser
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}