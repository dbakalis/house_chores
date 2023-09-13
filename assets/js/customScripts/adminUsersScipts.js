$(document).ready(function(){

    // delete admin user
    $(".deleteAdminUser").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή του διαχειριστή;')) {
            var adminId         = $(this).attr('adminId');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteAdminUser', adminId: adminId},
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

    // reset admin permissions
    $(".resetPermissions").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε επαναφορά δικαιωμάτων του διαχειριστή;')) {
            var adminId = $(this).attr('adminId');

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'resetPermissions', adminId: adminId},
                type: "POST", 
                success: function(output){	
                    location.reload();
                }
            });
            
        }
    });

    // on password type
    $("#password_add_edit_form").keyup(function() {
        var password          = $(this).val();
        var password_confirm  = $("#password_confirm_add_edit_form").val();

        if(password != ""){
            $("#password_confirm_add_edit_form").prop('required', true);
        }else{
            $("#password_confirm_add_edit_form").prop('required', false);
        }

        if( (password!="") && (password_confirm!="") && (password_confirm == password) ){
            $("#password_add_edit_form").removeClass("is-invalid");
            $("#password_confirm_add_edit_form").removeClass("is-invalid");
            
            $("#password_add_edit_form").addClass("is-valid");
            $("#password_confirm_add_edit_form").addClass("is-valid");
        }else if( (password!="") && (password_confirm!="") && (password_confirm != password) ){
            $("#password_add_edit_form").removeClass("is-valid");
            $("#password_confirm_add_edit_form").removeClass("is-valid");
            
            $("#password_add_edit_form").addClass("is-invalid");
            $("#password_confirm_add_edit_form").addClass("is-invalid");
        }else{
            $("#password_add_edit_form").removeClass("is-valid");
            $("#password_confirm_add_edit_form").removeClass("is-valid");
            $("#password_add_edit_form").removeClass("is-invalid");
            $("#password_confirm_add_edit_form").removeClass("is-invalid");
        }
    });

    // on password confirm type
    $("#password_confirm_add_edit_form").keyup(function() {
        var password_confirm = $(this).val();
        var password         = $("#password_add_edit_form").val();

        if(password_confirm != ""){
            $("#password_add_edit_form").prop('required', true);
        }else{
            $("#password_add_edit_form").prop('required', false);
        }

        if( (password!="") && (password_confirm!="") && (password_confirm == password) ){
            $("#password_add_edit_form").removeClass("is-invalid");
            $("#password_confirm_add_edit_form").removeClass("is-invalid");
            
            $("#password_add_edit_form").addClass("is-valid");
            $("#password_confirm_add_edit_form").addClass("is-valid");
        }else if( (password!="") && (password_confirm!="") && (password_confirm != password) ){
            $("#password_add_edit_form").removeClass("is-valid");
            $("#password_confirm_add_edit_form").removeClass("is-valid");
            
            $("#password_add_edit_form").addClass("is-invalid");
            $("#password_confirm_add_edit_form").addClass("is-invalid");
        }else{
            $("#password_add_edit_form").removeClass("is-valid");
            $("#password_confirm_add_edit_form").removeClass("is-valid");
            $("#password_add_edit_form").removeClass("is-invalid");
            $("#password_confirm_add_edit_form").removeClass("is-invalid");
        }

    });

    // PERMISSIONS PAGE //

    // check all "read" permissions checkboxes
    $("#checkAllRead").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("readCheckbox", checkStatus);
    });
    
    // check all "edit" permissions checkboxes
    $("#checkAllEdit").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("editCheckbox", checkStatus);
    });
    
    // check all "delete" permissions checkboxes
    $("#checkAllDelete").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;

        // check / uncheck boxes
        checkUncheckBoxes("deleteCheckbox", checkStatus);
    });

    // on edit check / uncheck do the action on read too
    $(".editCheckbox").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;
        $(this).closest('tr').find('input.readCheckbox:checkbox').prop('checked', checkStatus);
    });
    
    // on edit check / uncheck do the action on read too
    $(".deleteCheckbox").click(function() {
        var checkStatus = ($(this).is(':checked'))? true : false;
        $(this).closest('tr').find('input.readCheckbox:checkbox').prop('checked', checkStatus);
    });

    function checkUncheckBoxes(className, checkStatus){
        // get the list of checkboxes
        var elementList = $("."+className);
        
        for (var elementItem of elementList) {
            // change it depending on checkStatus
            $(elementItem).prop( "checked", checkStatus );
        }
    }
});

function replaceUrlBrowser(urlToGo){
    // relace the hash in the browser
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}