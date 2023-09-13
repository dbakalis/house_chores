$(document).ready(function() {
    // year select on orders statistics page
    $('input[type="radio"][name="year"]').change(function(e) {
        addGetParam('month', '');
        // pass selected value to url and reload page
        addGetParam('year', e.target.value, true);
    });

    $('.view-all-time-button').click(function() {
        addGetParam('year', '', true);
    });

    if ($('.order-statistics').length) {

        $('.btn-view-month-statistics').click(function() {
            location.href = 'orders.php?year=' + $('select[name="year"]').val() + '&month=' + $('select[name="month"]').val();
        });

        $('.btn-compare-years').click(function() {
            var year1 = $('select[name="year"]').eq(1).val();
            var year2 = $('select[name="comparison-year"]').val();
            location.href = `orders.php?year=${year1}&comparison-year=${year2}`;
        });

        $('.btn-compare-months').click(function() {
            var year1 = $('select[name="year"]').eq(2).val();
            var month1 = $('select[name="month"]').eq(1).val(); // choose second from compare months tab
            var year2 = $('select[name="comparison-year"]').eq(1).val();
            var month2 = $('select[name="comparison-month"]').val();

            if (year1 && month1 && year2 && month2) {
                location.href = `orders.php?year=${year1}&month=${month1}&comparison-year=${year2}&comparison-month=${month2}`;
            }
        });
    }

    if ($('.best-seller-categories-tree-view').length) {
        $('.best-seller-categories-tree-view .switch').switch({
            options: [
                {
                    label: translations.category_total_sales,
                    onActivate: function() {
                        $('table td.total-sales').removeClass('d-none');
                        $('table th.total-sales-label').removeClass('d-none');
                        $('table td.total-sales-percentage').removeClass('d-none');
                        $('table th.total-sales-percentage-label').removeClass('d-none');
                        $('table td.amount').addClass('d-none');
                        $('table th.amount-label').addClass('d-none');
                        $('table td.amount-percentage').addClass('d-none');
                        $('table th.amount-percentage-label').addClass('d-none');
                        $('.total-sales').removeClass('d-none');
                        $('.total-amount').addClass('d-none');
                    },
                },
                {
                    label: translations.category_total_amount,
                    onActivate: function() {
                        $('table td.amount').removeClass('d-none');
                        $('table th.amount-label').removeClass('d-none');
                        $('table td.total-sales').addClass('d-none');
                        $('table th.total-sales-label').addClass('d-none');
                        $('table td.total-sales-percentage').addClass('d-none');
                        $('table th.total-sales-percentage-label').addClass('d-none');
                        $('table td.amount-percentage').removeClass('d-none');
                        $('table th.amount-percentage-label').removeClass('d-none');
                        $('.total-sales').addClass('d-none');
                        $('.total-amount').removeClass('d-none');
                    },
                },
            ],
        });
    }

    if ($('.order-statistics').length) {
        $('.order-statistics .switch').switch({
            options: [
                {
                    label: translations.order_count,
                    onActivate: function() {
                        $('.orders-totals-chart-container').toggleClass('d-none');
                        $('.order-counts-chart-container').toggleClass('d-none');
                        
                        $(window).trigger('resize');
                    },
                },
                {
                    label: translations.order_totals,
                    onActivate: function() {
                        $('.orders-totals-chart-container').toggleClass('d-none');
                        $('.order-counts-chart-container').toggleClass('d-none');
                        
                        $(window).trigger('resize');
                    },
                }
            ],
        });
    }

    $('[data-bs-toggle="tab"]').on('show.bs.tab', function(e) {
        if ($(e.target).hasClass('button-tab-years')) {
            addGetParam('start-date', '');
            addGetParam('end-date', '');
        } else if ($(e.target).hasClass('button-tab-date-range')) {
            addGetParam('years', '');
        }
    });

    // years selected in best seller categories tree
    var yearsSelected = $('input[name="year[]"]')
        .toArray()
        .filter(function(inputEl) {
            return inputEl.checked;
        })
        .map(function(inputEl) {
            return inputEl.value;
        });

    // add year selected to best seller categories tree to array
    $('input[name="year[]"]').change(function(e) {
        if (e.target.checked) {
            yearsSelected.push(e.target.value);
        } else {
            yearsSelected.splice(yearsSelected.indexOf(e.target.value), 1);
        }

        // input exists on orders statistics page
        if ($(e.target).closest('#compare-years-tab').length) {
            if (yearsSelected.length >= 5) {
                $('input[name="year[]').each(function(i, inputEl) {
                    if (!$(inputEl).prop('checked')) {
                        $(inputEl)[0].disabled = true;
                    }
                });
            } else {
                $('input[name="year[]').each(function(i, inputEl) {
                    $(inputEl)[0].disabled = false;
                });
            }
        }
        
        addGetParam('month', '');
        addGetParam('years', yearsSelected.join(','));
    });

    if (yearsSelected.length >= 5) {
        $('input[name="year[]"]').each(function(i, inputEl) {
            if (!$(inputEl).prop('checked')) {
                $(inputEl)[0].disabled = true;
            }
        });
    }
    
    $('.order-statistics .btn-submit-year').click(function(e) {
        if ($('input[name="year[]"]:checked').length >= 2) {
            location.href = buildedLocation;
        } else {
            showMessage(translations.choose_at_least_two_years);
        }
    });

    $('.best-seller-categories-tree-view .btn-submit-year').click(function() {
        location.href = buildedLocation;
    });

    $('input[name="start-date"]').change(function(e) {
        var value = moment(e.target.value, 'DD/MM/YYYY').format('YYYY-MM-DD');
        addGetParam('start-date', value);
    });

    $('input[name="end-date"]').change(function(e) {
        var value = moment(e.target.value, 'DD/MM/YYYY').format('YYYY-MM-DD');
        addGetParam('end-date', value);
    });

    $('.btn-submit-date-range').click(function() {
        location.href = buildedLocation;
    });

    // rotate collapse subcategories icon on best seller categories tree
    $('.collapse').on('hide.bs.collapse', function(e) {
        $('[data-bs-target="#' + e.target.id + '"]').css('transform', 'rotate(0deg)');
    });

    $('.collapse').on('show.bs.collapse', function(e) {
        $('[data-bs-target="#' + e.target.id + '"]').css('transform', 'rotate(180deg)');
    });

    $('.button-chart-unstacked').on('show.bs.tab', function() {
        ordersYearsChartDraw(false);
    });

    $('.button-chart-stacked').on('show.bs.tab', function() {
        ordersYearsChartDraw(true);
    });

    // search product autocomplete on product visits statistics page
    $('.products-autocomplete').on('change', function(e) {
        // a product is selected
        if ($(e.target).data('selected')) {
            // reset month and year
            addGetParam('month', '');
            addGetParam('year', '');

            addGetParam('product-id', $(e.target).data('selected'), true);
        }
    });

    // category select on category click statistics page
    $('select[name="category-id"]').change(function(e) {
        // a category is selected
        if (e.target.value) {
            // reset month and year
            addGetParam('month', '');
            addGetParam('year', '');

            addGetParam('category-id', e.target.value, true);
        }
    });

    // manufacturer select on manufacturer click statistics
    $('select[name="manufacturer-id"]').change(function(e) {
        // a manufacturer is selected
        if (e.target.value) {
            // reset month and year
            addGetParam('month', '');
            addGetParam('year', '');

            addGetParam('manufacturer-id', e.target.value, true);
        }
    });

    // year select on every statistics page
    $('select[name="year"]').change(function(e) {
        // if the select is on order statistics page then don't submit
        if ($('.order-statistics').length) {
            return;
        }
        // pass selected value to url and reload page
        addGetParam('year', e.target.value, true);
    });

    // month select on every statistics page
    $('select[name="month"]').change(function(e) {
        // if the select is on order statistics page then don't submit
        if ($('.order-statistics').length) {
            return;
        }
        // pass selected value to url and reload page
        addGetParam('month', e.target.value, true);
    });

    // if momentjs is included
    if (typeof moment !== 'undefined') {
        // TODO get locale from config
        moment.locale('el');
    }

    // initialize clicks-chart on product, category and manufacturer click statistics pages
    if ($('#clicks-chart').length) {
        var data = []; // array of data to be displayed in the chart

        if (month) { // month is selected
            // date selected
            var date = moment().set({ year: year, month: month - 1, date: 1 });

            // for each day of month
            for (let i = 1; i <= date.daysInMonth(); i++) {
                // date of specific day to be displayed
                var d = moment().set({ year: year, month: month - 1, date: i });
                
                // calculate click statistics data
                var clicksData = clickStatistics
                    // get data of the specific day of the month (in chart all days are displayed)
                    .filter(function(record) {
                        return record.date.isSame(d, 'day');
                    })
                    // get clicks count in an array
                    .map(function(record) {
                        return parseInt(record.theClicks);
                    })
                    // get sum of the array of clicks count
                    .reduce((partialSum, a) => partialSum + a, 0);
                
                // add click statistics data of the specific day to the array (the array will be passed to the chart library later)
                data.push({
                    date: d,
                    clicks: clicksData,
                });
            }

            // make an array of labels for the x axis of the chart (display 1, 2, 3 for each day of the month)
            var labels = data.map(function(record) {
                return record.date.format('D');
            });
        } else {
            for (let i = 0; i < 12; i++) {
                // date of specific month to be displayed
                var d = moment().set({ year: year, month: i, date: 1 });

                // calculate click statistics data
                var clicksData = clickStatistics
                    // get data of the specific month (in chart all months are displayed)
                    .filter(function(record) {
                        return record.date.isSame(d, 'month');
                    })
                    // get clicks count in an array
                    .map(function(record) {
                        return parseInt(record.theClicks);
                    })
                    // get sum of the array of clicks count
                    .reduce((partialSum, a) => partialSum + a, 0);

                // add click statistics data of the specific month to the array (the array will be passed to the chart library later)
                data.push({
                    date: d,
                    clicks: clicksData,
                });
            }

            // make an array of labels for the x axis of the chart (display January, February, March for each month of the year)
            var labels = data.map(function(record) {
                return record.date.format('MMMM');
            });
        }

        // initialize an array of click statistics data for each day/month (depending user's choices) to be passed in the chart library
        var values = data.map(function(record) {
            return record.clicks;
        });

        // call method to create the chart
        createLineChart('clicks-chart', labels, values);
    }

    // initialize registered-users-chart on orders statistics page
    if ($('.registered-users-chart-container').length) {
        /**
         * registered users chart
         */
        createPieChart(document.querySelector('.registered-users-chart-container'), [
            {
                value: registeredUsersCount,
                style: blueColor,
                label: translations.registered_users_orders,
            },
            {
                value: nonRegisteredUsersCount,
                style: '#C7EDFB',
                label: translations.non_registered_users_orders,
            },
        ]);
    }

    // initialize user-device-chart on orders statistics page
    if ($('.user-device-chart-container').length > 0) {
        /**
         * user device chart
         */
        createPieChart(document.querySelector('.user-device-chart-container'), [
            {
                value: desktopDevicesCount,
                style: orangeColor,
                label: translations.users_from_desktop,
            },
            {
                value: mobileDevicesCount,
                style: lightOrangeColor,
                label: translations.users_from_mobile,
            },
        ]);
    }

    // initialize registered-users-chart on orders statistics page
    if ($('.registered-users-comparison-chart-container').length) {
        /**
         * registered users chart
         */
        createPieChart(document.querySelector('.registered-users-comparison-chart-container'), [
            {
                value: comparisonDateRegisteredUsersCount,
                style: blueColor,
                label: translations.registered_users_orders,
            },
            {
                value: comparisonDateNonRegisteredUsersCount,
                style: '#C7EDFB',
                label: translations.non_registered_users_orders,
            },
        ]);
    }

    // initialize user-device-chart on orders statistics page
    if ($('.user-device-comparison-chart-container').length > 0) {
        /**
         * user device chart
         */
        createPieChart(document.querySelector('.user-device-comparison-chart-container'), [
            {
                value: comparisonDateDesktopDevicesCount,
                style: orangeColor,
                label: translations.users_from_desktop,
            },
            {
                value: comparisonDateMobileDevicesCount,
                style: lightOrangeColor,
                label: translations.users_from_mobile,
            },
        ]);
    }

    if ($('.registered-users-have-ordered-container').length > 0) {
        /**
         * registered users have ordered chart
         */
        createPieChart(document.querySelector('.registered-users-have-ordered-container'), [
            {
                value: registeredUsersHaveOrdered,
                style: '#36A2EB',
                label: translations.registered_users_orders,
            },
            {
                value: nonRegisteredUsersHaveOrdered,
                style: '#C7EDFB',
                label: translations.non_registered_users_orders,
            },
        ]);
    }
});

