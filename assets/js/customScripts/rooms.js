$(document).ready(function(){

    // delete room
    $(".delete-room").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var room_id = $(this).data('room-id');

            $.ajax({
                url: "ajax_functions.php",
                data: {values: 'deleteRoom', room_id: room_id},
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