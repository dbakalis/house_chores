$(document).ready(function() {
    // shows add and edit error message
    function showErrorMessage(message) {
        $('.add-edit-message')
            // render error message and close alert button
            .html(`
                ${message}
                <i class="btn-hide bi bi-x fs-3 ms-3" role="button"></i>
            `)
            // show error message element
            .removeClass('d-none')
            // get close button
            .find('.btn-hide')
            // event handler for closing the alert
            .click(function() {
                $('.add-edit-message').addClass('d-none');
            });
    }

    // event handler of add tax button
    $('.btn-add').click(function() {
        // try to get id of the group in case we edit
        var taxId = $('#taxDetailsModal').attr('data-tax-id');
        var isEdit = typeof taxId !== 'undefined';

        if (!isEdit) {
            // if is add
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'addTaxAjax',
                    taxName: $('input[name="taxName"]').val(),
                    percent: $('input[name="percent"]').val(),
                },
                type: "POST", 
                success: function(output) {
                    if (output == '1') {
                        location.reload();
                    } else {
                        showErrorMessage(output);
                    }
                },
            });
        } else {
            // is edit
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'editTaxAjax',
                    taxId: taxId,
                    taxName: $('input[name="taxName"]').val(),
                    percent: $('input[name="percent"]').val(),
                },
                type: "POST", 
                success: function(output) {
                    if (output == '1') {
                        location.reload();
                    } else {
                        showErrorMessage(output);
                    }
                },
            });
        }
    });

    // event handler for edit tax button
    $('.btn-edit').click(function(e) {
        var taxId = $(e.target).closest('tr').data('taxId');

        var groupName = $(e.target).closest('tr').find('[data-taxName]').attr('data-taxName');
        var percentage = $(e.target).closest('tr').find('[data-percent]').attr('data-percent');
        
        // get values from tax table row
        $('#taxDetailsModal input[name="taxName"]').val(groupName);
        $('#taxDetailsModal input[name="percent"]').val(percentage);

        // set a data-tax-id attribute to modal in order to make edit by clicking the save button
        $('#taxDetailsModal').attr('data-tax-id', taxId);

        // show edit modal
        $('#taxDetailsModal').modal('show');

        // when edit modal closes
        $('#taxDetailsModal')[0].addEventListener('hidden.bs.modal', function() {
            // remove data-tax-id attribute to make it add tax in the next save
            $('#taxDetailsModal').removeAttr('data-tax-id');
            // clear the values from inputs of the edit modal
            $('#taxDetailsModal input[name="taxName"]').val('');
            $('#taxDetailsModal input[name="percent"]').val('');
        }, { once: true });
    });

    // event handler for remove button
    $('.btn-remove').click(function(e) {
        var taxId = $(e.target).data('taxId');

        if (confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'deleteTaxAjax',
                    taxId: taxId,
                },
                type: "POST", 
                success: function(output) {
                    if (output == '1') {
                        location.reload();
                    }
                },
            });
        }
    });
});