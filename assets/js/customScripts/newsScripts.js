$(document).ready(function(){

    /** NEWS LIST (index) START */

    // quick activity change
    $("#newsListTbody").on("click", ".quickNewsActive", function () {
        var newsId      = $(this).attr("newsId");
        var checkStatus = ($(this).is(':checked'))? 1 : 0;
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickActivityChange', newsId: newsId, newStatus: checkStatus},
            type: "POST", 
            success: function(output){	

            }
        });
    });

    // populate extra categories modal
    $("#newsListTbody").on("click", ".moreCatsNewsBtn", function () {
        var perssedVal  = $(this).attr("newsId").split("<||>");
		var newsId 	    = perssedVal[0];
		var catId 	    = perssedVal[1];

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'printListNewsExtraCats', newsId: newsId, catId: catId},
            type: "POST", 
            success: function(output){	
                $("#modalNewsMoreCatsBody").html(output);
            }
        });	
    });

    // on close of extra categories refresh the page
    $('#moreCatsNewsModal').on('hidden.bs.modal', function () {
        location.reload();
    });

    // add / remove extra category
    $("#moreCatsNewsModal").on("click", ".addRemoveNewsCatBtn", function () {
        var button      = $(this);
        var selectedVal = $(this).val();
		var catNewsIds  = selectedVal.split("<||>");
		var catId 	    = catNewsIds[0];
		var newsId 	    = catNewsIds[1];

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'addRemoveNewsExtraCategory', catId: catId, newsId: newsId},
            type: "POST", 
            success: function(output){
                console.log(output)
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

    // delete news
    $(".deleteNews").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);
            var newsId          = $(this).attr("newsId");

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteNews', newsId: newsId},
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
    
    // save preview settings of the listing table
    $("#newsPreviewSettingsSaveBtn").click(function() {
        var checked_image       = ($("#prevSetting_image").is(':checked'))? 1 : 0;
        var checked_date        = ($("#prevSetting_date").is(':checked'))? 1 : 0;
        var checked_timestamp   = ($("#prevSetting_timestamp").is(':checked'))? 1 : 0;

        $.ajax({
            url: "ajaxFunctions.php",
            data: {
                values: 'savePreviewSettings', 
                settingsPreview: {
                    image: checked_image, 
                    date: checked_date, 
                    timestamp: checked_timestamp
                }
            },
            type: "POST", 
            success: function(output){	
                location.reload();
            }
        });
    });

    /** NEWS LIST (index) END */


    /** NEWS TRANSLATIONS START */

    // add news translation
    $("#addNewsTranslation").click(function() {
        $("#modal_transCameFrom").val("add");
    });

    // perepare edit form of news translation
    $(".editNewsTranslation").click(function() {
        var transId = $(this).attr('transId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareNewsTranslEditForm', transId: transId},
            type: "POST", 
            success: function(output){	
                var transInfo = jQuery.parseJSON(output);

                $("#modal_transId").val(transId);
                $("#modal_transCameFrom").val("edit");
                $("#modal_transName").val(transInfo["foreignName"]);
                CKEDITOR.instances["modal_transDescr"].setData(transInfo["foreignDescription"])
                CKEDITOR.instances["modal_transShortDescr"].setData(transInfo["foreignShortDescription"])
                $("#modal_oldTransLang").val(transInfo["language"]);
                $('#modal_transLang option[value="'+transInfo["language"]+'"]').prop('selected', true);
            }
        });
    });

    // submit add / edit form of news translation
    $("#submitEditNewsTransBtn").click(function() {
        var transId         = $("#modal_transId").val();
        var transName       = $("#modal_transName").val();
        var transLang       = $("#modal_transLang").val();
        var oldTransLang    = $("#modal_oldTransLang").val();
        var newsId          = $("#modal_newsId").val();
        var transDescr      = CKEDITOR.instances.modal_transDescr.getData();
        var transShortDescr = CKEDITOR.instances.modal_transShortDescr.getData();
        var cameFrom        = $("#modal_transCameFrom").val();

        if(transName == ""){
            alert("Συμπληρώστε τη ξένη ονομασία της διαθεσιμότητας για καταχώρηση!");
        }else{
            if(cameFrom == "add"){

                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {
                        values: 'addNewsTranslation', 
                        transName: transName, 
                        transDescr: transDescr, 
                        transShortDescr: transShortDescr, 
                        transLang: transLang, 
                        newsId: newsId
                    },
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
                    data: {
                        values: 'editNewsTranslation', 
                        transId: transId, 
                        transName: transName, 
                        transDescr: transDescr, 
                        transShortDescr: transShortDescr,
                        transLang: transLang, 
                        newsId: newsId, 
                        oldTransLang: oldTransLang
                    },
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
                data: {values: 'deleteNewsTranslation', transId: transId},
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

    /** NEWS TRANSLATIONS END */
});

function replaceUrlBrowser(urlToGo){
    // relace the hash in the browser
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}