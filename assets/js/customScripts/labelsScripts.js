$(document).ready(function(){

    // delete label
    $(".deleteLabel").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή του ταμπελάκι;')) {
            var labelId         = $(this).attr('lblid');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteLabel', labelId: labelId},
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

    // edit label
    $(".editLabel").click(function() {
        var labelId = $(this).attr('lblid');

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareLabelEditForm', labelId: labelId},
            type: "POST", 
            success: function(output){	
                var labelInfo = jQuery.parseJSON(output);

                // set the camefrom hidden fields as edit
                $("#modal_labelCameFrom").val("edit");

                // some hidden fields values to use in editLabel function in post
                $("#modal_oldLabelName").val(labelInfo["labelName"]);
                $("#modal_oldLabelImage").val(labelInfo["labelImage"]);

                // set the rest fields
                $("#modal_labelId").val(labelId);
                $("#modal_labelName").val(labelInfo["labelName"]);
                $('#modal_labelShowType option[value="'+labelInfo["labelShowType"]+'"]').prop('selected', true);
                $("#modal_imageLabelSrc").attr("src","../../images/labelImages/"+labelInfo["labelImage"]);
            }
        });
    });

    // add label
    $("#addLabel").click(function() {
        $("#modal_labelCameFrom").val("add");
    });

    // when the modal gets hidden reset its fields
    $('#addEditLabelModal').on('hidden.bs.modal', function () {
        $("#modal_labelId").val("");
        $("#modal_labelCameFrom").val("");
        $("#modal_labelName").val("");
        $("#modal_imageLabelSrc").attr("src","");
        $('#modal_labelShowType option[0]').prop('selected', true);
    });

    ///////////////////////////////TRANSLATIONS/////////////////////////////
    
    // add availability translation
   
    $("#addLabelTranslation").click(function() {
        $("#modal_transCameFrom").val("add");
    });

    // perepare edit form of label translation
    $(".editLabelTranslation").click(function() {
        var transId = $(this).attr('transId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareLabelTranslEditForm', transId: transId},
            type: "POST", 
            success: function(output){	
                var transInfo = jQuery.parseJSON(output);

                $("#modal_transId").val(transId);
                $("#modal_transCameFrom").val("edit");
                $("#modal_transName").val(transInfo["foreignName"]);
                $("#modal_oldTransLang").val(transInfo["language"]);
                $("#modal_oldTransImage").val(transInfo["foreignImage"]);
                $('#modal_transLang option[value="'+transInfo["language"]+'"]').prop('selected', true);
                $("#modal_transImgSrc").attr("src","../../images/labelImages/"+transInfo["foreignImage"]);
            }
        });
    });

    // delete label translation
    $(".deleteTranslation").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή της μετάφρασης;')) {
            var transId         = $(this).attr('transId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteLabelTranslation', transId: transId},
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
    $('#addEditLabelsTranslationsModal').on('hidden.bs.modal', function () {
        $("#modal_transId").val("");
        $("#modal_transCameFrom").val("");
        $("#modal_transName").val("");
        $("#modal_oldTransImage").val("");
        $("#modal_oldTransLang").val("");
        $('#modal_transLang option[0]').prop('selected', true);
        $("#modal_transImgSrc").attr("src","");
    });

});