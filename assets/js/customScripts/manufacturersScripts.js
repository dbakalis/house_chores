$(document).ready(function(){

    /** PRODUCTS LIST (index) START */
    function formatNum(num, separator, fraction) {
        var str = num.toLocaleString('en-US');
        str = str.replace(/\./, fraction);
        str = str.replace(/,/g, separator);
        return str;
    }

    // delete manufacturer
    $(".deleteManufacturer").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή του κατασκευαστή;')) {
            var manufId             = $(this).attr('manufId');
            var totalCounterVal     = parseInt($("#totalManufCounterSpan").text().replace(".", ""));
            var hiddenCounterVal    = parseInt($("#hiddenManufCounterSpan").text().replace(".", ""));
            var newTotalCounterVal  = totalCounterVal - 1;
            var newHiddenCounterVal = hiddenCounterVal - 1;
            var isHidden            = $(this).attr('manufHidden');
            var buttonDelete        = this;
            var buttonDeleteObj     = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteManufacturer', manufId: manufId},
                type: "POST", 
                success: function(output){
                    buttonDeleteObj.closest('tr').find('td').fadeOut('slow', 
                    function(buttonDelete){ 
                        $(buttonDelete).parents('tr:first').remove();                    
                    });

                    // decrease the counters
                    $("#totalManufCounterSpan").text(formatNum(newTotalCounterVal, ".", ","))
                    if( (isHidden == 0) && (hiddenCounterVal > 0) ){
                        $("#hiddenManufCounterSpan").text(formatNum(newHiddenCounterVal, ".", ","))
                    }
                }
            });
            
        }
    });

    // quick activity change
    $(".quickManufacturerActive").change(function() {
        var activitySwitch      = $(this);
        var manufId             = activitySwitch.attr('manufId');
        var newStatus           = (activitySwitch.is(':checked'))? 1 : 0;
        var hiddenCounterVal    = parseInt($("#hiddenManufCounterSpan").text().replace(".", ""));
        var newHiddenCounterVal = (activitySwitch.is(':checked'))? hiddenCounterVal - 1 : hiddenCounterVal + 1;

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickManufacturerActive', newStatus: newStatus, manufId: manufId},
            type: "POST", 
            success: function(output){
                // decrease the counters
                $("#hiddenManufCounterSpan").text(formatNum(newHiddenCounterVal, ".", ","))

                // change the activity attribute of the delete button too
                activitySwitch.closest('tr').find('.deleteManufacturer').attr('manufHidden', newStatus)
            }
        });
    });
    
    // quick show in menu change
    $(".quickManufacturerInMenu").change(function() {
        var manufId     = $(this).attr('manufId');
        var checkStatus = ($(this).is(':checked'))? 1 : 0;

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickManufacturerInMenu', newStatus: checkStatus, manufId: manufId},
            type: "POST", 
            success: function(output){	
                // do nothing
            }
        });
    });

    ///////////////////////////////TRANSLATIONS////////////////////////////
   
    // add manufacturer translation
    $("#addManufTranslation").click(function() {
        $("#modal_transCameFrom").val("add");
    });

    // perepare edit form of manufacturer translation
    $(".editManufTranslation").click(function() {
        var transId = $(this).attr('transId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareManufTranslEditForm', transId: transId},
            type: "POST", 
            success: function(output){	
                var transInfo = jQuery.parseJSON(output);

                $("#modal_transId").val(transId);
                $("#modal_transCameFrom").val("edit");
                $("#modal_transName").val(transInfo["foreignName"]);
                $("#modal_oldTransLang").val(transInfo["language"]);
                $('#modal_transLang option[value="'+transInfo["language"]+'"]').prop('selected', true);
            }
        });
    });

    // submit add / edit form of manufacturer translation
    $("#submitEditManufTransBtn").click(function() {
        var transId      = $("#modal_transId").val();
        var transName    = $("#modal_transName").val();
        var transLang    = $("#modal_transLang").val();
        var oldTransLang = $("#modal_oldTransLang").val();
        var manufId      = $("#modal_manufId").val();
        var cameFrom     = $("#modal_transCameFrom").val();

        if(transName == ""){
            alert("Συμπληρώστε τη ξένη ονομασία της διαθεσιμότητας για καταχώρηση!");
        }else{
            if(cameFrom == "add"){

                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {values: 'addManufacturerTranslation', transName: transName, transLang: transLang, manufId: manufId},
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
                    data: {values: 'editManufTranslation', transId: transId, transName: transName, transLang: transLang, manufId: manufId, oldTransLang: oldTransLang},
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

    // delete manufacturer translation
    $(".deleteTranslation").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή της μετάφρασης;')) {
            var transId         = $(this).attr('transId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteManufTranslation', transId: transId},
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