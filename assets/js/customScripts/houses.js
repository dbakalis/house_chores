$(document).ready(function(){

    // quick house activity change
    $(".quick-house-activity").change(function() {
        var house_id  = $(this).data("house-id");
        var newStatus = ($(this).is(':checked'))? 1 : 0;

        $.ajax({
            url: "ajax_functions.php",
            data: {values: 'houseActivityChange', house_id: house_id, newStatus: newStatus},
            type: "POST", 
            success: function(output){
                // console.log(output);
            }
        });
    });

    // delete house
    $(".delete-house").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var house_id = $(this).data('house-id');

            $.ajax({
                url: "ajax_functions.php",
                data: {values: 'deleteHouse', house_id: house_id},
                type: "POST", 
                success: function(output){	
                    location.reload();
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