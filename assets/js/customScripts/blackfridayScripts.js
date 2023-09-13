$(document).ready(function(){

    /////////////////// ADD / EDIT BLACKFRIDAY CATEGORY ///////////////////

    // check dates overlapsing
    $("#addEditBfCategForm").on("change", "#startTime", function () {
        var startTime = dateToUnixTimestamp($(this).val());

        if($("#endTime").val() != ""){
            var endTime = dateToUnixTimestamp($("#endTime").val());
            
            if(startTime >= endTime){
                // if code exists remove the class
                $(this).removeClass("is-valid");
                $("#endTime").removeClass("is-valid");

                // make the input field red and show message
                $(this).addClass("is-invalid");
                $("#endTime").addClass("is-invalid");

                // disable the button submit of the form
                $("#submitBfCategoryBtn").prop('disabled', true);

            }else{
                // if code doesnt exist remove the class
                $(this).removeClass("is-invalid");
                $("#endTime").removeClass("is-invalid");

                // make the input field red and show message
                $(this).addClass("is-valid");
                $("#endTime").addClass("is-valid");

                // disable the button submit of the form
                $("#submitBfCategoryBtn").prop('disabled', false);
            }
        }
    });

    // check dates overlapsing
    $("#addEditBfCategForm").on("change", "#endTime", function () {
        var endTime = dateToUnixTimestamp($(this).val());

        if($("#endTime").val() != ""){
            var startTime = dateToUnixTimestamp($("#startTime").val());
            
            if(startTime >= endTime){
                // if code exists remove the class
                $(this).removeClass("is-valid");
                $("#startTime").removeClass("is-valid");

                // make the input field red and show message
                $(this).addClass("is-invalid");
                $("#startTime").addClass("is-invalid");

                // disable the button submit of the form
                $("#submitBfCategoryBtn").prop('disabled', true);

            }else{
                // if code doesnt exist remove the class
                $(this).removeClass("is-invalid");
                $("#startTime").removeClass("is-invalid");

                // make the input field red and show message
                $(this).addClass("is-valid");
                $("#startTime").addClass("is-valid");

                // disable the button submit of the form
                $("#submitBfCategoryBtn").prop('disabled', false);
            }
        }
    });

    function dateToUnixTimestamp(dateString){
        var theParts      = dateString.split(" ");
        
        // get dateParts
        var dateParts  = theParts[0].split('-');
        var day        = dateParts[0];
        var month      = dateParts[1];
        var year       = dateParts[2];

        // get timeparts
        var timeParts  = theParts[1].split(':');
        var hour       = timeParts[0];
        var minute     = timeParts[1];

        // create formated start
        var formatedStart = month + "-" + day + "-" + year + " " + hour + ":" + minute;

        return Math.floor(new Date(formatedStart).getTime() / 1000);
    }

    ///////////////////////// CATEGORIES LSIT /////////////////////////

    // quick activity change
    $(".quickBfCategoryActive").change(function() {
        var checkStatusBool = $(this).is(':checked');
        var bfCatId         = $(this).attr("bfCatId");
        var checkStatus;

        if(checkStatusBool){
            checkStatus = 1;
        }else{
            checkStatus = 0;
        }

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickBfCategoryActivityChange', bfCatId: bfCatId, newStatus: checkStatus},
            type: "POST", 
            success: function(output){	
                // console.log(output)
            }
        });
    });

    // quick show in menu
    $(".quickBfCategoryInMenu").change(function() {
        var checkStatusBool = $(this).is(':checked');
        var bfCatId         = $(this).attr("bfCatId");
        var checkStatus;

        if(checkStatusBool){
            checkStatus = 1;
        }else{
            checkStatus = 0;
        }

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickBfCategoryInMenu', bfCatId: bfCatId, newStatus: checkStatus},
            type: "POST", 
            success: function(output){	
                // console.log(output)
            }
        });
    });

    // delete blackfriday category
    $(".deleteBfCategory").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή της κατηγορίας;')) {
            var bfCatId         = $(this).attr('bfId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteBfCategory', bfCatId: bfCatId},
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

    ///////////////////////// BLACKFRIDAY PRODUCTS /////////////////////////

    // submit filtered products to promotion
    $("#choisesProductsSubmitBrn").click(function() {
        var blackFridayId       = $("#blackCategidHidden").val();
        var prodFinderChildren  = $("#blackProdFinder").children();
        var selectedCodes       = [];

        // loop selected items and store the product codes in an array
        $.each(prodFinderChildren, function( index, value ) {
            selectedCodes.push($(value).val());
        });

        // json encode the array
        var jsonProdCodes = JSON.stringify(selectedCodes);
        
        // do an ajax call to submit the data to the database
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'addBlackFridayProducts', bfid: blackFridayId, jsonProdCodes: jsonProdCodes},
            type: "POST", 
            success: function(output){	
                if(output == 9){
                    alert("Επιλέξτε πρώτα προϊόντα για προσθήκη!");
                }else{
                    location.reload();
                }
            }
        });

    });

    // remove blackfriday product
    $(".removeBlackProduct").click(function() {
        var blackFridayId   = $("#blackCategidHidden").val();
        var blackProdId     = $(this).attr('blackProdId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'removeBlackProduct', blackProdId: blackProdId, blackFridayId: blackFridayId},
            type: "POST", 
            success: function(output){	
                location.reload();
            }
        });
    });

    // update blackfriday price
    $(".updateBlackProdPrice").click(function() {
        var blackProdId     = $(this).attr('blackProdId');
        var blackProdPrice  = $("#blackProdPrice_" + promoProdId).val();
        var bfCategId       = $("#blackCategidHidden").val();

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'updateBlackProdPrice', bfCategId: bfCategId, blackProdId: blackProdId, blackProdPrice: blackProdPrice},
            type: "POST", 
            success: function(output){	
                if(blackProdPrice>0){
                    $("#blackProdPrice_" + blackProdId).removeClass('is-invalid');
                    $("#blackProdPrice_" + blackProdId).addClass('is-valid');
                }else{
                    $("#blackProdPrice_" + blackProdId).removeClass('is-valid');
                    $("#blackProdPrice_" + blackProdId).addClass('is-invalid');
                }
            }
        });
    });

    ///////////////////////// BLACKFRIDAY TRANSLATIONS /////////////////////////

    // perepare add form of blackfriday translation
    $("#addBlackCategTranslation").click(function() {
        $("#modal_transCameFrom").val("add");
    });

    // perepare edit form of blackfriday translation
    $(".editPromotionTranslation").click(function() {
        var transId = $(this).attr('transId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareBlackCategTranslEditForm', transId: transId},
            type: "POST", 
            success: function(output){	
                var transInfo = jQuery.parseJSON(output);

                $("#modal_transId").val(transId);
                $("#modal_transCameFrom").val("edit");
                $("#modal_transName").val(transInfo["foreignName"]);
                CKEDITOR.instances["modal_transDescr"].setData(transInfo["foreignDescription"])
                $("#modal_oldTransLang").val(transInfo["language"]);
                $('#modal_transLang option[value="'+transInfo["language"]+'"]').prop('selected', true);
            }
        });
    });

    // submit add / edit form of blackfriday translation
    $("#submitEditBlackCategTransBtn").click(function() {
        var transId      = $("#modal_transId").val();
        var transName    = $("#modal_transName").val();
        var transDescr   = CKEDITOR.instances.modal_transDescr.getData();
        var transLang    = $("#modal_transLang").val();
        var oldTransLang = $("#modal_oldTransLang").val();
        var blackCategId = $("#modal_blackCategId").val();
        var cameFrom     = $("#modal_transCameFrom").val();

        if(transName == ""){
            alert("Συμπληρώστε τη ξένη ονομασία της διαθεσιμότητας για καταχώρηση!");
        }else{
            if(cameFrom == "add"){

                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {values: 'addBlackCategTranslation', transName: transName, transDescr: transDescr, transLang: transLang, blackCategId: blackCategId},
                    type: "POST", 
                    success: function(output){
                        if(output == 9){
                            alert("Υπάρχει ήδη καταχωρημένη μετάφραση αυτής της διαθεσιμότητας σε αυτή τη γλώσσα!");
                        }else{
                            location.reload();
                        }
                    }
                });

            }else if(cameFrom == "edit"){

                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {values: 'editBlackCategTranslation', transId: transId, transName: transName, transDescr: transDescr, transLang: transLang, blackCategId: blackCategId, oldTransLang: oldTransLang},
                    type: "POST", 
                    success: function(output){
                        if(output == 9){
                            alert("Υπάρχει ήδη καταχωρημένη μετάφραση αυτής της διαθεσιμότητας σε αυτή τη γλώσσα!");
                        }else{
                            location.reload();
                        }
                    }
                });

            }
        }

    });

    // delete availability translation
    $(".deleteTranslation").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή της μετάφρασης;')) {
            var transId         = $(this).attr('transId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteBlackCategTranslation', transId: transId},
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

});

function replaceUrlBrowser(urlToGo){
    // relace the hash in the browser
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}