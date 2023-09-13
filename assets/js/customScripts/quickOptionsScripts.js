$(document).ready(function(){

    // on quick options modal close refresh the page
    $('#quickOptionsModal').on('hidden.bs.modal', function () {
        location.reload();
    });

    // populate quick options modal with content
    $("#prodsListTbody").on("click", ".quickOptionsShowBtn", function () {
        var prodId  = $(this).attr("prodId");

        $('#moreCatsProdsModal').data('product-id', prodId);

        // fill hidden modal fields
        $("#hidProdIdQuickOptModal").val(prodId)

        // get options bot of selected product for prices table - tab options
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'printQuickOptionsBotPrices', prodId: prodId},
            type: "POST", 
            success: function(output){
                $("#quickTbodyBotsPrices").html(output)
            }
        });

        if(optStockUse == 1){
            refreshQuickOptionsStock(prodId);
        }
    });

    // options top select tag in quick options
    $('#optionTopSelector').change(function(e) {
        var optIdSelected   = $(this).val();
        var prodId          = $("#hidProdIdQuickOptModal").val();

        if(optIdSelected == 0){
            $("#optionsMidChecksRow").addClass("d-none");
            $("#optionsMidChecksArea").html(""); 
        }else{
            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'printQuickOptMidCheckboxes', optTopId: optIdSelected, product: prodId},
                type: "POST", 
                success: function(output){	
                    $("#optionsMidChecksRow").removeClass("d-none"); 
                    $("#optionsMidChecksArea").html(output); 
                    $("#optionsMidChecksRow").show();
                }
            });	
        }
    });

    // submit options mid button in quick options
    $("#quickOptionsModal").on("click", "#quickUpdateBotBtn", function () {
        var checkedMids     = [];
        var prodId          = $("#hidProdIdQuickOptModal").val();
        var topId           = $("#optionTopSelector").val();

        // find out what option mid is checked and what is not and store them in arrays
        $('input[name^="assignValuesMids"]').each(function(){
            if($(this).is(':checked')){
                checkedMids.push($(this).attr("id"));
            }
        });

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'addOptionsBot', checkedMids: checkedMids, product: prodId, topOpt: topId},
            type: "POST", 
            success: function(output){

                // refresh mid selector and hide the area of mid checkboxes
                $("#optionTopSelector").val($("#optionTopSelector option:first").val());
                $("#optionsMidChecksRow").hide();

                // refresh quickTbodyBots prices table
                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {values: 'printQuickOptionsBotPrices', prodId: prodId},
                    type: "POST", 
                    success: function(output){
                        console.log(output)
                        $("#quickTbodyBotsPrices").html(output);
                        
                        refreshQuickOptionsStock(prodId);
                    }
                });
            }
        });
    });

    // delete option bot from table with prices
    $("#quickOptionsModal").on("click", ".quickDeleteBot", function () {
        var botAssignId = $(this).attr("botId");
        var prodId      = $("#hidProdIdQuickOptModal").val();

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'deleteOptionBot', botAssignId: botAssignId, prodId: prodId},
            type: "POST", 
            success: function(output){
                // refresh mid selector and hide the area of mid checkboxes
                $("#optionTopSelector").val($("#optionTopSelector option:first").val());
                $("#optionsMidChecksRow").hide();

                // refresh quickTbodyBots prices table
                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {values: 'printQuickOptionsBotPrices', prodId: prodId},
                    type: "POST", 
                    success: function(output2){
                        $("#quickTbodyBotsPrices").html(output2);

                        refreshQuickOptionsStock(prodId);
                    }
                });
            }
        });
    });
    
    // update option bot prices
    $("#quickOptionsModal").on("click", ".quickUpdateBotPrices", function () {
        var botId       = $(this).val();
        var price       = $("#quickBotPrice_" + botId).val().replace(",", ".");
        var priceMode   = $("#incDecrPriceMode_" + botId).val();

        if(parseInt(price) >= 0){
            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'updateOptionsBotPrices', botId: botId, price: price, priceMode: priceMode},
                type: "POST", 
                success: function(output){
                    $("#messagesArea").hide();
                    $("#messagesArea").fadeIn();
                    $("#messagesArea").html("");
                    $("#messagesArea").html('<div class="alert alert-success text-white" role="alert">Επιτυχής ενημέρωση!</div>');
                }
            });
        }else{
            $("#messagesArea").hide();
            $("#messagesArea").fadeIn();
            $("#messagesArea").html("");
            $("#messagesArea").html('<div class="alert alert-danger text-white" role="alert">Εισάγετε θετικό αριθμό στη τιμή!</div>');
        }        
    });

    // check what the user is typing in the price inputs
    $("#quickOptionsModal").on("keyup", ".quickPriceInpt", function (e) {
        $("#messagesArea").hide();
        
        if (e.which == 188) {
            $("#messagesArea").hide();
            $("#messagesArea").fadeIn();
            $("#messagesArea").html("");
            $("#messagesArea").html('<div class="alert alert-danger" role="alert">Χρησιμοποιήστε τελεία για το διαχωρισμό δεκαδικών!</div>');
        }
        if (e.which == 190) {
            $("#messagesArea").hide();
            $("#messagesArea").html("");
        }

        reg = /[,]/g;
        $(this).val( $(this).val().replace(reg,"") ) ;
    });

    // update stock options
    $("#quickOptionsModal").on("click", "#quickOptStockUpdateMass", function () {
        var prodId          = $("#hidProdIdQuickOptModal").val();
        var optStockNumArr  = [];
        var optStocCodekArr = [];
        var optStocIdArr    = [];

        $.each($(".optStockNum"), function( index, stockElementInpt ) {
            optStockNumArr.push($(stockElementInpt).val());
        });
        
        $.each($(".optStockCode"), function( index, stockCodeElementInpt ) {
            optStocCodekArr.push($(stockCodeElementInpt).val());
        });
        
        $.each($(".stockComboId"), function( index, stockIdElementInpt ) {
            optStocIdArr.push($(stockIdElementInpt).val());
        });

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickUpdateOptionStock', prodId: prodId, optStockNumArr: optStockNumArr, optStocCodekArr: optStocCodekArr, optStocIdArr: optStocIdArr},
            type: "POST", 
            success: function(negativeStockIds){
                $.each($(".optStockNum"), function( index, stockElementInpt ) {
                    if($(stockElementInpt).val()==0){
                        $(stockElementInpt).addClass("is-invalid");
                    }else{
                        $(stockElementInpt).addClass("is-valid");
                    }
                });

                // mark with red the negatives
                if(negativeStockIds != ""){
                    var negativeIds = negativeStockIds.split(",");

                    $.each(negativeIds, function( index, negativeId ) {
                        $("#optStockNum_"+negativeId).removeClass("is-valid");
                        $("#optStockNum_"+negativeId).addClass("is-invalid");
                    });
                }

                refreshQuickOptionsTotalStock();
            }
        });

    });

    function refreshQuickOptionsStock(prodId) {
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'printQuickOptionsStock', prodId: prodId},
            type: "POST", 
            success: function(output){
                $("#quickTbodyOptStock").html(output)
                
                refreshQuickOptionsTotalStock();
            }
        });
    }

    function refreshQuickOptionsTotalStock() {
        var totalQuantity = 0;
        $("#quickTbodyOptStock tr .optStockNum").each(function(i, inputEl) {
            totalQuantity += parseInt(inputEl.value);
        });

        $('#quickOptionsModal .total-quantity .value').text(totalQuantity);
    }
});