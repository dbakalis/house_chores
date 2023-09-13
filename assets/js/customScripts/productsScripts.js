$(document).ready(function(){

    function formatNum(num, separator, fraction) {
        var str = num.toLocaleString('en-US');
        str = str.replace(/\./, fraction);
        str = str.replace(/,/g, separator);
        return str;
    }

    /** PRODUCTS LIST (index) START */

    // quick activity change
    $("#prodsListTbody").on("click", ".quickProductActive", function () {
        var activitySwitch      = $(this);
        var prodId              = $(this).attr("prodId");
        var newStatus           = (activitySwitch.is(':checked'))? 1 : 0;
        var hiddenCounterVal    = parseInt($("#hiddenProdCounterSpan").text().replace(".", ""));
        var newHiddenCounterVal = (activitySwitch.is(':checked'))? hiddenCounterVal - 1 : hiddenCounterVal + 1;
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickActivityChange', prodId: prodId, newStatus: newStatus},
            type: "POST", 
            success: function(output){	
                // decrease the counters
                $("#hiddenProdCounterSpan").text(formatNum(newHiddenCounterVal, ".", ","))

                // change the activity attribute of the delete button too in order to know if we will reduce the general counters on delete
                activitySwitch.closest('tr').find('.deleteProduct').attr('prodActive', newStatus)
            }
        });
    });

    // populate extra categories modal
    $("#prodsListTbody").on("click", ".moreCatsProdsBtn", function () {
        var prodId = $(this).attr("prodId");

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'printListProdsExtraCats', prodId: prodId},
            type: "POST", 
            success: function(output){	
                $("#modalProdsMoreCatsBody").html(output);
            }
        });	
    });

    // on close of extra categories refresh the page
    $('#moreCatsProdsModal').on('hidden.bs.modal', function () {
        location.reload();
    });

    // add / remove extra category
    $("#moreCatsProdsModal").on("click", ".addRemoveProdsCatBtn", function () {
        var button      = $(this);
        var selectedVal = $(this).val();
		var catProdsIds = selectedVal.split("<||>");
		var catId 	    = catProdsIds[0];
		var prodId 	    = catProdsIds[1];

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'addRemoveProductExtraCategory', catId: catId, prodId: prodId},
            type: "POST", 
            success: function(output){
                if(output=="ADD_BUTTON_APPEAR"){
                    // change class
                    button.removeClass("btn-danger");
                    button.addClass("btn-success");

                    // change text
                    button.text("Προσθήκη");

                }else if(output=="REMOVE_BUTTON_APPEAR"){
                    // change class
                    button.removeClass("btn-success");
                    button.addClass("btn-danger");

                    // change text
                    button.text("Αφαίρεση");

                }else{
                    // change class
                    button.removeClass("btn-success");
                    button.removeClass("btn-danger");
                    button.addClass("btn-warning");

                    // change text
                    button.text("!");
                }
            }
        });	
    });

    // delete product
    $("#prodsListTbody").on("click", ".deleteProduct", function () {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var prodId              = $(this).attr("prodId");
            var totalCounterVal     = parseInt($("#totalProdCounterSpan").text().replace(".",""));
            var hiddenCounterVal    = parseInt($("#hiddenProdCounterSpan").text().replace(".",""));
            var newTotalCounterVal  = totalCounterVal - 1;
            var newHiddenCounterVal = hiddenCounterVal - 1;
            var isActive            = $(this).attr('prodActive');
            var buttonDelete        = this;
            var buttonDeleteObj     = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteProductAjax', prodId: prodId},
                type: "POST", 
                success: function(output){	

                    buttonDeleteObj.closest('tr').find('td').fadeOut('slow', 
                    function(buttonDelete){
                        $(buttonDelete).parents('tr:first').remove();                    
                    });

                    // decrease the counters
                    $("#totalProdCounterSpan").text(formatNum(newTotalCounterVal, ".", ","))
                    if( (isActive == 0) && (hiddenCounterVal > 0) ){
                        $("#hiddenProdCounterSpan").text(formatNum(newHiddenCounterVal, ".", ","))
                    }

                }
            });
            
        }
    });

    // save preview settings of the listing table
    $("#prodPreviewSettingsSaveBtn").click(function() {
        var checked_image_code   = ($("#prevSetting_image_code").is(':checked'))? 1 : 0;
        var checked_prices       = ($("#prevSetting_prices").is(':checked'))? 1 : 0;
        var checked_availability = ($("#prevSetting_availability").is(':checked'))? 1 : 0;
        var checked_stock        = ($("#prevSetting_stock").is(':checked'))? 1 : 0;
        var checked_weight       = ($("#prevSetting_weight").is(':checked'))? 1 : 0;
        var checked_timestamp    = ($("#prevSetting_timestamp").is(':checked'))? 1 : 0;

        $.ajax({
            url: "ajaxFunctions.php",
            data: {
                values: 'savePreviewSettings', 
                settingsPreview: {
                    image_code: checked_image_code, 
                    prices: checked_prices,
                    availability: checked_availability,
                    stock: checked_stock,
                    weight: checked_weight,
                    timestamp: checked_timestamp
                }
            },
            type: "POST", 
            success: function(output){	
                location.reload();
            }
        });
    });
    

    /** PRODUCTS ADD / EDIT FORM START */

    // productCode exists event
    $("#productCode").keyup(function() {
        var prodCodeInpt = $(this);
        var prodCodeText = $(this).val();
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'checkProdCodeExist', prodCode: prodCodeText},
            type: "POST", 
            success: function(output){	

                // if code exists
                if(output == 1){
                    // if code exists remove the class
                    prodCodeInpt.removeClass("is-valid");

                    // make the input field red and show message
                    prodCodeInpt.addClass("is-invalid");
                    $("#prodCodeExistMessage").html('<p class="text-danger">Υπάρχει καταχωρημένο προϊόν με αυτό το κωδικό!</p>');

                    // disable the button submit of the form
                    $("#submitProdFormBtn").prop('disabled', true);

                }else{
                    // if code doesnt exist remove the class
                    prodCodeInpt.removeClass("is-invalid");

                    // make the input field red and show message
                    prodCodeInpt.addClass("is-valid");
                    $("#prodCodeExistMessage").html('<p class="text-success">Ο κωδικός είναι μοναδικός.</p>');

                    // disable the button submit of the form
                    $("#submitProdFormBtn").prop('disabled', false);
                }

            }
        });

    });

    // discount percentage calculate and price with tax
    $("#price").keyup(function() {
        var price     = $(this).val();
        var salePrice = $("#sale_price").val();

        calculateDiscount(price, salePrice);
    });

    // discount percentage calculate and price with tax
    $("#sale_price").keyup(function() {
        var salePrice = $(this).val();
        var price     = $("#price").val();

        calculateDiscount(price, salePrice);
    });
 
    function calculateDiscount(priceWithTax, salePriceWithTax){
        if( (priceWithTax != "") && (salePriceWithTax != "") ){
            var discounPerctWithTax = (100 - ((salePriceWithTax / priceWithTax) * 100)).toFixed(2);

            // set the discount to the field
            $("#disounctPercentage").val(discounPerctWithTax);
            
            if(discounPerctWithTax <= 0){

                // first dicount is zero remove the class
                $("#disounctPercentage").removeClass("is-valid");

                // make the input field red
                $("#disounctPercentage").addClass("is-invalid");
                
            }else{

                // first dicount is not zero remove the class
                $("#disounctPercentage").removeClass("is-invalid");

                // make the input field red
                $("#disounctPercentage").addClass("is-valid");
            }
        }else{
            // set the discount to the field
            $("#disounctPercentage").val();
        }
    } 

    // show the user a small preview of the group that is selected
	$("#productCodeGroup").keyup(function() {
        var prodGroupCode = $(this).val();

        if(prodGroupCode != ""){
            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'previewGroupProducts', prodGroupCode: prodGroupCode},
                type: "POST", 
                success: function(output){
                    if(output != ""){
                        $("#productGroupPreviewDiv").removeClass('d-none');
                        $("#productGroupPreviewTable").html(output);
                    }else{
                        $("#productGroupPreviewDiv").addClass('d-none');
                        $("#productGroupPreviewTable").html('');
                    }
                }
            });
        }
    });

    /** PRODUCTS TRANSLATIONS */

    // delete product translation
    $(".deleteTranslation").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή της μετάφρασης;')) {
            var transId         = $(this).attr('transId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteProductTranslation', transId: transId},
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


    /** PRODUCTS SETS */

    // submit filtered products to set
    $("#choisesProductsSubmitBtn").click(function() {
        var theProdId           = $("#productIdHidden").val();
        var prodFinderChildren  = $("#setProdFinder").children();
        var selectedProdCodes   = [];

        // loop selected items and store the product codes in an array
        $.each(prodFinderChildren, function( index, value ) {
            selectedProdCodes.push($(value).val());
        });

        // json encode the array
        var jsonProdCodes = JSON.stringify(selectedProdCodes);
        
        // do an ajax call to submit the data to the database
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'addSetsProducts', theProdId: theProdId, jsonProdCodes: jsonProdCodes},
            type: "POST", 
            success: function(output){	
                if(output == 9){
                    alert("Επιλέξτε πρώτα προϊόντα για προσθήκη!");
                }else{
                    // console.log(output)
                    location.reload();
                }
            }
        });

    });

    // remove set product
    $(".removeSetProduct").click(function() {
        var buttonDelete    = this;
        var buttonDeleteObj = $(this);
        var setProdId = $(this).attr('setProdId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'removeSetProduct', setProdId: setProdId},
            type: "POST", 
            success: function(output){	
                buttonDeleteObj.closest('tr').find('td').fadeOut('slow', 
                function(buttonDelete){ 
                    $(buttonDelete).parents('tr:first').remove();                    
                });
            }
        });
    });

    $('.products-autocomplete').on('change', function(e) {
        var selectedProductCode = $(e.target).data('selected-code');
        if (selectedProductCode) {
            $('input[name="srch"]').val(selectedProductCode);
        }
    });
});

function replaceUrlBrowser(urlToGo){
    // relace the hash in the browser
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}