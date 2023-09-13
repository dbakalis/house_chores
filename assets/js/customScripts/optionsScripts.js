$(document).ready(function(){

    ///------------------------------OPTION TOP-----------------------------------------------///

    // delete option top
    $("#optionsTopTBody").on("click", ".deleteOptionTop", function () {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να διαγράψετε το χαρατηριστικό αυτό;')) {
            var idPressed       = $(this).attr("optTopId");
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteOptionTop', idPressed: idPressed},
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
    
    // populate option top edit modal
    $("#optionsTopTBody").on("click", ".editOptionTop", function () {
        var optTopId   = $(this).attr("optTopId");
       
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareOptionEditTopForm', optTopId: optTopId},
            type: "POST", 
            success: function(output){	
                var jsonInfo = jQuery.parseJSON(output);
                
                $("#modal_optTopId").val(jsonInfo[0]["option_id"]);
                $("#modal_optTopName").val(jsonInfo[0]["option_name"]);
                $('#modal_optTopFilter option[value="'+jsonInfo[0]["show_on_filter"]+'"]').prop('selected', true);
                $('#modal_optTopCateg option[value="'+jsonInfo[0]["show_on_catProdLoop"]+'"]').prop('selected', true);
                $('#modal_optTopCart option[value="'+jsonInfo[0]["show_on_cart"]+'"]').prop('selected', true);
                $('#modal_optTopIsDropdown option[value="'+jsonInfo[0]["isDropdown"]+'"]').prop('selected', true);
                $("#modal_optTopList").val(jsonInfo[0]["list_no"]);
            }
        });        
    });

    // options top edit modal submit
    $("#optionsTopModal").on("click", "#modal_optTopSubmit", function () {
        var optTopId 	        = $("#modal_optTopId").val();
		var optTopName 	        = $("#modal_optTopName").val();
		var optTopShowFilters   = $("#modal_optTopFilter").val();
		var optTopShowCatProd   = $("#modal_optTopCateg").val();
		var optTopShowCart      = $("#modal_optTopCart").val();
		var optTopIsDropdown    = $("#modal_optTopIsDropdown").val();
		var optToplistNo        = $("#modal_optTopList").val();

        if(optTopName == ""){
            alert("Παρακαλούμε συμπληρώστε την ονομασία του χαρακτηριστικού πριν τη καταχώρηση.");
        }else{
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'editOptionTop', 
                    topId: optTopId, 
                    topName: optTopName,
                    topFilters: optTopShowFilters,
                    topCatProd: optTopShowCatProd,
                    topCart: optTopShowCart,
                    topDrowdown: optTopIsDropdown,
                    topListNo: optToplistNo,
                },
                type: "POST", 
                success: function(updateResult){
                    location.reload();
                }
            });	
        }

    });

    // add new option top
    $("#optionsTopTBody").on("click", "#addNewOptTopBtn", function () {
        var optTopName      = $("#newOptTopName").val();
        var optTopFilter    = $("#newOptTopFilter").val();
        var optTopCatProd   = $("#newOptTopCatProd").val();
        var optTopCart      = $("#newOptTopCart").val();
        var optTopIsDrop    = $("#newOptTopIsDrop").val();
        var optTopListNo    = $("#newOptTopListNo").val();

        if(optTopName == ""){
            alert("Παρακαλούμε συμπληρώστε την ονομασία του χαρακτηριστικού πριν τη καταχώρηση.");
        }else{
            // update options top
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'addOptionTop', 
                    name: optTopName,
                    useFilter: optTopFilter,
                    useCatProd: optTopCatProd,
                    useCart: optTopCart,
                    isDrop: optTopIsDrop,
                    listno: optTopListNo,
                },
                type: "POST", 
                success: function(output){
                    window.location.href = "index.php";
                }
            });
        }
    });

    ///------------------------------OPTION TOP TRANSLATIONS-------------------------------------///

    // delete translation top
    $("#optionTopTranslationsTbody").on("click", ".deleteOptionTopTranslation", function () {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να διαγράψετε τη μετάφραση του χαρατηριστικό αυτού;')) {
            var topTransId      = $(this).attr("transId");
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteOptionTopTranslation', topTransId: topTransId},
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
    
    // prepare translation modal top
    $("#optionTopTranslationsTbody").on("click", ".editOptionTopTranslation", function () {
        var transTopId = $(this).attr("transTopId");

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareOptionTopTranslationsForm', transTopId: transTopId},
            type: "POST", 
            success: function(output){	
                if(output != ""){
                    var jsonInfo = jQuery.parseJSON(output);
                    
                    $("#modal_transTopId").val(transTopId);
                    $("#modal_optTopTransName").val(jsonInfo[0]["foreignName"]);
                    $('#modal_optTopTransLang option[value="'+jsonInfo[0]["language"]+'"]').prop('selected', true);
                }else{
                    $("#optionsTopTranslationsModal").hide();
                }
            }
        });
    });

    // options top edit modal submit
    $("#optionsTopTranslationsModal").on("click", "#modal_optTopTransSubmit", function () {
        var transId 	        = $("#modal_transTopId").val();
		var transName 	        = $("#modal_optTopTransName").val();
		var transLang           = $("#modal_optTopTransLang").val();

        if(transName == ""){
            alert("Παρακαλούμε συμπληρώστε την μεταφρασμένη ονομασία του χαρακτηριστικού πριν τη καταχώρηση.");
        }else{
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'editOptionTopTranslation', 
                    transId: transId, 
                    transName: transName,
                    transLang: transLang
                },
                type: "POST", 
                success: function(output){
                    location.reload();
                }
            });	
        }

    });

    // add new option top translation
    $("#optionTopTranslationsTbody").on("click", "#addNewOptTopTransBtn", function () {
        var opttopId        = $("#topId").val();
        var optTopTransName = $("#newOptTopTransName").val();
        var optTopTransLang = $("#newOptTopTransLang").val();

        if(optTopTransName == ""){
            alert("Παρακαλούμε συμπληρώστε την ονομασία του χαρακτηριστικού πριν τη καταχώρηση.");
        }else{
            // update options top
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'addOptionTopTranslation', 
                    topId: opttopId,
                    transName: optTopTransName,
                    trasnLang: optTopTransLang,
                },
                type: "POST", 
                success: function(output){
                    if(output == 9){
                        alert("Υπάρχει ήδη καταχωρημένη μετάφραση σε αυτή τη γλώσσα!");
                    }else{
                        location.reload();
                    }
                }
            });
        }
    });
    
    ///------------------------------------OPTION MID----------------------------------------///

    // filter options mid
    $("#optTopFilterMid").change(function() {
        var optTopId = $(this).val();

        // redirect with option top on change
        window.location.href = "index.php?page_no=1&topId="+optTopId;
    });

    // delete option mid
    $("#optionsMidTBody").on("click", ".deleteOptionMid", function () {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να διαγράψετε την παράμετρο αυτή;')) {
            var idsPressed 	    = $(this).attr("optMidInfo").split("<||>");
            var optMidId 	    = idsPressed[0];
            var optTopId 	    = idsPressed[1];
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteOptionMid', optMidId: optMidId, optTopId: optTopId},
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

    // populate option mid edit modal
    $("#optionsMidTBody").on("click", ".editOptionMid", function () {
        var optMidId = $(this).attr("optMidId");

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareOptionEditMidForm', optMidId: optMidId},
            type: "POST", 
            success: function(output){
                var jsonInfo = jQuery.parseJSON(output);

                $("#modal_optMidId").val(optMidId);
                $("#modal_optMidName").val(jsonInfo[0]["value_name"]);
                $("#modal_optMidList").val(jsonInfo[0]["list"]);
                $('#modal_optMidFather option[value="'+jsonInfo[0]["option_id"]+'"]').prop('selected', true);
                $('#modal_optMidStock option[value="'+jsonInfo[0]["value_stock"]+'"]').prop('selected', true);
            }
        });

    });

    // options mid edit modal submit
    $("#optionsMidModal").on("click", "#modal_optMidSubmit", function () {
        var optMidId 	 = $("#modal_optMidId").val();
		var optMidName 	 = $("#modal_optMidName").val();
		var optMidFather = $("#modal_optMidFather").val();
		var optMidList   = $("#modal_optMidList").val();
		var optMidStock  = $("#modal_optMidStock").val();

        if(optMidName == ""){
            alert("Παρακαλούμε συμπληρώστε την ονομασία της παραμέτρου πριν τη καταχώρηση.");
        }else{
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'editOptionMid', 
                    optMidId: optMidId, 
                    optMidName: optMidName,
                    optMidFather: optMidFather,
                    optMidList: optMidList,
                    optMidStock: optMidStock
                },
                type: "POST", 
                success: function(updateResult){
                    location.reload();
                }
            });	
        }

    });

    // add new option mid
    $("#optionsMidTBody").on("click", "#newOptMidBtn", function () {
        var optMidName      = $("#newOptMidName").val();
        var optMidListNo    = $("#newOptMidList").val();
        var newOptMidFather = $("#newOptMidFather").val();
        var newOptMidStock  = $("#newOptMidStock").val();

        if(optMidName == ""){
            alert("Παρακαλούμε συμπληρώστε την ονομασία της παραμέτρου πριν τη καταχώρηση.");
        }else{
            // update options top
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'addOptionMid', 
                    name: optMidName,
                    father: newOptMidFather,
                    stock: newOptMidStock,
                    listno: optMidListNo,
                },
                type: "POST", 
                success: function(output){
                    location.reload();
                }
            });
        }
    });

    // populate option mid edit modal - we can use the same function as in edit option mid cause it gives the date we ned
    $("#optionsMidTBody").on("click", ".editOptionMidImage", function () {
        var optMidId = $(this).attr("optMidId");

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareOptionEditMidForm', optMidId: optMidId},
            type: "POST", 
            success: function(output){
                var jsonInfo = jQuery.parseJSON(output);

                $("#modal_imageMidId").val(optMidId);
                $("#modal_imageMidSrc").attr("src", "../../images/optionImages/"+jsonInfo[0]["opt_image"]);
            }
        });
    });

    // delete option mid image
    $("#optionsMidTBody").on("click", ".removeOptionMidImage", function () {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να αφαιρέσετε την εικόνα;')) {
            var optMidId = $(this).attr("optMidId");

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'removeOptionMidImage', optMidId: optMidId},
                type: "POST", 
                success: function(output){
                    location.reload();
                }
            });

        }		
    });

    ///------------------------------------OPTION MID TRANSLATIONS-------------------------------///

    // delete translations mid
    $("#optionMidTranslationsTbody").on("click", ".deleteOptionMidTranslation", function () {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να διαγράψετε τη μετάφραση της παραμέτρου αυτής;')) {
            var midTransId      = $(this).attr("transId");
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteOptionMidTranslation', midTransId: midTransId},
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

    // prepare translation modal mid
    $("#optionMidTranslationsTbody").on("click", ".editOptionMidTranslation", function () {
        var transMidId = $(this).attr("transMidId");

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareOptionMidTranslationsForm', transMidId: transMidId},
            type: "POST", 
            success: function(output){	
                if(output != ""){
                    var jsonInfo = jQuery.parseJSON(output);
                    
                    $("#modal_transMidId").val(transMidId);
                    $("#modal_optMidTransName").val(jsonInfo[0]["foreignName"]);
                    $('#modal_optMidTransLang option[value="'+jsonInfo[0]["language"]+'"]').prop('selected', true);
                }else{
                    $("#optionsMidTranslationsModal").hide();
                }
            }
        });
    });

    // options top edit modal submit
    $("#optionsMidTranslationsModal").on("click", "#modal_optMidTransSubmit", function () {
        var transId 	        = $("#modal_transMidId").val();
		var transName 	        = $("#modal_optMidTransName").val();
		var transLang           = $("#modal_optMidTransLang").val();

        if(transName == ""){
            alert("Παρακαλούμε συμπληρώστε την μεταφρασμένη ονομασία της παραμέτρου πριν τη καταχώρηση.");
        }else{
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'editOptionMidTranslation', 
                    transId: transId, 
                    transName: transName,
                    transLang: transLang
                },
                type: "POST", 
                success: function(output){
                    location.reload();
                }
            });	
        }

    });

    // add new option mid translation
    $("#optionMidTranslationsTbody").on("click", "#addNewOptmidTransBtn", function () {
        var optMidId        = $("#midId").val();
        var optMidTransName = $("#newOptMidTransName").val();
        var optMidTransLang = $("#newOptMidTransLang").val();

        if(optMidTransName == ""){
            alert("Παρακαλούμε συμπληρώστε την ονομασία της παραμέτρου πριν τη καταχώρηση.");
        }else{
            // update options top
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'addOptionMidTranslation', 
                    midId: optMidId,
                    transName: optMidTransName,
                    trasnLang: optMidTransLang,
                },
                type: "POST", 
                success: function(output){
                    if(output == 9){
                        alert("Υπάρχει ήδη καταχωρημένη μετάφραση σε αυτή τη γλώσσα!");
                    }else{
                        location.reload();
                    }
                }
            });
        }
    });

});