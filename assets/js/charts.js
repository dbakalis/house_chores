function createLineChart(chartId, labels, values, xAxisLabelSize) {
    var element = document.getElementById(chartId);
    var chart = echarts.init(element, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    var chartOptions = {
        title: {
            text: typeof chartTitle !== 'undefined' ? chartTitle : '',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#36A2EB'
                },
            },
        },
        legend: {
            show: false,
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                data: labels,
                boundaryGap: false,
            },
        ],
        yAxis: [
            {
                type: 'value',
                minInterval: 1,
            },
        ],
        axisPointer: {
            show: false,
        },
        series: [
            {
                name: '',
                type: 'line',
                stack: 'Clicks',
                label: {
                    show: true,
                    position: 'top',
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    formatter: function(params) {
                        return params.value > 0 ? params.value : '';
                    },
                },
                lineStyle: {
                    color: blueColor,
                    width: 3,
                },
                areaStyle: {
                    color: lighterBlueColor,
                },
                silent: true,
                data: values,
            },
        ],
    };
    
    if (xAxisLabelSize === 'large') {
        chartOptions.xAxis[0].axisLabel = {
            fontSize: '1.953125rem',
            fontWeight: 'bold',
            color: '#111111',
        };
    }

    if (chartOptions && typeof chartOptions === 'object') {
        chart.setOption(chartOptions);
    }

    $(window).on('resize', chart.resize);

    return chart;
}

