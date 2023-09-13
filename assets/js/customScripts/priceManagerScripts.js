$(document).ready(function() {
    // method to count products on the selected category, manufacturer or supplier
    // posts the type either 'category', 'manufacturer' or 'supplier' along with the value which is the id of the selected entity
    function countProducts(type, value) {
        $.ajax({
            url: 'ajaxFunctions.php',
            data: {
                values: 'countProductsAjax',
                type: type,
                value: value,
                ['option-include-subcategories']: type === 'category' ? $('[name="option-include-subcategories"]:checked').val() : '',
            },
            method: 'POST',
            success: function(response) {
                // the response is the product count
                var count = response;
                // update the element of the product count message
                $('.' + type + '-product-count-message ' + '.' + type + '-product-count').text(count);
                // show the element of the product count message
                $('.' + type + '-product-count-message').removeClass('d-none');
            },
        });
    }

    // event handler for category select change
    $('[name="category"]').on('change', function(e) {
        // deselect manufacturer
        $('[name="manufacturer"]').val('');
        // hide previous manufacturer product count message
        $('.manufacturer-product-count-message').addClass('d-none');

        // deselect supplier
        $('[name="supplier"]').val('');
        // hide previous supplier product count message
        $('.supplier-product-count-message').addClass('d-none');

        if (e.target.value) {
            // if a category is selected call countProducts and render the product count message
            countProducts('category', e.target.value);
        } else {
            // if category is deselected hide the product count message
            $('.category-product-count-message').addClass('d-none');
        }
    });

    // event handler for including subcategories radio
    $('[name="option-include-subcategories"]').change(function(e) {
        if ($('[name="category"]').val().length > 0) {
            // if any category is selected count products and render the product count message
            countProducts('category', $('[name="category"]').val());
        }
    });

    // event handler for manufacturer select change
    $('[name="manufacturer"]').on('change', function(e) {
        // deselect category
        $('[name="category"]').val('');
        // hide category product count message
        $('.category-product-count-message').addClass('d-none');
        
        // deselect supplier
        $('[name="supplier"]').val('');
        // hide supplier product count message
        $('.supplier-product-count-message').addClass('d-none');
        
        if (e.target.value) {
            // if a manufacturer is selected call countProducts and render the product count message
            countProducts('manufacturer', e.target.value);
        } else {
            // if manufacturer is deselected hide the product count message
            $('.manufacturer-product-count-message').addClass('d-none');
        }
    });

    $('[name="supplier"]').on('change', function(e) {
        // deselect category
        $('[name="category"]').val('');
        // hide category product count message
        $('.category-product-count-message').addClass('d-none');

        // deselect manufacturer
        $('[name="manufacturer"]').val('');
        // hide manufacturer product count message
        $('.manufacturer-product-count-message').addClass('d-none');

        if (e.target.value) {
            // if a supplier is selected call countProducts and render the product count message
            countProducts('supplier', e.target.value);
        } else {
            // if supplier is deselected hide the product count message
            $('.supplier-product-count-message').addClass('d-none');
        }
    });

    // event handler for button preview changes
    $('.btn-preview').click(function() {
        // check is change prices for is valid
        var formIsValid = validateForm();

        if (formIsValid) {
            // remove previous invalid form message immediately
            const infoToast = document.getElementById('submit-info-toast');
            if (infoToast) {
                const infoToastInstance = bootstrap.Toast.getOrCreateInstance(infoToast)
                infoToastInstance.hide()
            }

            // populate a Form Data object
            var data = new FormData();
            data.append('values', 'changesPreviewAjax');
            data.append('category', $('[name="category"]').val());
            data.append('manufacturer', $('[name="manufacturer"]').val());
            data.append('supplier', $('[name="supplier"]').val());
            data.append('option-include-subcategories', $('[name="option-include-subcategories"]:checked').val());
            data.append('price-type', $('[name="price-type"]').val());
            data.append('change-type', $('[name="change-type"]').val());
            data.append('value', $('[name="value"]').val());
            data.append('value-type', $('[name="value-type"]').val());

            if ($('[name="category"]').val().length > 0) {
                data.append('category-name', $('[name="category"]').find(":selected").text());
                data.append('entity', 'category');
            } else if ($('[name="manufacturer"]').val().length > 0) {
                data.append('manufacturer-name', $('[name="manufacturer"]').find(":selected").text());
                data.append('entity', 'manufacturer');
            } if ($('[name="supplier"]').val().length > 0) {
                data.append('supplier-name', $('[name="supplier"]').find(":selected").text());
                data.append('entity', 'supplier');
            }

            // make the AJAX request to get preview of the products price change
            $.ajax({
                url: "ajaxFunctions.php",
                data: data,
                type: "POST",
                processData: false,
                contentType: false,
                success: function(output) {
                    // parse response as JSON
                    var data = JSON.parse(output);

                    // empty previous products from preview changes table
                    $('#preview-modal tbody').empty();

                    // render each product in the preview changes table
                    data.forEach(function(product) {
                        $('#preview-modal tbody').append(`
                            <tr>
                                <td>${product.productCode}</td>
                                <td><div class="name">${product.name}</div></td>
                                <td>${product.entityName}</td>
                                <td>
                                    ${
                                        // if there is not an update in normal price
                                        !('updatedPrice' in product)
                                        // render normal price
                                        ? parseFloat(product.price).toFixed(2) + '€'
                                        // render normal price along with the change value
                                        : `${parseFloat(product.price).toFixed(2)}€ / <span class="text-danger fw-500">${parseFloat(product.updatedPrice).toFixed(2)}€</span>`
                                    }
                                </td>
                                <td>
                                    ${
                                        // if there is not an update in sale price
                                        !('updatedSalePrice' in product)
                                        // render sale price
                                        ? parseFloat(product.sale_price).toFixed(2) + '€'
                                        // render sale price along with the change value
                                        : `${parseFloat(product.sale_price).toFixed(2)}€ / <span class="text-danger fw-500">${parseFloat(product.updatedSalePrice).toFixed(2)}€</span>`
                                    }
                                </td>
                            </tr>
                        `);
                    });

                    // if there are any changes in products (according to change-prices form selected values)
                    if (data.length) {
                        // update the header of the modal
                        $('#preview-modal').find('.products-number').html(data.length);

                        // update the entity header of the table (can be either 'category', 'manufacturer' or 'supplier')
                        $('.entity-header').text(entityHeaderTranslations[data[0].entity]);
                        
                        // manipulate normal price table header to hide the "after the update" part
                        if (!data[0].updatedPrice) {
                            $('#preview-modal').find('.normal-price-header span').hide();
                        }

                        // manipulate sale price table header to hide the "after the update" part
                        if (!data[0].updatedSalePrice) {
                            $('#preview-modal').find('.sale-price-header span').hide();
                        }

                        // open preview changes modal
                        $('#preview-modal').modal('show');
                    } else {
                        if ($('[name="category"]').val().length > 0) {
                            entity = 'category';
                        } else if ($('[name="manufacturer"]').val().length > 0) {
                            entity = 'manufacturer';
                        } if ($('[name="supplier"]').val().length > 0) {
                            entity = 'supplier';
                        }
                        // there are no changes because of no products in selected category (or other entity like manufacturer)
                        $('body').append(`
                            <div class="toast-container">
                                <div id="info-toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                    <div class="toast-header">
                                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                                    </div>
                                    <div class="toast-body">
                                        ${noProductsInEntityMessages[entity]}
                                    </div>
                                </div>
                            </div>
                        `);

                        // bootstrap code to show the info toast
                        const infoToast = document.getElementById('info-toast');
                        const infoToastInstance = bootstrap.Toast.getOrCreateInstance(infoToast)
                        infoToastInstance.show()
                    }
                },
            });
        } else {
            showEmptyFormMessage();
        }
    });

    // event handler for button update (Prices Change) at the bottom of the form
    $('.btn-update').click(function() {
        // check if form is valid
        var formIsValid = validateForm();

        if (formIsValid) {
            // show a confirmation before actually change values
            if (confirm(changePricesConfirmMessage)) {
                // submit the form programmatically (button update is out of the form)
                $('.price-manager form').submit();
            }
        } else {
            // in case form is not completed
            showEmptyFormMessage();
        }
    });

    function validateForm() {
        var formIsValid = true;

        // check each input, select it has value (formIsValid is true if there is a value on all inputs, selects)
        formIsValid &= $('[name="category"]').val().length > 0 || $('[name="manufacturer"]').val().length > 0 || $('[name="supplier"]').val().length > 0;
        formIsValid &= $('[name="price-type"]').val().length > 0;
        formIsValid &= $('[name="change-type"]').val().length > 0;
        formIsValid &= $('[name="value"]').val().length > 0;
        formIsValid &= $('[name="value-type"]').val().length > 0;

        // in case any input is empty style it as invalid
        if ($('[name="price-type"]').val().length === 0) {
            $('[name="price-type"]').addClass('is-invalid');
        } else {
            $('[name="price-type"]').removeClass('is-invalid');
        }
        if ($('[name="change-type"]').val().length === 0) {
            $('[name="change-type"]').addClass('is-invalid');
        } else {
            $('[name="change-type"]').removeClass('is-invalid');
        }
        if ($('[name="value"]').val().length === 0) {
            $('[name="value"]').addClass('is-invalid');
        } else {
            $('[name="value"]').removeClass('is-invalid');
        }
        if ($('[name="value-type"]').val().length === 0) {
            $('[name="value-type"]').addClass('is-invalid');
        } else {
            $('[name="value-type"]').removeClass('is-invalid');
        }

        return formIsValid;
    }

    // on form input and selects remove 'is-invalid' styling class whenever value changes
    $('[name="price-type"], [name="change-type"], [name="value"], [name="value-type"]').on('change', function(e) {
        $(e.target).removeClass('is-invalid');
    });

    // method to render the empty-form message
    function showEmptyFormMessage() {
        $('body').append(`
            <div class="toast-container">
                <div id="submit-error-toast" class="toast bg-danger" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-body text-white">
                        <div class="d-flex justify-content-between">
                            <span>${formEmptyMessage}</span>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // bootstrap code to show the submit error toast
        const infoToast = document.getElementById('submit-error-toast');
        const infoToastInstance = bootstrap.Toast.getOrCreateInstance(infoToast)
        infoToastInstance.show()
    }
});