$(document).ready(function(){

    // delete availability
    $(".deleteAvailability").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή της διαθεσιμότητας;')) {
            var availId         = $(this).attr('availId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteAvailability', availId: availId},
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

    // edit availability
    $(".editAvailability").click(function() {
        var availId = $(this).attr('availId');

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareAvailabilityEditForm', availId: availId},
            type: "POST", 
            success: function(output){	
                var availInfo = jQuery.parseJSON(output);

                // set the camefrom hidden fields as edit
                $("#modal_availCameFrom").val("edit");

                // some hidden fields values to use in editAvailability function in post
                $("#modal_oldAvailabilityName").val(availInfo["availabilityName"]);
                $("#modal_oldAvailabilityImage").val(availInfo["availabilityImage"]);

                // set the rest fields
                $("#modal_availId").val(availId);
                $("#modal_availName").val(availInfo["availabilityName"]);
                $("#modal_availFontColor").val(availInfo["availabilityFontColor"]);
                $('#modal_availShowType option[value="'+availInfo["availabilityShowType"]+'"]').prop('selected', true);
                $("#modal_imageAvailSrc").attr("src","../../images/availabilityImages/"+availInfo["availabilityImage"]);
            }
        });
    });

    // add availability
    $("#addAvailability").click(function() {
        $("#modal_availCameFrom").val("add");
    });

    // when the modal gets hidden reset its fields
    $('#addEditAvailabilityModal').on('hidden.bs.modal', function () {
        $("#modal_availId").val("");
        $("#modal_availCameFrom").val("");
        $("#modal_availName").val("");
        $("#modal_availFontColor").val("");
        $("#modal_imageAvailSrc").attr("src","");
        $('#modal_availShowType option[0]').prop('selected', true);
    });

    ///////////////////////////////TRANSLATIONS/////////////////////////////
    
    // add availability translation
    $("#addAvailabilityTranslation").click(function() {
        $("#modal_transCameFrom").val("add");
    });

    // perepare edit form of availability translation
    $(".editAvailabilityTranslation").click(function() {
        var transId = $(this).attr('transId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareAvailTranslEditForm', transId: transId},
            type: "POST", 
            success: function(output){	
                var transInfo = jQuery.parseJSON(output);

                $("#modal_transId").val(transId);
                $("#modal_transCameFrom").val("edit");
                $("#modal_transName").val(transInfo["foreignName"]);
                $("#modal_oldTransImage").val(transInfo["foreignImage"]);
                $("#modal_oldTransLang").val(transInfo["language"]);
                $("#modal_transImgSrc").attr("src","../../images/availabilityImages/"+transInfo["foreignImage"]);
                $('#modal_transLang option[value="'+transInfo["language"]+'"]').prop('selected', true);
            }
        });
    });

    // delete availability translation
    $(".deleteTranslation").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή της μετάφρασης;')) {
            var transId         = $(this).attr('transId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteAvailabilityTranslation', transId: transId},
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

    // when the translations modal gets hidden reset its fields
    $('#addEditAvailabilityTranslationsModal').on('hidden.bs.modal', function () {
        $("#modal_transId").val("");
        $("#modal_transCameFrom").val("");
        $("#modal_transName").val("");
        $("#modal_oldTransImage").val("");
        $("#modal_oldTransLang").val("");
        $('#modal_transLang option[0]').prop('selected', true);
        $("#modal_transImgSrc").attr("src","");
    });

});