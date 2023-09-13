$(document).ready(function(){

    // delete promotion
    $(".deletePromotion").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή του promotins;')) {
            var promoId = $(this).attr('promoId');

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deletePromotion', promoId: promoId},
                type: "POST", 
                success: function(output){	
                    location.reload();
                }
            });
        }
    });

    // add promotion
    $("#addPromotion").click(function() {
        $("#modal_promoCameFrom").val("add");
    });

    // prepare edit form for promotion
    $(".editPromotion").click(function() {
        var promoId = $(this).attr('promoId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'preparePromotionEditForm', promoId: promoId},
            type: "POST", 
            success: function(output){	
                var promoInfo = jQuery.parseJSON(output);

                $("#modal_promoId").val(promoId);
                $("#modal_promoCameFrom").val("edit");
                $("#modal_promoName").val(promoInfo["promoName"]);
                $("#modal_promoList").val(promoInfo["promoList"]);
                $('#modal_promoSorting option[value="'+promoInfo["promoSorting"]+'"]').prop('selected', true);
                if (promoInfo["promoActive"] === '1') {
                    $('#modal_promoActive').prop('checked', true);
                }
                $("#modal_promoProdLimit").val(promoInfo["promoProductLimit"]);

                $('#modal_promoType').prop('disabled', true);
                $('#modal_promoType_div').hide();
            }
        });
    });

    // on close of modal show type field again
    $('#addEditPromotionModal').on('hidden.bs.modal', function () {
        $('#modal_promoType').prop('disabled', false);
        $('#modal_promoType_div').show();
    });

    // add / edit promotion
    $("#modal_promoSubmit").click(function() {
        var promoId         = $("#modal_promoId").val();
        var promoName       = $("#modal_promoName").val();
        var promoList       = $("#modal_promoList").val();
        var promoActive     = $('#modal_promoActive').prop('checked') ? 1 : 0;
        var promoProdLimit  = $("#modal_promoProdLimit").val();
        var promoType       = $("#modal_promoType").val();
        var promoSort       = $("#modal_promoSorting").val();
        var cameFrom        = $("#modal_promoCameFrom").val();

        if(promoName == ""){
            alert("Εισάγετε ονομασία promotion για καταχώρηση!");
        }else if(promoProdLimit < 0 || promoProdLimit > maxProdPerPromo){
            alert("Εισάγετε όριο προϊόντων μεγαλύτερο απο μηδέν (0) και μικρότερο απο πενήντα ("+maxProdPerPromo+")!");
        }else{
            if(cameFrom == "add"){

                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {
                        values: 'addPromotion', 
                        promoId : promoId,
                        promoName : promoName,
                        promoActive : promoActive,
                        promoProductLimit : promoProdLimit,
                        promoList : promoList,
                        promoType : promoType,
                        promoSorting : promoSort,
                        cameFrom : cameFrom
                    },
                    type: "POST", 
                    success: function(output){
                        if(output == 8){
                            alert("Εισάγετε ονομασία promotion για καταχώρηση!");
                        }else if(output == 7){
                            alert("Έχετε φτάσει το όριο των επιτρεπόμενων promotion αυτού του είδους!");
                        }else{
                            location.reload();
                        }
                    }
                });

            }else if(cameFrom == "edit"){

                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {
                        values: 'editPromotion', 
                        promoId: promoId,
                        promoName : promoName,
                        promoActive : promoActive,
                        promoProductLimit : promoProdLimit,
                        promoList : promoList,
                        promoType : promoType,
                        promoSorting : promoSort,
                        cameFrom : cameFrom
                    },
                    type: "POST", 
                    success: function(output){	
                        location.reload();
                    }
                });

            }
        }
    });

    // quick activity change
    $(".quickPromotionActive").change(function() {
        var checkStatusBool = $(this).is(':checked');
        var promoId         = $(this).attr('promoId');
        var checkStatus;

        if(checkStatusBool){
            checkStatus = 1;
        }else{
            checkStatus = 0;
        }

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickPromotionActive', newStatus: checkStatus, promoId: promoId},
            type: "POST", 
            success: function(output){	
                // location.reload();
            }
        });
    });


    ///////////////////////// promotion products ///////////////////////////////

    // submit filtered products to promotion
    $("#choisesProductsSubmitBrn").click(function() {
        var promoId             = $("#promoIdHidden").val();

        // get selected item
        var selectedProductCode = $('.products-autocomplete').data('selected-code');

        if (selectedProductCode) {
            // store the product code in an an array
            var selectedProductCodes = [selectedProductCode];
            // json encode the array
            var jsonProdCodes = JSON.stringify(selectedProductCodes)

            // do an ajax call to submit the data to the database
            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'addPromotionProducts', promoId: promoId, jsonProdCodes: jsonProdCodes},
                type: "POST", 
                success: function(output){	
                    if(output == 9){
                        alert("Επιλέξτε πρώτα προϊόντα για προσθήκη!");
                    }else{
                        location.reload();
                    }
                }
            });
        }
    });
    
    // remove promotion product
    $(".removePromotionProduct").click(function() {
        var promoId     = $("#promoIdHidden").val();
        var promoProdId = $(this).attr('promoProdId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'removePromotionProduct', promoProdId: promoProdId, promoId: promoId},
            type: "POST", 
            success: function(output){	
                location.reload();
            }
        });
    });


    //////////////////////////////// translations ///////////////////////////////

    // perepare add form of promotion translation
    $("#addPromotionsTranslation").click(function() {
        $("#modal_transCameFrom").val("add");
        $("#modal_promoId").val(3);
    });

    // perepare edit form of promotion translation
    $(".editPromotionTranslation").click(function() {
        var transId = $(this).attr('transId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'preparePromoTranslEditForm', transId: transId},
            type: "POST", 
            success: function(output){	
                var transInfo = jQuery.parseJSON(output);

                $("#modal_transId").val(transId);
                $("#modal_promoId").val(3);
                $("#modal_transCameFrom").val("edit");
                $("#modal_transName").val(transInfo["foreignName"]);
                $("#modal_oldTransLang").val(transInfo["language"]);
                $('#modal_transLang option[value="'+transInfo["language"]+'"]').prop('selected', true);
            }
        });
    });

    // submit add / edit form of promotion translation
    $("#submitEditPromotionTransBtn").click(function() {
        var transId      = $("#modal_transId").val();
        var transName    = $("#modal_transName").val();
        var transLang    = $("#modal_transLang").val();
        var oldTransLang = $("#modal_oldTransLang").val();
        var promoId      = $("#modal_promoId").val();
        var cameFrom     = $("#modal_transCameFrom").val();

        if(transName == ""){
            alert("Συμπληρώστε τη ξένη ονομασία της διαθεσιμότητας για καταχώρηση!");
        }else{
            if(cameFrom == "add"){

                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {values: 'addPromotionTranslation', transName: transName, transLang: transLang, promoId: promoId},
                    type: "POST", 
                    success: function(output){
                        console.log(output)
                        if(output == 9){
                            alert("Υπάρχει ήδη καταχωρημένη μετάφραση αυτής της διαθεσιμότητας σε αυτή τη γλώσσα!");
                        }else{
                            // location.reload();
                        }
                    }
                });

            }else if(cameFrom == "edit"){

                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {values: 'editPromotionTranslation', transId: transId, transName: transName, transLang: transLang, promoId: promoId, oldTransLang: oldTransLang},
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
                data: {values: 'deletePromotionTranslation', transId: transId},
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