$(document).ready(function() {
    $('body').on('click', '.btn-remove', function(e) {
        // row is the parent element of button (delete) clicked
        var row = $(e.target).closest('[data-wishlist-record-id]');
        // row has the wishlist record id on it's data
        var wishlistRecordId = row[0].dataset.wishlistRecordId;

        $.ajax({
            url: "ajaxFunctions.php",
            data: {
                values: 'deleteWishlistRecordAjax',
                recordId: wishlistRecordId,
            },
            type: "POST", 
            success: function(output){
                // delete row clicked
                row.remove();
            }
        });
    });

    // event handler for product wishlist count
    // opens a modal to display each record with customer name and date added
    $('.product-list .btn-wishlist-count').click(function(e) {
        // get product id from button clicked
        var productId = $(e.target).data('productId');
        
        // make AJAX POST request to get all wishlist records for this product
        $.ajax({
            url: "ajaxFunctions.php",
            data: {
                values: 'getProductRecordsAjax',
                productId: productId,
            },
            type: "POST", 
            success: function(output) {
                var data = JSON.parse(output);

                // clear the table body of the modal
                $('#productWishlistModal tbody').empty();

                // iterate records to add them to the table
                data.forEach(function(record) {
                    // parse date of the record
                    var d = new Date(record.created_at);
                    // format the date to m-d-Y H:i
                    var dateFormatted = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

                    // append a tr element
                    $('#productWishlistModal tbody').append(`
                        <tr>
                            <td class="text-center">
                                ${
                                    // if customer has entered firstname or lastname
                                    record.firstName || record.lastName
                                    // show fullname
                                    ? `${record.firstName} ${record.lastName}`
                                    // show their email
                                    : record.email
                                }
                            </td>
                            <td class="text-center">${dateFormatted}</td>
                        </tr>
                    `);
                });

                // show the product name as the modal title
                $('#productWishlistModal #product-wishlist-modal-label').html(data[0].name);
            }
        });
    });

    // when we select a product from products autocomplete add the value to a hidden input
    $('.products-autocomplete').on('change', function(e) {
        if ($(e.target).data('selected')) {
            // hidden input will be posted by the form
            $(e.target).closest('form').find('input[name="product-id"]').val($(e.target).data('selected'));
            $(e.target).closest('form').submit();
        }
    });

    // if we searched a product
    if (typeof searchProductName !== 'undefined') {
        // fill products autocomplete
        $('.products-autocomplete input').val(searchProductName);
    }
});