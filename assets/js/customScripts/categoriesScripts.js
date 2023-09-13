$(document).ready(function(){

    function formatNumCategories(num, separator, fraction) {
        var str = num.toLocaleString('en-US');
        str = str.replace(/\./, fraction);
        str = str.replace(/,/g, separator);
        return str;
    }

    // quick category activity change
    $(".quickCategoryActive").change(function() {
        var catId               = $(this).attr("catId");
        var newStatus           = ($(this).is(':checked'))? 1 : 0;
        var hiddenCounterVal    = parseInt($("#hiddenCategoriesCounter").text().replace(".", ""));
        var newHiddenCounterVal = ($(this).is(':checked'))? hiddenCounterVal - 1 : hiddenCounterVal + 1;

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickActivityChange', catId: catId, newStatus: newStatus},
            type: "POST", 
            success: function(output){	
                // decrease the hidden counter
                $("#hiddenCategoriesCounter").text(formatNumCategories(newHiddenCounterVal, ".", ","))
            }
        });
    });

    // delete category
    $(".deleteCategory").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var catId               = $(this).attr('catid');
            var numberOfProds       = $("#catProdNum_"+catId).text();
            var numberOfSubCats     = $("#catSubsNum_"+catId).text();

            if((numberOfProds > 0) || (numberOfSubCats > 0)){
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

    // show / hide - enable / disable products number per page
    $("#productsPerPage_switch").change(function() {
        if($(this).is(':checked')){
            $("#productsPerPage").addClass('d-none');
            $("#productsPerPage").prop('disabled', true);
        }else{
            $("#productsPerPage").removeClass('d-none');
            $("#productsPerPage").prop('disabled', false);
        }
    });
    
    // show / hide - enable / disable products sorting per page
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