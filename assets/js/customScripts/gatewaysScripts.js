$(document).ready(function() {
    /** Add shipping module
     * 
     * It inserts to database a gateway module and gets its id in order
     * to redirect to an edit page with that id
     */
    $("#addGatewaybtn").click(function() {
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'addGateway'},
            type: "POST", 
            success: function(insert_id){	
                if( (insert_id == 0) || (insert_id == 'insert_fail') || (insert_id == '') ){
                    alert("Αποτυχία εισαγωγής");
                }else{
                    window.location.href = "edit.php?id="+insert_id;
                }
            }
        });
    });

    // delete gateway module
    $(".deleteGateway").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή του τρόπου αποστολής;')) {
            var gateway_id     = $(this).attr('gatewayid');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteGateway', gateway_id: gateway_id},
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

    // quick gateway module activity change
    $(".quickGatewayActive").change(function() {
        var gateway_id = $(this).attr("gatewayid");
        var newStatus   = ($(this).is(':checked'))? 1 : 0;

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickActivityChange', gateway_id: gateway_id, newStatus: newStatus},
            type: "POST", 
            success: function(output){	
                // do nothing
            }
        });
    });
});
