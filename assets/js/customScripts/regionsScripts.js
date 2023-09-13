$(document).ready(function() {
    // event handler for region select
    $('.counties-select').change(function(e) {
        var countyId = $(e.target).val();

        if (countyId) { // if selected a region
            location.href = "regions.php?countyId=" + countyId;
        }
    });

    // event handler for save (on add or edit) button
    $('.btn-save').click(function() {
        // try to get id of the city in case we edit
        var cityId = $('#addEditRegionModal').attr('data-city-id');
        // action variable is if we create a city belonging to another city
        var action = $('#addEditRegionModal').attr('data-action');
        var isEdit = typeof cityId !== 'undefined' && typeof action === 'undefined';

        // get values for save (or edit)
        var cityName = $('input[name="name"]').val();
        var postcodes = $('input[name="postcodes"]').val();
        var minimumCharge = $('#addEditRegionModal input[name="minimum_charge"]').val();
        var category1 = $('#addEditRegionModal input[name="category_1"]').val();
        var category2 = $('#addEditRegionModal input[name="category_2"]').val();
        var category3 = $('#addEditRegionModal input[name="category_3"]').val();
        var category4 = $('#addEditRegionModal input[name="category_4"]').val();
        var category5 = $('#addEditRegionModal input[name="category_5"]').val();

        // no city name
        if (cityName.trim().length === 0) {
            $('.add-edit-message').removeClass('d-none').find('span').html(enterCityNameTranslation);
            return;
        }

        // no postcodes value provided
        if (postcodes.length === 0) {
            $('.add-edit-message').removeClass('d-none').find('span').html(enterCityPostcodeTranslation);
            return;
        }

        if (!isEdit) { // is save
            if (!action) {
                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {
                        values: 'addCityAjax',
                        city_father_id: 0,
                        city: cityName,
                        postcodes: postcodes,
                        minimum_charge: minimumCharge,
                        category_1: category1,
                        category_2: category2,
                        category_3: category3,
                        category_4: category4,
                        category_5: category5,
                        county_id: $('.counties-select').val(),
                    },
                    type: "POST", 
                    success: function(response) {
                        // make response code (0 or 1) an integer
                        added = parseInt(response);

                        if (added) {
                            // close add modal
                            $('#addEditRegionModal').modal('hide');
                            // reload page to show the new city
                            location.reload();
                        } else {
                            // show error message
                            $('.add-edit-message').removeClass('d-none').find('span').html(response);
                        }
                    },
                });
            } else {
                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {
                        values: 'addCityAjax',
                        city_father_id: cityId,
                        city: cityName,
                        postcodes: postcodes,
                        minimum_charge: minimumCharge,
                        category_1: category1,
                        category_2: category2,
                        category_3: category3,
                        category_4: category4,
                        category_5: category5,
                        county_id: $('.counties-select').val(),
                    },
                    type: "POST", 
                    success: function(response) {
                        // make response code (0 or 1) an integer
                        edited = parseInt(response);

                        if (edited) {
                            // close add modal
                            $('#addEditRegionModal').modal('hide');
                            // reload page to show the new city
                            location.reload();
                        } else {
                            // show error message
                            $('.add-edit-message').removeClass('d-none').find('span').html(response);
                        }
                    },
                });
            }
        } else {
            $.ajax({
                url: "ajaxFunctions.php",
                data: {
                    values: 'editCityAjax',
                    city: cityName,
                    postcodes: postcodes,
                    minimum_charge: minimumCharge,
                    category_1: category1,
                    category_2: category2,
                    category_3: category3,
                    category_4: category4,
                    category_5: category5,
                    cityId: cityId,
                },
                type: "POST", 
                success: function(response) {
                    // make response code (0 or 1) an integer
                    edited = parseInt(response);

                    if (edited) {
                        // get list item of city edited
                        var listItemOfCity = $('.city-item[data-city-id="' + cityId + '"]');
                        // set new values and change data attributes which hold their values
                        listItemOfCity.find('[data-name]').html(cityName).attr('data-name', cityName);
                        listItemOfCity.find('[data-postcodes]').html(postcodes).attr('data-postcodes', postcodes);
                        listItemOfCity.find('[data-minimum-charge]').html(parseFloat(minimumCharge).toFixed(2)).attr('data-minimum-charge', minimumCharge);
                        listItemOfCity.find('[data-category-1]').html(parseFloat(category1).toFixed(2)).attr('data-category-1', category1);
                        listItemOfCity.find('[data-category-2]').html(parseFloat(category2).toFixed(2)).attr('data-category-2', category2);
                        listItemOfCity.find('[data-category-3]').html(parseFloat(category3).toFixed(2)).attr('data-category-3', category3);
                        listItemOfCity.find('[data-category-4]').html(parseFloat(category4).toFixed(2)).attr('data-category-4', category4);
                        listItemOfCity.find('[data-category-5]').html(parseFloat(category5).toFixed(2)).attr('data-category-5', category5);

                        // close edit modal
                        $('#addEditRegionModal').modal('hide');
                    } else {
                        // show error message
                        $('.add-edit-message').removeClass('d-none').find('span').html(response);
                    }
                },
            });
        }
    });

    // event handler for edit city button
    $('.btn-edit').click(function(e) {
        // get city id from table row data attribute
        var cityId = $(e.target).closest('.city-item').data('cityId');
        // get city name from element data attribute
        var cityName = $(e.target).closest('.city-item').find('[data-name]').attr('data-name');
        // get postcodes value from element data attribute
        var postcodes = $(e.target).closest('.city-item').find('[data-postcodes]').attr('data-postcodes');
        var minimumCharge = $(e.target).closest('.city-item').find('[data-minimum-charge]').attr('data-minimum-charge');
        var category1 = $(e.target).closest('.city-item').find('[data-category-1]').attr('data-category-1');
        var category2 = $(e.target).closest('.city-item').find('[data-category-2]').attr('data-category-2');
        var category3 = $(e.target).closest('.city-item').find('[data-category-3]').attr('data-category-3');
        var category4 = $(e.target).closest('.city-item').find('[data-category-4]').attr('data-category-4');
        var category5 = $(e.target).closest('.city-item').find('[data-category-5]').attr('data-category-5');

        // set city values to edit modal
        $('#addEditRegionModal input[name="name"]').val(cityName);
        $('#addEditRegionModal input[name="postcodes"]').val(postcodes);
        $('#addEditRegionModal input[name="minimum_charge"]').val(minimumCharge);
        $('#addEditRegionModal input[name="category_1"]').val(category1);
        $('#addEditRegionModal input[name="category_2"]').val(category2);
        $('#addEditRegionModal input[name="category_3"]').val(category3);
        $('#addEditRegionModal input[name="category_4"]').val(category4);
        $('#addEditRegionModal input[name="category_5"]').val(category5);

        // set a data-city-id attribute to modal in order to make edit by clicking the save button
        $('#addEditRegionModal').attr('data-city-id', cityId);

        // show edit modal
        $('#addEditRegionModal').modal('show');

        // when edit modal closes
        $('#addEditRegionModal')[0].addEventListener('hidden.bs.modal', function() {
            // remove data-city-id attribute to make it add city in the next save
            $('#addEditRegionModal').removeAttr('data-city-id');

            // clear the values from inputs of the edit modal
            $('#addEditRegionModal input[name="name"]').val('');
            $('#addEditRegionModal input[name="postcodes"]').val('');
            $('#addEditRegionModal input[name="minimum_charge"]').val('');
            $('#addEditRegionModal input[name="category_1"]').val('');
            $('#addEditRegionModal input[name="category_2"]').val('');
            $('#addEditRegionModal input[name="category_3"]').val('');
            $('#addEditRegionModal input[name="category_4"]').val('');
            $('#addEditRegionModal input[name="category_5"]').val('');
        }, { once: true });
    });

    // event handler for city remove button
    $('.btn-remove').click(function(e) {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var cityId = $(e.target).closest('.city-item').data('cityId');

            if (cityId > 0) {
                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {
                        values: 'deleteCityAjax',
                        ['city_id']: cityId,
                    },
                    type: "POST", 
                    success: function(output){	
                        location.reload();
                    },
                });
            }
        }
    });

    // event handler to create child city
    $('.btn-add-city').click(function(e) {
        var cityId = $(e.target).data('cityId');
        $('#addEditRegionModal').attr('data-city-id', cityId);
        // add action "add" to prepare modal for adding a city belongs to a parent city
        $('#addEditRegionModal').attr('data-action', 'add');

        // when edit modal closes
        $('#addEditRegionModal')[0].addEventListener('hidden.bs.modal', function() {
            // remove data-city-id attribute to make it add city in the next save
            $('#addEditRegionModal').removeAttr('data-city-id');
            $('#addEditRegionModal').removeAttr('data-action');
        }, { once: true });
    });

    // initialize hide button on add / edit message alert
    $('.add-edit-message .btn-hide').click(function() {
        $('.add-edit-message').addClass('d-none');
    });
});