function createOrderCountChart(data, comparisonData, month, year, comparisonMonth, comparisonYear, element, includeComparisonPercentages) {
    /**
     * order count chart
     */

    var ordersCountData = calculateOrdersCountData(data, month, year);

    if (month) {
        // make an array of labels for the x axis of the chart (display January, February for each month)
        var labels = ordersCountData.map(function(record) {
            return record.date.format('D');
        });
    } else {
        // make an array of labels for the x axis of the chart (display January, February for each month)
        var labels = ordersCountData.map(function(record) {
            return record.date.format('MMMM');
        });
    }

    if (comparisonData) {
        var comparisonDateOrdersCountData = calculateOrdersCountData(comparisonData, comparisonMonth, comparisonYear);
    }

    var chart; // chart object
    var chartOptions; // chart options

    var series = [
        {
            name: year.toString(),
            type: 'bar',
            barWidth: '40px',
            label: {
                show: true,
                position: 'top',
                color: '#333333',
                fontWeight: 'bold',
                fontSize: '1rem',
                formatter: function(params) { // a method to render nothing if count value of a chart item (day or month) is zero
                    var value = params.value;

                    if (value === 0) {
                        return '';
                    } else {
                        return numberFormat(value, true);
                    }
                },
            },
            itemStyle: {
                color: comparisonData ? lightBlueColor : blueColor,
            },
            silent: true,
            data: ordersCountData.map(function(record) { // create an array of count values for the chart items (days or months)
                return record.count;
            }),
        },
    ];

    if (comparisonData) {
        series.push({
            name: comparisonYear.toString(),
            type: 'bar',
            barWidth: '40px',
            label: {
                show: true,
                position: 'top',
                color: '#333333',
                fontWeight: 'bold',
                fontSize: '1rem',
                formatter: function(params) { // a method to render nothing if count value of a chart item (day or month) is zero
                    var value = params.value;

                    if (value === 0) {
                        return '';
                    } else {
                        return numberFormat(value, true);
                    }
                },
            },
            itemStyle: {
                color: blueColor,
            },
            silent: true,
            data: comparisonDateOrdersCountData.map(function(record) { // create an array of count values for the chart items (days or months)
                return record.count;
            }).slice(0, ordersCountData.length),
        });
    }
    
    // order count chart options
    chartOptions = {
        title: {
            text: ''
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        grid: {
            left: '30px',
            right: '50px',
            bottom: '0%',
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                data: labels
            },
        ],
        yAxis: [
            {
                type: 'value',
            },
        ],
        series: series,
    };

    if (comparisonYear) {
        chartOptions.legend = {
            data: [year.toString(), comparisonYear.toString()],
            left: 'auto',
            textStyle: {
                fontWeight: 'bold',
                fontSize: 15,
            },
        };
    }

    // initialize gateways chart using eCharts library
    function initChart() {
        chart = echarts.init(element, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        chartOptions && chart.setOption(chartOptions);
    }

    initChart();

    // on window resize, also resize the chart
    $(window).on('resize', function() {
        chart.resize();

        ordersCountData.forEach(function(monthData, i) {
            var chartItemOffsetLeft = chart.convertToPixel({ seriesIndex: 0 }, [labels[i], monthData])[0];
            chartItemsLeftPosition[i] = chartItemOffsetLeft;

            var amountElementWidth = $(element).parent().find('.order-count-average-container > div').eq(i).width();
            $(element).parent().find('.order-count-average-container > div').eq(i).css('left', chartItemOffsetLeft - (amountElementWidth / 2) + 'px');
        });
    });

    var comparisonValues = {};

    if (month) { // if month is selected
        var itemsSum = ordersCountData
            // make an array of values of chart items
            .map(function(item) {
                return item.count;
            })
            // calculate the sum of all values
            .reduce((partialSum, a) => partialSum + a, 0);

        // chart item count (will be used later for the average value of average order count per day)
        var itemCount = ordersCountData.length;

        var currentDate = moment(); // date object of today
        var statsDate = moment().set({ // date object of month selected
            year: year,
            month: month - 1,
            date: 1,
        });

        // if month and year selected is in present (current month right now) then calculate average by dividing with the days until today
        if (statsDate.isSame(currentDate, 'month')) {
            var itemCount = currentDate.date();
        }

        // order count average per day
        var itemsAverage = itemsSum / itemCount;

        // TODO
        comparisonValues['average-per-day'] = itemsAverage;
        
        // render average per day
        $(element).parent().find('#average-per-day .value').text(itemsAverage.toFixed(2));
    } else {
        var itemsSum = 0;
        var averagePerDaySum = 0;
        var monthsWithPositiveValue = 0;
        var chartItemsLeftPosition = [];
        ordersCountData.forEach(function(monthData, i) {
            var currentDate = moment(); // date object of today

            var daysInMonth = monthData.date.daysInMonth(); // day count of the month displayed

            // if month and year selected is in present (current month right now) then calculate average by dividing with the days until today
            if (monthData.date.isSame(currentDate, 'month')) {
                var daysInMonth = currentDate.date();
            }

            // the average per day is order count of the months divided by the days in month
            var averagePerDay = parseFloat(monthData.count / daysInMonth);
            
            var chartItemOffsetLeft = chart.convertToPixel({ seriesIndex: 0 }, [labels[i], monthData])[0];
            chartItemsLeftPosition[i] = chartItemOffsetLeft;

            // render average per day analysis below the chart
            $(element).parent().find('.order-count-average-container').append(`
                ${
                    monthData.count > 0
                        ? `
                            <div class="d-flex flex-column align-items-center position-absolute">
                                <span class="fs-1 fw-500">
                                    ${numberFormat(averagePerDay)}
                                </span>
                                <small style="font-size: 11px;">${translations.per_day}</small>
                            </div>
                        `
                        : `<div style="width: 37.5px"></div>`
                }
            `);

            var amountElementWidth = $(element).parent().find('.order-count-average-container > div').eq(i).width();
            $(element).parent().find('.order-count-average-container > div').eq(i).css('left', chartItemOffsetLeft - (amountElementWidth / 2) + 'px');

            if (monthData.count > 0) {
                averagePerDaySum += averagePerDay; // sum average per day of each month
                monthsWithPositiveValue++; // count months with at least one order
                itemsSum += monthData.count; // sum orders of each month
            }
        });

        // order count average per month is the sum of all months count divided by the months which have at least one order
        var averagePerMonth = itemsSum / monthsWithPositiveValue;
        // order count average per day is the sum of all averages-per-day for each month divided by the months which have at least one order
        var averagePerDay = averagePerDaySum / monthsWithPositiveValue;
        
        // TODO
        comparisonValues['average-per-month'] = averagePerMonth;
        comparisonValues['average-per-day'] = averagePerDay;

        // render order count average per month
        averagePerMonth = numberFormat(averagePerMonth);
        $(element).parent().find('#average-per-month .value').prepend(`<span>${averagePerMonth.split(',')[0]}</span>`);
        $(element).parent().find('#average-per-month .value small').text(',' + averagePerMonth.split(',')[1]);
        // render order count average per day
        averagePerDay = numberFormat(averagePerDay);
        $(element).parent().find('#average-per-day .value').prepend(`<span>${averagePerDay.split(',')[0]}</span>`);
        $(element).parent().find('#average-per-day .value small').text(',' + averagePerDay.split(',')[1]);
    }

    var totalPieces = getOrdersTotalPieces(data);

    // TODO
    comparisonValues['total-pieces'] = totalPieces;

    var totalPiecesText = numberFormat(totalPieces).split(',')[0];
    $(element).parent().find('#total-pieces .value').html(totalPiecesText);
    
    if (data.length > 0) {
        var piecesPerOrder = totalPieces / data.length;
    } else {
        var piecesPerOrder = 0;
    }

    // TODO
    comparisonValues['pieces-per-order'] = piecesPerOrder;

    if (piecesPerOrder > 0) {
        var piecesPerOrder = totalPieces / data.length;
        piecesPerOrder = numberFormat(piecesPerOrder);
        $(element).parent().find('#pieces-per-order .value').prepend(`<span>${piecesPerOrder.split(',')[0]}</span>`);
        $(element).parent().find('#pieces-per-order .value small').text(',' + piecesPerOrder.split(',')[1]);
    } else {
        var piecesPerOrder = 0;
        $(element).parent().find('#pieces-per-order .value').prepend(`<span>0</span>`);
        $(element).parent().find('#pieces-per-order .value small').text(',00');
    }

    if (includeComparisonPercentages) {
        var comparisonDateOrdersCountData = calculateOrdersCountData(comparisonOrdersData, comparisonMonth, comparisonYear);

        if (comparisonMonth) { // if month is selected
            var itemsSum = comparisonDateOrdersCountData
                // make an array of values of chart items
                .map(function(item) {
                    return item.count;
                })
                // calculate the sum of all values
                .reduce((partialSum, a) => partialSum + a, 0);
    
            // chart item count (will be used later for the average value of average order count per day)
            var itemCount = comparisonDateOrdersCountData.length;
    
            var currentDate = moment(); // date object of today
            var statsDate = moment().set({ // date object of month selected
                year: comparisonYear,
                month: comparisonMonth - 1,
                date: 1,
            });
    
            // if month and year selected is in present (current month right now) then calculate average by dividing with the days until today
            if (statsDate.isSame(currentDate, 'month')) {
                var itemCount = currentDate.date();
            }
    
            // order count average per day
            var itemsAverage = itemsSum / itemCount;

            // TODO
            var comparisonavgperday = itemsAverage;
        } else {
            var itemsSum = 0;
            var averagePerDaySum = 0;
            var monthsWithPositiveValue = 0;
            comparisonDateOrdersCountData.forEach(function(monthData) {
                var currentDate = moment(); // date object of today
    
                var daysInMonth = monthData.date.daysInMonth(); // day count of the month displayed
    
                // if month and year selected is in present (current month right now) then calculate average by dividing with the days until today
                if (monthData.date.isSame(currentDate, 'month')) {
                    var daysInMonth = currentDate.date();
                }
    
                // the average per day is order count of the months divided by the days in month
                var averagePerDay = parseFloat(monthData.count / daysInMonth);
    
                if (monthData.count > 0) {
                    averagePerDaySum += averagePerDay; // sum average per day of each month
                    monthsWithPositiveValue++; // count months with at least one order
                    itemsSum += monthData.count; // sum orders of each month
                }
            });
    
            // order count average per month is the sum of all months count divided by the months which have at least one order
            var averagePerMonth = itemsSum / monthsWithPositiveValue;
            // order count average per day is the sum of all averages-per-day for each month divided by the months which have at least one order
            var averagePerDay = averagePerDaySum / monthsWithPositiveValue;

            // TODO
            var comparisonavgpermonth = averagePerMonth;
            var comparisonavgperday = averagePerDay;
        }

        renderComparePercentage(comparisonavgpermonth, comparisonValues['average-per-month'], element, '#comparison-average-per-month');

        $(element).parent().find('#comparison-average-per-month .value').prepend(`<span>${numberFormat(comparisonavgpermonth).split(',')[0]}</span>`);
        $(element).parent().find('#comparison-average-per-month .value small').text(',' + numberFormat(comparisonavgpermonth).split(',')[1]);
        $(element).parent().find('#comparison-average-per-day .value').prepend(`<span>${numberFormat(comparisonavgperday).split(',')[0]}</span>`);
        $(element).parent().find('#comparison-average-per-day .value small').text(',' + numberFormat(comparisonavgperday).split(',')[1]);

        renderComparePercentage(comparisonavgperday, comparisonValues['average-per-day'], element, '#comparison-average-per-day');

        var totalPieces = getOrdersTotalPieces(comparisonOrdersData);

        // TODO
        var comparisontotalpieces = totalPieces;

        renderComparePercentage(comparisontotalpieces, comparisonValues['total-pieces'], element, '#comparison-total-pieces');

        var comparisonTotalPiecesText = numberFormat(comparisontotalpieces).split(',')[0];
        $(element).parent().find('#comparison-total-pieces .value').html(comparisonTotalPiecesText);
        
        if (comparisonOrdersData.length > 0) {
            var piecesPerOrder = totalPieces / comparisonOrdersData.length;
        } else {
            var piecesPerOrder = 0;
        }

        var comparisonpiecesperorder = piecesPerOrder;

        renderComparePercentage(comparisonpiecesperorder, comparisonValues['pieces-per-order'], element, '#comparison-pieces-per-order');

        $(element).parent().find('#comparison-pieces-per-order .value').prepend(`<span>${numberFormat(comparisonpiecesperorder).split(',')[0]}</span>`);
        $(element).parent().find('#comparison-pieces-per-order .value small').text(',' + numberFormat(comparisonpiecesperorder).split(',')[1]);
    }
}

function createOrderTotalsChart(data, comparisonData, month, year, comparisonMonth, comparisonYear, element, includeComparisonPercentages) {
    /**
     * order totals chart
     */

    var ordersTotalsData = calculateOrdersTotalsData(data, month, year);

    if (month) {
        // make an array of labels for the x axis of the chart (display January, February for each month)
        var labels = ordersTotalsData.map(function(record) {
            return record.date.format('D');
        });
    } else {
        // make an array of labels for the x axis of the chart (display January, February for each month)
        var labels = ordersTotalsData.map(function(record) {
            return record.date.format('MMMM');
        });
    }

    if (comparisonData) {
        var comparisonDateOrdersTotalsData = calculateOrdersTotalsData(comparisonData, comparisonMonth, comparisonYear);
    }

    var chart; // chart object
    var chartOptions; // chart options object

    var series = [
        {
            name: year.toString(),
            type: 'bar',
            barWidth: '40px',
            label: {
                show: true,
                position: 'top',
                color: '#333333',
                fontWeight: 'bold',
                fontSize: '13px',
                formatter: function(params) { // method to format the label of each chart item
                    // render nothing if order totals is zero and add euro sign
                    return parseFloat(params.value) === 0 ? '' : numberFormat(params.value, true) + '€';
                },
            },
            itemStyle: {
                color: comparisonData ? lightGreenColor : greenColor,
            },
            silent: true,
            data: ordersTotalsData.map(function(record) {
                return record.total;
            }),
        },
    ];

    if (comparisonData) {
        series.push({
            name: comparisonYear.toString(),
            type: 'bar',
            barWidth: '40px',
            label: {
                show: true,
                position: 'top',
                color: '#333333',
                fontWeight: 'bold',
                fontSize: '13px',
                formatter: function(params) { // method to format the label of each chart item
                    // render nothing if order totals is zero and add euro sign
                    return parseFloat(params.value) === 0 ? '' : numberFormat(params.value, true) + '€';
                },
            },
            itemStyle: {
                color: greenColor,
            },
            silent: true,
            data: comparisonDateOrdersTotalsData.map(function(record) {
                return record.total;
            }),
        });
    }

    // orders-totals-chart options
    chartOptions = {
        title: {
            text: ''
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        grid: {
            left: '30px',
            right: '50px',
            bottom: '0%',
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                data: labels,
            },
        ],
        yAxis: [
            {
                type: 'value',
                minInterval: 1,
            },
        ],
        axisPointer: {
            show: false,
        },
        series: series,
    };

    if (comparisonYear) {
        chartOptions.legend = {
            data: [year.toString(), comparisonYear.toString()],
            left: 'auto',
            textStyle: {
                fontWeight: 'bold',
                fontSize: 15,
            },
        };
    }

    // initialize gateways chart using eCharts library
    function initChart() {
        chart = echarts.init(element, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        chartOptions && chart.setOption(chartOptions);
    }

    initChart();

    // on window resize, also resize the chart
    $(window).on('resize', function() {
        chart.resize();

        ordersTotalsData.forEach(function(monthData, i) {
            var chartItemOffsetLeft = chart.convertToPixel({ seriesIndex: 0 }, [labels[i], monthData])[0];
            chartItemsLeftPosition[i] = chartItemOffsetLeft;

            var amountElementWidth = $(element).parent().find('.order-total-average-container > div').eq(i).width();
            $(element).parent().find('.order-total-average-container > div').eq(i).css('left', chartItemOffsetLeft - (amountElementWidth / 2) + 'px');

        });
    });

    var chartItemsLeftPosition = [];

    if (!month) {
        ordersTotalsData.forEach(function(monthData, i) {
            var currentDate = moment(); // date object of today

            var daysInMonth = monthData.date.daysInMonth(); // day count of the month displayed

            // if month and year selected is in present (current month right now) then calculate average by dividing with the days until today
            if (monthData.date.isSame(currentDate, 'month')) {
                var daysInMonth = currentDate.date();
            }

            // the average per day is order count of the months divided by the days in month
            var averagePerDay = parseFloat(monthData.total / daysInMonth);
            
            var chartItemOffsetLeft = chart.convertToPixel({ seriesIndex: 0 }, [labels[i], monthData])[0];
            chartItemsLeftPosition[i] = chartItemOffsetLeft;

            // render average per day analysis below the chart
            $(element).parent().find('.order-total-average-container').append(`
                ${
                    monthData.total > 0
                        ? `
                            <div class="d-flex flex-column align-items-center position-absolute">
                                <span class="fs-1 fw-500">
                                    ${numberFormat(averagePerDay)}
                                </span>
                                <small style="font-size: 11px;">${translations.per_day}</small>
                            </div>
                        `
                        : `<div style="width: 47.5px"></div>`
                }
            `);

            var amountElementWidth = $(element).parent().find('.order-total-average-container > div').eq(i).width();
            $(element).parent().find('.order-total-average-container > div').eq(i).css('left', chartItemOffsetLeft - (amountElementWidth / 2) + 'px');
        });
    }

    // calculate all orders total
    var ordersTotal = 0;
    data.forEach(function(order) {
        ordersTotal += parseFloat(order.subtotal) + parseFloat(order.totalTax);
    });

    var ordersTotalAverage = (ordersTotal / data.length).toFixed(2); // calculate all orders total average
    ordersTotalAverage = ordersTotalAverage.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // add dot as thousands seperator
    ordersTotalAverage = ordersTotalAverage.replace(/.([^.]*)$/, ',' + '$1'); // replace last dot with comma (decimal seperator)
    $(element).parent().find('#order-total-average .value').prepend(`<span>${ordersTotalAverage.split(',')[0]}</span>`);
    $(element).parent().find('#order-total-average .value small').text(',' + ordersTotalAverage.split(',')[1] + '€');

    // calculate the average order total per day
    var daysOfOrdersCount = getDaysOfOrdersCount(month, year);

    var daysOfOrders = getDaysOfOrders(data);
    
    var orderTotalPerDaySum = 0;
    for (var date in daysOfOrders) {
        orderTotalPerDaySum += daysOfOrders[date];
    }

    if (orderTotalPerDaySum > 0) {
        averagePerDay = orderTotalPerDaySum / daysOfOrdersCount;

        // TODO
        var averageperday = averagePerDay;

        averagePerDay = numberFormat(averagePerDay);

        // render order total per day
        $(element).parent().find('#order-total-per-day .value').prepend(`<span>${averagePerDay.split(',')[0]}</span>`);
        $(element).parent().find('#order-total-per-day .value small').text(',' + averagePerDay.split(',')[1] + '€');
    } else {
        // render order total per day if it's zero
        $(element).parent().find('#order-total-per-day .value').prepend(`<span>0</span>`);
        $(element).parent().find('#order-total-per-day .value small').text(',00€');

        // TODO
        var averageperday = 0;
    }

    if (!month) {
        var activeMonthsCount = getMonthsOfOrdersCount(ordersTotalsData);

        // calculate the average order total per month
        var averagePerMonth = ordersTotalsData.map(function(item) { return item.total }).reduce((partialSum, a) => partialSum + a, 0) / activeMonthsCount;
        
        // TODO
        var averagepermonth = averagePerMonth;

        if (averagePerMonth < 1) {
            averagePerMonth = averagePerMonth.toString().replace('.', ',');
        } else {
            averagePerMonth = numberFormat(averagePerMonth).split(',')[0]
        }
        // render order total per month
        $(element).parent().find('#order-total-per-month .value').text(averagePerMonth + '€');
    }

    var ordersCartAverage = getOrdersCartAverage(data);

    if (data.length) {
        ordersCartAverage /= data.length;
        
        // TODO
        var orderscartaverage = ordersCartAverage;

        ordersCartAverage = numberFormat(ordersCartAverage);
        $(element).parent().find('#order-cart-average .value').prepend(`<span>${ordersCartAverage.split(',')[0]}</span>`);
        $(element).parent().find('#order-cart-average .value small').text(',' + ordersCartAverage.split(',')[1] + '€');
    } else {
        // TODO
        var orderscartaverage = 0;

        $(element).parent().find('#order-cart-average .value').prepend(`<span>0</span>`);
        $(element).parent().find('#order-cart-average .value small').text(',00€');
    }

    // TODO
    var totaltax = calculateTotalAmount('totalTax', 'total-tax');
    var totalship = calculateTotalAmount('totalShip', 'total-shipping-cost');
    var payondeliverycost = calculateTotalAmount('payOnDeliveryCost', 'total-pay-on-delivery-cost');

    function calculateTotalAmount(propertyKey, elementId) {
        var amount = 0;

        data.forEach(function(record) {
            amount += parseFloat(record[propertyKey]);
        });

        amountToNumber = amount;

        amount = numberFormat(amount);
        $(element).parent().find('#' + elementId + ' .value').prepend(`<span>${amount.split(',')[0]}</span>`);
        $(element).parent().find('#' + elementId + ' .value small').text(',' + amount.split(',')[1] + '€');

        return amountToNumber;
    }

    if (includeComparisonPercentages) {
        var daysOfOrdersCount = getDaysOfOrdersCount(comparisonMonth, comparisonYear);

        var daysOfOrders = getDaysOfOrders(comparisonOrdersData);
        
        var orderTotalPerDaySum = 0;
        for (var date in daysOfOrders) {
            orderTotalPerDaySum += daysOfOrders[date];
        }

        if (orderTotalPerDaySum > 0) {
            averagePerDay = orderTotalPerDaySum / daysOfOrdersCount;
            // TODO
            var comparisonaverageperday = averagePerDay;
        } else {
            // TODO
            var comparisonaverageperday = 0;
        }

        renderComparePercentage(comparisonaverageperday, averageperday, element, '#comparison-order-total-per-day');

        $(element).parent().find('#comparison-order-total-per-day .value').prepend(`<span>${numberFormat(comparisonaverageperday).split(',')[0]}</span>`);
        $(element).parent().find('#comparison-order-total-per-day .value small').text(',' + numberFormat(comparisonaverageperday).split(',')[1] + '€');

        if (!month) {
            var comparisonDateOrdersTotalsData = calculateOrdersTotalsData(comparisonOrdersData, comparisonMonth, comparisonYear);

            var activeMonthsCount = getMonthsOfOrdersCount(comparisonDateOrdersTotalsData);
    
            // calculate the average order total per month
            var averagePerMonth = comparisonDateOrdersTotalsData.map(function(item) { return item.total }).reduce((partialSum, a) => partialSum + a, 0) / activeMonthsCount;
            
            // TODO
            var comparisonaveragepermonth = averagePerMonth;

            renderComparePercentage(comparisonaveragepermonth, averagepermonth, element, '#comparison-order-total-per-month');

            $(element).parent().find('#comparison-order-total-per-month .value').text(numberFormat(comparisonaveragepermonth).split(',')[0] + '€');
        }
        
        var ordersCartAverage = getOrdersCartAverage(comparisonOrdersData);

        if (comparisonOrdersData.length) {
            ordersCartAverage /= comparisonOrdersData.length;
            
            // TODO
            var comparisonorderscartaverage = ordersCartAverage;
        } else {
            // TODO
            var comparisonorderscartaverage = 0;
        }

        renderComparePercentage(comparisonorderscartaverage, orderscartaverage, element, '#comparison-order-cart-average');

        $(element).parent().find('#comparison-order-cart-average .value').prepend(`<span>${numberFormat(comparisonorderscartaverage).split(',')[0]}</span>`);
        $(element).parent().find('#comparison-order-cart-average .value small').text(',' + numberFormat(comparisonorderscartaverage).split(',')[1] + '€');

        function calculateTotalAmount(propertyKey) {
            var amount = 0;

            comparisonOrdersData.forEach(function(record) {
                amount += parseFloat(record[propertyKey]);
            });

            amount = amount;

            return amount;
        }

        // TODO
        var comparisontotaltax = calculateTotalAmount('totalTax');
        var comparisontotalship = calculateTotalAmount('totalShip');
        var comparisonpayondeliverycost = calculateTotalAmount('payOnDeliveryCost');

        renderComparePercentage(comparisontotaltax, totaltax, element, '#comparison-total-tax');

        renderComparePercentage(comparisontotalship, totalship, element, '#comparison-total-shipping-cost');

        renderComparePercentage(comparisonpayondeliverycost, payondeliverycost, element, '#comparison-total-pay-on-delivery-cost');

        $(element).parent().find('#comparison-total-tax .value').prepend(`<span>${numberFormat(comparisontotaltax).split(',')[0]}</span>`);
        $(element).parent().find('#comparison-total-tax .value small').text(',' + numberFormat(comparisontotaltax).split(',')[1] + '€');

        $(element).parent().find('#comparison-total-shipping-cost .value').prepend(`<span>${numberFormat(comparisontotalship).split(',')[0]}</span>`);
        $(element).parent().find('#comparison-total-shipping-cost .value small').text(',' + numberFormat(comparisontotalship).split(',')[1] + '€');

        $(element).parent().find('#comparison-total-pay-on-delivery-cost .value').prepend(`<span>${numberFormat(comparisonpayondeliverycost).split(',')[0]}</span>`);
        $(element).parent().find('#comparison-total-pay-on-delivery-cost .value small').text(',' + numberFormat(comparisonpayondeliverycost).split(',')[1] + '€');
    }
}

function createPieChart(element, series) {
    var total = series
        .map(function(data) {
            return data.value;
        })
        .reduce((partialSum, a) => partialSum + a, 0);

    chartData = series.map(function(data) {
        var value = data.value;
        var percentage = 0;
        if (value > 0) {
            percentage = parseFloat((value * 100) / total).toFixed(1);
        }
        
        return {
            value: data.value,
            // as label of value in chart, the percentage of value
            name: percentage + '%',
            label: {
                fontSize: 15,
                fontWeight: 'bold',
            },
            itemStyle: {
                color: data.style,
            },
        };
    });

    var legendValues = series
        .map(function(data) {
            return data.value + ' ' + data.label;
        });

    var chart; // chart object
    var chartOptions; // chart options

    chartOptions = {
        title: {
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                return params.value + ' ' + series[params.dataIndex].label;
            },
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                fontSize: 15,
            },
            formatter: (x) => {
                var label = legendValues.shift();

                if (legendValues.length === 0) {
                    legendValues = series
                        .map(function(data) {
                            return data.value + ' ' + data.label;
                        });
                }

                return label;
            },
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '50%',
                data: chartData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    // initialize chart using eCharts library
    function initChart() {
        chart = echarts.init(element, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        chartOptions && chart.setOption(chartOptions);
    }

    initChart();

    // on window resize, also resize the chart
    $(window).on('resize', chart.resize);
}

function numberFormat(number, integer) {
    if (integer) {
        number = parseInt(number).toString();
        number = number.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // add dot as thousands seperator
    } else {
        number = parseFloat(number).toFixed(2);
        number = number.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // add dot as thousands seperator
        number = number.replace(/.([^.]*)$/, ',' + '$1'); // replace last dot with comma (decimal seperator)
    }

    return number;
}

function createOrdersYearsChart(ordersData, element) {
    var seriesData = [];
    var xAxisData = [];

    var years = [];
    for (var year in ordersData) {
        years.push(year);
        xAxisData.push(year.toString());
        seriesData.push(ordersData[year].length);
    }

    var orderCountsChartOptions = {
        title: {
            text: translations.order_count,
            left: 'center',
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            boundaryGap: false,
            axisLabel: {
                fontSize: '1.953125rem',
                fontWeight: 'bold',
                color: '#111111',
            },
        },
        grid: {
            left: '250px',
            right: '100px',
        },
        label: {
            fontWeight: 'bold',
            fontSize: '1rem',
        },
        legend: {
            data: [],
        },
        yAxis: {
            show: true,
            axisLabel: {
                show: false,
            },
            type: 'value',
        },
        series: {
            name: '',
            data: seriesData,
            type: 'line',
            lineStyle: {
                color: blueColor,
                width: 3,
            },
            areaStyle: {
                color: lighterBlueColor,
            },
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            silent: true,
        },
    };
    
    // initialize years comparison order count chart using eCharts library
    var orderCountsChart;
    function initOrderCountsChart() {
        orderCountsChart = echarts.init(document.querySelector('.years-comparison #order-counts-chart'), null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        orderCountsChartOptions && orderCountsChart.setOption(orderCountsChartOptions);
    }

    initOrderCountsChart();

    var orderCountsChartItemsLeftPosition = [];

    function resizeOrderCountsChart() {
        orderCountsChart.resize();
        
        Object.entries(ordersData).forEach(function(entry, i) {
            var chartItemOffsetLeft = orderCountsChart.convertToPixel({ seriesIndex: 0 }, [entry[0], entry[1].length])[0] - 200;
            orderCountsChartItemsLeftPosition[i] = chartItemOffsetLeft;

            var percentageElementWidth = $('.order-counts-chart-container .comparison-percentages > div').eq(i).width();
            $('.order-counts-chart-container .comparison-percentages > div').eq(i).css('left', chartItemOffsetLeft - (percentageElementWidth / 2) + 'px');
            
            var percentageElementWidth = $('.order-counts-chart-container .average-per-day-amounts > div').eq(i).width();
            $('.order-counts-chart-container .average-per-day-amounts > div').eq(i).css('left', chartItemOffsetLeft - (percentageElementWidth / 2) + 'px');

            var percentageElementWidth = $('.order-counts-chart-container .total-pieces-amounts > div').eq(i).width();
            $('.order-counts-chart-container .total-pieces-amounts > div').eq(i).css('left', chartItemOffsetLeft - (percentageElementWidth / 2) + 'px');

            var percentageElementWidth = $('.order-counts-chart-container .pieces-per-order-amounts > div').eq(i).width();
            $('.order-counts-chart-container .pieces-per-order-amounts > div').eq(i).css('left', chartItemOffsetLeft - (percentageElementWidth / 2) + 'px');
        });
    }

    // on window resize, also resize the chart
    $(window).on('resize', resizeOrderCountsChart);

    Object.entries(ordersData).forEach(function(entry, i, entries) {
        var chartItemOffsetLeft = orderCountsChart.convertToPixel({ seriesIndex: 0 }, [entry[0], entry[1].length])[0] - 200;
        orderCountsChartItemsLeftPosition[i] = chartItemOffsetLeft;

        if (i === 0) {
            $('.order-counts-chart-container .comparison-percentages').append(`<div class="empty" style="width: 70px;"></div>`);
            return;
        }

        var diff = getDiffBetweenValues(entry[1].length, entries[i - 1][1].length);

        $('.order-counts-chart-container .comparison-percentages').append(`
            <div class="d-flex text-center position-absolute text-${diff > 0 ? 'success' : 'danger'} fw-500">
                <span>${diff > 0 ? '+' : ''}${diff.toFixed(2)}%</span>
                <span><i class="bi bi-arrow-${diff > 0 ? 'up' : (diff < 0 ? 'down' : '')}"></i></span>
            </div>
        `);

        var percentageElementWidth = $('.order-counts-chart-container .comparison-percentages > div').eq(i).width();
        $('.order-counts-chart-container .comparison-percentages > div').eq(i).css('left', chartItemOffsetLeft - (percentageElementWidth / 2) + 'px');
    });

    var i = 0;
    for (var year in ordersData) {
        var daysInYear = getTotalDaysOfYear(year);

        var averagePerDay = ordersData[year].length / daysInYear;
        $('.order-counts-chart-container .average-per-day-amounts').append(`
            <div class="position-absolute text-center fs-2 fw-500">
                <span>${numberFormat(averagePerDay).split(',')[0]}</span><small>,${numberFormat(averagePerDay).split(',')[1]}</small>
            </div>
        `);

        var percentageElementWidth = $('.order-counts-chart-container .average-per-day-amounts > div').eq(i).width();
        $('.order-counts-chart-container .average-per-day-amounts > div').eq(i).css('left', orderCountsChartItemsLeftPosition[i] - (percentageElementWidth / 2) + 'px');

        var totalPieces = getOrdersTotalPieces(ordersData[year]);

        $('.order-counts-chart-container .total-pieces-amounts').append(`
            <div class="position-absolute text-center fs-2 fw-300">
                <span>${numberFormat(totalPieces).split(',')[0]}</span>
            </div>
        `);

        var percentageElementWidth = $('.order-counts-chart-container .total-pieces-amounts > div').eq(i).width();
        $('.order-counts-chart-container .total-pieces-amounts > div').eq(i).css('left', orderCountsChartItemsLeftPosition[i] - (percentageElementWidth / 2) + 'px');

        var piecesPerOrder = totalPieces / ordersData[year].length;

        $('.order-counts-chart-container .pieces-per-order-amounts').append(`
            <div class="position-absolute text-center fs-2 fw-300">
                <span>${numberFormat(piecesPerOrder).split(',')[0]}</span><small>,${numberFormat(piecesPerOrder).split(',')[1]}</small>
            </div>
        `);

        var percentageElementWidth = $('.order-counts-chart-container .pieces-per-order-amounts > div').eq(i).width();
        $('.order-counts-chart-container .pieces-per-order-amounts > div').eq(i).css('left', orderCountsChartItemsLeftPosition[i] - (percentageElementWidth / 2) + 'px');

        i++;
    }

    var seriesData = [];
    var xAxisData = [];

    var years = [];
    for (var year in ordersData) {
        years.push(year);
        xAxisData.push(year.toString());
        var ordersTotal = ordersData[year]
            .map(function(order) {
                return parseFloat(order.subtotal) + parseFloat(order.totalTax);
            })
            .reduce((partialSum, a) => partialSum + a, 0);
        seriesData.push(parseInt(ordersTotal));
    }

    var ordersTotalsChartOptions = {
        title: {
            text: translations.order_totals,
            subtext: translations.vat_included_no_shipping_cost,
            subtextStyle: {
                fontSize: 12,
            },
            left: 'center',
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            boundaryGap: false,
            axisLabel: {
                fontSize: '1.953125rem',
                fontWeight: 'bold',
                color: '#111111',
            },
        },
        grid: {
            left: '250px',
            right: '100px',
        },
        legend: {
            data: [],
        },
        yAxis: {
            show: true,
            axisLabel: {
                show: false,
            },
            type: 'value',
        },
        label: {
            fontWeight: 'bold',
            fontSize: '1rem',
            formatter: function(params) {
                return numberFormat(params.value, true) + '€';
            },
        },
        series: {
            name: '',
            data: seriesData,
            type: 'line',
            itemStyle: {
                color: greenColor,
            },
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {
                color: lighterGreenColor,
            },
            silent: true,
        },
    };
    
    var ordersTotalsChartItemsLeftPosition = [];

    // initialize years comparison order count chart using eCharts library
    var ordersTotalsChart;
    function initOrdersTotalsChart() {
        ordersTotalsChart = echarts.init(document.querySelector('.years-comparison #orders-totals-chart'), null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        ordersTotalsChartOptions && ordersTotalsChart.setOption(ordersTotalsChartOptions);
    }

    initOrdersTotalsChart();

    function resizeOrdersTotalsChart() {
        ordersTotalsChart.resize();

        seriesData.forEach(function(data, i) {
            var chartItemOffsetLeft = ordersTotalsChart.convertToPixel({ seriesIndex: 0 }, [Object.entries(ordersData)[i][0], data])[0] - 200;
            ordersTotalsChartItemsLeftPosition[i] = chartItemOffsetLeft;

            var amountElementWidth = $('.orders-totals-chart-container .comparison-percentages > div').eq(i).width();
            $('.orders-totals-chart-container .comparison-percentages > div').eq(i).css('left', chartItemOffsetLeft - (amountElementWidth / 2) + 'px');

            var amountElementWidth = $('.orders-totals-chart-container .average-per-day-amounts > div').eq(i).width();
            $('.orders-totals-chart-container .average-per-day-amounts > div').eq(i).css('left', chartItemOffsetLeft - (amountElementWidth / 2) + 'px');
            
            var amountElementWidth = $('.orders-totals-chart-container .cart-average-amounts > div').eq(i).width();
            $('.orders-totals-chart-container .cart-average-amounts > div').eq(i).css('left', chartItemOffsetLeft - (amountElementWidth / 2) + 'px');

            var amountElementWidth = $('.orders-totals-chart-container .total-shipping-cost-amounts > div').eq(i).width();
            $('.orders-totals-chart-container .total-shipping-cost-amounts > div').eq(i).css('left', chartItemOffsetLeft - (amountElementWidth / 2) + 'px');
        });
    }

    // on window resize, also resize the chart
    $(window).on('resize', resizeOrdersTotalsChart);

    seriesData.forEach(function(data, i) {
        var chartItemOffsetLeft = ordersTotalsChart.convertToPixel({ seriesIndex: 0 }, [Object.entries(ordersData)[i][0], data])[0] - 200;
        ordersTotalsChartItemsLeftPosition[i] = chartItemOffsetLeft;

        if (i === 0) {
            $('.orders-totals-chart-container .comparison-percentages').append(`<div class="empty" style="width: 70px;"></div>`);
            return;
        }

        var diff = getDiffBetweenValues(data, seriesData[i - 1]);

        $('.orders-totals-chart-container .comparison-percentages').append(`
            <div class="position-absolute d-flex fw-500 text-center text-${diff > 0 ? 'success' : 'danger'}">
                <span>${diff > 0 ? '+' : ''}${diff.toFixed(2)}%</span>
                <span><i class="bi bi-arrow-${diff > 0 ? 'up' : (diff < 0 ? 'down' : '')}"></i></span>
            </div>
        `);

        var amountElementWidth = $('.orders-totals-chart-container .comparison-percentages > div').eq(i).width();
        $('.orders-totals-chart-container .comparison-percentages > div').eq(i).css('left', chartItemOffsetLeft - (amountElementWidth / 2) + 'px');
    });

    seriesData.forEach(function(data, i) {
        var daysInYear = 0;

        for (var k = 0; k < 12; k++) {
            var date = moment().set({
                year: year,
                month: k,
                day: 1,
            });

            daysInYear += date.daysInMonth();
        }

        var averagePerDay = data / daysInYear;
        $('.orders-totals-chart-container .average-per-day-amounts').append(`
            <div class="text-center fs-2 fw-500" style="width: 70px; position: absolute; left: ${ordersTotalsChartItemsLeftPosition[i]}px;">
                <span>${numberFormat(averagePerDay).split(',')[0]}</span><small>,${numberFormat(averagePerDay).split(',')[1]}€</small>
            </div>
        `);
    });

    var i = 0;
    for (var year in ordersData) {
        var ordersCartSum = 0;

        ordersData[year].forEach(function(order) {
            ordersCartSum += parseFloat(order.subtotal) + parseFloat(order.totalTax);
        });

        var cartAverage = ordersCartSum / ordersData[year].length;

        $('.orders-totals-chart-container .cart-average-amounts').append(`
            <div class="text-center fs-2 fw-300" style="width: 70px; position: absolute; left: ${ordersTotalsChartItemsLeftPosition[i]}px;">
                <span>${numberFormat(cartAverage).split(',')[0]}</span><small>,${numberFormat(cartAverage).split(',')[1]}€</small>
            </div>
        `);

        i++;
    }

    for (var year in ordersData) {
        var totalShippingCost = ordersData[year]
            .map(function(order) {
                return parseFloat(order.totalShip);
            })
            .reduce((partialSum, a) => partialSum + a, 0);
        
            $('.orders-totals-chart-container .total-shipping-cost-amounts').append(`
            <div class="text-center fs-2 fw-300" style="width: 70px; position: absolute; left: ${ordersTotalsChartItemsLeftPosition[i]}px;">
                <span>${numberFormat(totalShippingCost).split(',')[0]}</span><small>,${numberFormat(totalShippingCost).split(',')[1]}€</small>
            </div>
        `);
    }
}

function calculateOrdersCountData(data, month, year) {
    var ordersCountData = [];

    if (month) { // month is selected
        // date selected
        var date = moment().set({ year: year, month: month - 1, date: 1 });
        
        // for each day of month
        for (var i = 1; i <= date.daysInMonth(); i++) {
            // date of specific day to be displayed
            var d = moment().set({ year: year, month: month - 1, date: i });

            // count orders of the specific day
            var orderCount = data
                .filter(function(record) {
                    return record.createdAt.isSame(d, 'day');
                }).length

            // add count in an array
            ordersCountData.push({
                date: d,
                count: orderCount,
            });
        }
    } else {
        for (var i = 0; i < 12; i++) {
            // date of specific month to be displayed
            var d = moment().set({ year: year, month: i, date: 1 });

            // count orders of the specific month (in chart all months are displayed)
            var orderCount = data
                .filter(function(record) {
                    return record.createdAt.isSame(d, 'month');
                }).length

            // add count value to statistics data array (the array will be passed to chart library later) 
            ordersCountData.push({
                date: d,
                count: orderCount,
            });
        }
    }

    return ordersCountData;
}

function calculateOrdersTotalsData(data, month, year) {
    var ordersTotalsData = [];

    if (month) { // a month is selected
        // date object of the selected month
        var date = moment().set({ year: year, month: month - 1, date: 1 });

        // for each day of the month selected
        for (var i = 1; i <= date.daysInMonth(); i++) {
            // date object of the day
            var d = moment().set({ year: year, month: month - 1, date: i });

            // calculate all orders total of this specific day
            var dayTotal = data
                // get orders of this day
                .filter(function(record) {
                    return record.createdAt.isSame(d, 'day');
                })
                // create an array of totals of all orders
                .map(function(record) {
                    return parseFloat(record.subtotal) + parseFloat(record.totalTax);
                })
                // make a sum of the totals
                .reduce((partialSum, a) => partialSum + a, 0);

            // add orders total to a data array (the array will be used in the chart library later)
            ordersTotalsData.push({
                date: d,
                total: dayTotal,
            });
        }
    } else {
        // for each month
        for (var i = 0; i < 12; i++) {
            // date object of the month
            var d = moment().set({ year: year, month: i, date: 1 });

            // calculate all orders total of this specific month
            var monthTotal = data
            // get orders of this month
                .filter(function(record) {
                    return record.createdAt.isSame(d, 'month');
                })
                // create an array of totals of all orders
                .map(function(record) {
                    return parseFloat(record.subtotal) + parseFloat(record.totalTax);
                })
                // make a sum of the totals
                .reduce((partialSum, a) => partialSum + a, 0);

            // add orders total to a data array (the array will be used in the chart library later)
            ordersTotalsData.push({
                date: d,
                total: monthTotal,
            });
        }
    }

    return ordersTotalsData;
}

function renderComparePercentage(valueA, valueB, container, elementSelector) {
    var diff = getDiffBetweenValues(valueA, valueB);
    
    $(container).parent().find(elementSelector).append(`
        <div class="fw-500 text-${
            diff > 0
                ? 'success'
                : (diff < 0
                    ? 'danger'
                    : '')
            }">
            ${numberFormat(diff)}%
            ${
                diff > 0
                    ? '<i class="bi bi-arrow-up"></i>'
                    : diff < 0
                        ? '<i class="bi bi-arrow-down"></i>'
                        : ''

            }
        </div>
    `);
}

function getDaysOfOrdersCount(month, year) {
    var currentDate = moment(); // date object of today

    var daysOfOrdersCount;

    if (month) {
        var statsDate = moment().set({ // date object of the month selected
            year: year,
            month: month - 1,
            date: 1,
        });

        // day count of the month displayed
        daysOfOrdersCount = statsDate.daysInMonth();

        // if month and year selected is in present (current month right now) then calculate average by dividing with the days until today
        if (statsDate.isSame(currentDate, 'month')) {
            daysOfOrdersCount = currentDate.date();
        }
    } else {
        var a = moment().set({
            year: year + 1,
            month: 0,
            day: 1,
        });
        
        var b = moment().set({
            year: year,
            month: 0,
            day: 1,
        });
        
        if (b.isSame(currentDate, 'year')) {
            daysOfOrdersCount = currentDate.diff(b, 'days');
        } else {
            daysOfOrdersCount = a.diff(b, 'days');
        }
    }

    return daysOfOrdersCount;
}

function getDaysOfOrders(orders) {
    var daysOfOrders = {};

    orders.forEach(function(record) {
        var dateToString = record.createdAt.format('D-M-YYYY');
        if (!daysOfOrders[dateToString]) {
            daysOfOrders[dateToString] = parseFloat(record.subtotal) + parseFloat(record.totalTax);
        } else {
            daysOfOrders[dateToString] += parseFloat(record.subtotal) + parseFloat(record.totalTax);
        }
    });

    return daysOfOrders;
}

function getOrdersCartAverage(orders) {
    var ordersCartAverage = 0;

    orders.forEach(function(record) {
        ordersCartAverage += parseFloat(record['subtotal']) + parseFloat(record['totalTax']);
    });

    return ordersCartAverage;
}

function getMonthsOfOrdersCount(data) {
    var currentDate = moment(); // date object of today

    var statsDate = moment().set({ // date object of the year selected
        year: year,
        month: 1,
        date: 1,
    });

    // month count of the year displayed
    var activeMonthsCount = data
        .filter(function(item) {
            return item.total > 0;
        }).length;

    // if month and year selected is in present (current month right now) then calculate average by dividing with the months until today
    if (statsDate.isSame(currentDate, 'year')) {
        var activeMonthsCount = currentDate.month() + 1;
    }

    return activeMonthsCount;
}

function getOrdersTotalPieces(orders) {
    var totalPieces = 0;
    
    orders.forEach(function(order) {
        if (typeof order.totalPieces === 'string') {
            totalPieces += parseInt(order.totalPieces);
        }
    });

    return totalPieces;
}

function getTotalDaysOfYear(year) {
    var daysInYear = 0;

    for (var k = 0; k < 12; k++) {
        var date = moment().set({
            year: year,
            month: k,
            day: 1,
        });

        daysInYear += date.daysInMonth();
    }

    return daysInYear;
}