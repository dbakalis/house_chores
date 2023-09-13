$(document).ready(function() {
    $('.btn-save').click(function(e) {
        // try to get id of the group in case we edit
        var groupId = $('#addGroupModal').attr('data-group-id');
        var isEdit = typeof groupId !== 'undefined';

        // get values for save (or edit)
        var groupName = $('input[name="name"]').val();
        var discount = $('input[name="discount"]').val();

        // no group name or no discount value provided
        if (groupName.trim().length === 0 || discount.length === 0) {
            return;
        }

        if (!isEdit) { // is save
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'createGroupAjax',
                    name: groupName,
                    discount: discount,
                },
                type: "POST", 
                success: function(added) {
                    // make response code (0 or 1) an integer
                    added = parseInt(added);

                    if (added) {
                        // close add modal
                        $('#addGroupModal').modal('hide');
                        // reload page to show the new group
                        location.reload();
                    }
                },
            });
        } else {
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'editGroupAjax',
                    name: groupName,
                    discount: discount,
                    ['group-id']: groupId,
                },
                type: "POST", 
                success: function(edited) {
                    // make response code (0 or 1) an integer
                    edited = parseInt(edited);

                    if (edited) {
                        // get table row of group edited
                        var tableRowOfGroup = $('tr[data-group-id="' + groupId + '"]');
                        // set new values and change data attributes which hold their values
                        tableRowOfGroup.find('[data-name]').html(groupName).attr('data-name', groupName);
                        tableRowOfGroup.find('[data-discount]').html(discount + '%').attr('data-discount', discount);

                        // close edit modal
                        $('#addGroupModal').modal('hide');
                    }
                },
            });
        }
    });

    $('.btn-edit').click(function(e) {
        // get group id from table row data attribute
        var groupId = $(e.target).closest('tr').data('groupId');
        // get group name from element data attribute
        var groupName = $(e.target).closest('tr').find('[data-name]').attr('data-name');
        // get discount value from element data attribute
        var discount = $(e.target).closest('tr').find('[data-discount]').attr('data-discount');
        
        // set group values to edit modal
        $('#addGroupModal input[name="name"]').val(groupName);
        $('#addGroupModal input[name="discount"]').val(discount);

        // set a data-group-id attribute to modal in order to make edit by clicking the save button
        $('#addGroupModal').attr('data-group-id', groupId);

        // show edit modal
        $('#addGroupModal').modal('show');

        // when edit modal closes
        $('#addGroupModal')[0].addEventListener('hidden.bs.modal', function() {
            // remove data-group-id attribute to make it add group in the next save
            $('#addGroupModal').removeAttr('data-group-id');

            // clear the values from inputs of the edit modal
            $('#addGroupModal input[name="name"]').val('');
            $('#addGroupModal input[name="discount"]').val('');
        }, { once: true });
    });

    $('.btn-remove').click(function(e) {
        // get group table row
        var groupRow = $(e.target).closest('tr');
        // get group id from it's row element
        var groupId = groupRow.data('groupId');

        if (confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'deleteGroupAjax',
                    groupId: groupId,
                },
                type: "POST", 
                success: function(output) {
                    // remove table row (after deleted)
                    groupRow.remove();

                    // show a message if no more groups left in the table
                    if ($('.discount-groups-list table tbody tr[data-group-id]').length === 0) {
                        $('.no-groups-message').removeClass('d-none');
                    }
                },
            });
        }
    });
});