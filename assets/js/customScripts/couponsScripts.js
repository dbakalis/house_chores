$(document).ready(function() {

    // event handlers to submit form on configuration change
    $('select[name="module-state"]').change(function(e) {
        $(e.target).closest('form').submit();
    });

    $('select[name="multiple-discount-setting"]').change(function(e) {
        $(e.target).closest('form').submit();
    });

    // initialization of add / edit coupon view
    function init() {
        // depending which catalogue option is chosen show / hide according elements
        if ($('input[name="catalogueLimit"]:checked').attr('id') === 'catalogue-limit-all-products-option') {
            // all products included so no catalogue limit (hide all catalogue input elements)
            $('.product-code-input').addClass('d-none');
            $('.categories-list').addClass('d-none');
            $('.manufacturers-list').addClass('d-none');
        } else if ($('input[name="catalogueLimit"]:checked').attr('id') === 'catalogue-limit-product-code-option') {
            // specific products catalogue limit
            $('.product-code-input').removeClass('d-none'); // show product codes input
            $('.categories-list').addClass('d-none');
            $('.manufacturers-list').addClass('d-none');
        } else if ($('input[name="catalogueLimit"]:checked').attr('id') === 'catalogue-limit-selected-category-option') {
            // category catalogue limit
            $('.product-code-input').addClass('d-none');
            // show categories list
            $('.categories-list').removeClass('d-none');
            $('.manufacturers-list').addClass('d-none');
        } else if ($('input[name="catalogueLimit"]:checked').attr('id') === 'catalogue-limit-selected-manufacturer-option') {
            // manufacturers catalogue limit
            $('.product-code-input').addClass('d-none');
            $('.categories-list').addClass('d-none');
            // show manufacturers list
            $('.manufacturers-list').removeClass('d-none');
        } else {
            // is add coupon (hide all catalogue input elements)
            $('.product-code-input').addClass('d-none');
            $('.categories-list').addClass('d-none');
            $('.manufacturers-list').addClass('d-none');
        }
    }

    // event handler for catalogue limit option
    // depending which catalogue option is chosen show / hide according elements
    $('input[name="catalogueLimit"]').change(function(e) {
        switch (e.target.id) {
            case 'catalogue-limit-all-products-option':
                $('.product-code-input').addClass('d-none');
                $('.categories-list').addClass('d-none');
                $('.manufacturers-list').addClass('d-none');
                break;
            case 'catalogue-limit-product-code-option':
                $('.product-code-input').removeClass('d-none');
                $('.categories-list').addClass('d-none');
                $('.manufacturers-list').addClass('d-none');
                break;
            case 'catalogue-limit-selected-category-option':
                $('.product-code-input').addClass('d-none');
                $('.categories-list').removeClass('d-none');
                $('.manufacturers-list').addClass('d-none');
            break;
            case 'catalogue-limit-selected-manufacturer-option':
                $('.product-code-input').addClass('d-none');
                $('.categories-list').addClass('d-none');
                $('.manufacturers-list').removeClass('d-none');
            break;
        }
    });

    // initialize add / edit view
    init();

    // event handler for generate code button
    $('.generateRandomCode').click(function() {
        $.ajax({
            type: "POST", 
            url: '../../includes/generalAjaxFunctions.php',
            data: { values: 'generateRandomString' },
            success: function(output) {
                // populate code input
                $('#coupon-code').val(output);
            },
        });
    });

    // event handler for remove coupon button
    $('.deleteCoupon').click(function(e) {
        var couponId        = $(e.target).data('couponId');
        var buttonDelete    = this;
        var buttonDeleteObj = $(this);

        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) { 
            $.ajax({
                type: "POST", 
                url: 'ajaxFunctions.php',
                data: {values: 'deleteCoupon', couponId: couponId},
                success: function(output) {

                    buttonDeleteObj.closest('tr').find('td').fadeOut('slow', 
                    function(buttonDelete){ 
                        $(buttonDelete).parents('tr:first').remove();                    
                    });

                }
            });
        }
    });

});

// relace the hash in the browser
function replaceUrlBrowser(urlToGo){
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}