$(document).ready(function(){
   
    // delete shipping module
    $(".deleteShipping").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή του τρόπου αποστολής;')) {
            var shipping_id     = $(this).attr('shippingid');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteShipping', shipping_id: shipping_id},
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

    // quick shipping module activity change
    $(".quickShippingActive").change(function() {
        var shipping_id = $(this).attr("shippingid");
        var newStatus   = ($(this).is(':checked'))? 1 : 0;

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'quickActivityChange', shipping_id: shipping_id, newStatus: newStatus},
            type: "POST", 
            success: function(output){	
                // do nothing
            }
        });
    });

    /** Add shipping module
     * 
     * It inserts to database a shipping module and gets its id in order
     * to redirect to an edit page with that id
     */
    $("#addShippingbtn").click(function() {
        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'addShipping'},
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

});

function replaceUrlBrowser(urlToGo){
    // relace the hash in the browser
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}