$(document).ready(function(){
    
    // delete chore
    $(".delete-chore").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var chore_id = $(this).data('chore-id');

            $.ajax({
                url: "ajax_functions.php",
                data: {values: 'deleteChore', chore_id: chore_id},
                type: "POST", 
                success: function(output){	
                    location.reload();
                }
            });
        }
    });

});