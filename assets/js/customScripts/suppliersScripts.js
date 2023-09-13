$(document).ready(function(){

    // delete supplier
    $(".deleteSupplier").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή του προμηθευτή;')) {
            var suplId         = $(this).attr('suplId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteSupplier', suplId: suplId},
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

    // add supplier
    $("#addSupplier").click(function() {
        $("#modal_suplCameFrom").val("add");
    });

    // edit supplier
    $(".editSupplier").click(function() {
        var suplId = $(this).attr('suplId');
        
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareSupplierEditForm', suplId: suplId},
            type: "POST", 
            success: function(output){	
                var supplierInfo = jQuery.parseJSON(output);

                $("#modal_suplCameFrom").val("edit");
                $("#modal_suplId").val(suplId);
                $("#modal_suplName").val(supplierInfo["supplierName"]);
                $("#modal_imageSuplSrc").attr("src","../../images/supplierImages/"+supplierInfo["supplierImage"]);

                $("#modal_oldSupplierName").val(supplierInfo["supplierName"]);
                $("#modal_oldSupplierImage").val(supplierInfo["supplierImage"]);
            }
        });
    });

    // when the add / edit modal is hidden then empty its fields
    $('#addEditSuppliersModal').on('hidden.bs.modal', function () {
        $("#modal_suplId").val("");
        $("#modal_suplCameFrom").val("");
        $("#modal_suplName").val("");
        $("#modal_imageSuplSrc").attr("src","");
    });
    
});