// variable of url which changes every time addGetParam is called
var buildedLocation = location.href;

/**
 * a method to build new url depending the selected values from inputs
 */
function addGetParam(key, value, redirect) {
    if (value) {
        // pass new GET parameter to url we build
        var newLocation = buildedLocation.split('?')[0] + '?' + key + '=' + value;
    } else {
        // remove all GET parameters if an empty value is given (the rest of GET parameters will be added again below)
        var newLocation = buildedLocation.split('?')[0] + '?';
    }
    
    var currentUrl = new URL(buildedLocation);
    
    if (key !== 'start-date' && currentUrl.searchParams.get('start-date')) {
        newLocation += '&start-date=' + currentUrl.searchParams.get('start-date');
    }

    if (key !== 'end-date' && currentUrl.searchParams.get('end-date')) {
        newLocation += '&end-date=' + currentUrl.searchParams.get('end-date');
    }

    // add product-id param to new location
    if (key !== 'product-id' && currentUrl.searchParams.get('product-id')) {
        newLocation += '&product-id=' + currentUrl.searchParams.get('product-id');
    }

    // add category-id param to new location
    if (key !== 'category-id' && currentUrl.searchParams.get('category-id')) {
        newLocation += '&category-id=' + currentUrl.searchParams.get('category-id');
    }

    // add manufacturer-id param to new location
    if (key !== 'manufacturer-id' && currentUrl.searchParams.get('manufacturer-id')) {
        newLocation += '&manufacturer-id=' + currentUrl.searchParams.get('manufacturer-id');
    }

    // add year param to new location
    if (key !== 'year' && currentUrl.searchParams.get('year')) {
        newLocation += '&year=' + currentUrl.searchParams.get('year');
    }

    // add month param to new location
    if (key !== 'month' && currentUrl.searchParams.get('month')) {
        newLocation += '&month=' + currentUrl.searchParams.get('month');
    }

    if (redirect) {
        location.href = newLocation;
    } else {
        buildedLocation = newLocation;
    }
}