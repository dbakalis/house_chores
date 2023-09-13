$(document).ready(function() {
    $('input[type="radio"][name="year"]').change(function(e) {
        addGetParam('month', '');
        addGetParam('comparison-month', '');
        addGetParam('comparison-year', '');
        addGetParam('year', e.target.value, true);
    });

    $('.btn-view-month-statistics').click(function() {
        addGetParam('comparison-month', '');
        addGetParam('comparison-year', '');
        addGetParam('month', $('select[name="month"]').eq(0).val());
        addGetParam('year', $('select[name="year"]').eq(0).val(), true);
    });

    $('.btn-compare-months').click(function() {
        if ($('select[name="month"]').eq(1).val() &&
            $('select[name="year"]').eq(1).val() &&
            $('select[name="comparison-month"]').val() &&
            $('select[name="comparison-year"]').val()
        ) {
            addGetParam('month', $('select[name="month"]').eq(1).val());
            addGetParam('year', $('select[name="year"]').eq(1).val());
            addGetParam('comparison-month', $('select[name="comparison-month"]').val());
            addGetParam('comparison-year', $('select[name="comparison-year"]').val(), true);
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
        
        addGetParam('year', '');
        addGetParam('month', '');
        addGetParam('comparison-month', '');
        addGetParam('comparison-year', '');
        addGetParam('years', yearsSelected.join(','));
    });

    $('.btn-submit-years').click(function(e) {
        if ($('input[name="year[]"]:checked').length >= 2) {
            location.href = buildedLocation;
        } else {
            showMessage(translations.choose_at_least_two_years);
        }
    });


    if (typeof years === 'undefined') {
        var labels = [];

        if (month) {
            var date = moment().set({
                year: year,
                month: month - 1,
                day: 1,
            });

            for (let i = 1; i <= date.daysInMonth(); i++) {
                labels.push(i.toString());
            }
        } else {
            for (let i = 1; i <= 12; i++) {
                var d = moment().set({
                    year: year,
                    month: i - 1,
                    day: 1,
                });

                labels.push(d.format('MMMM'));
            }
        }

        var comparisonDateLabels = [];

        if (comparisonMonth) {
            var date = moment().set({
                year: comparisonYear,
                month: comparisonMonth - 1,
                day: 1,
            });

            for (let i = 1; i <= date.daysInMonth(); i++) {
                comparisonDateLabels.push(i.toString());
            }
        }

        if (month) {
            createLineChart(labels, monthlyVisitsData, document.querySelector('#visits-chart'), blueColor, lighterBlueColor);
            createLineChart(labels, monthlyVisitorsData, document.querySelector('#visitors-chart'), greenColor, lighterGreenColor);

            if (comparisonMonth) {
                createLineChart(comparisonDateLabels, comparisonMonthlyVisitsData, document.querySelector('#comparison-visits-chart'), blueColor, lighterBlueColor);
                createLineChart(comparisonDateLabels, comparisonMonthlyVisitorsData, document.querySelector('#comparison-visitors-chart'), greenColor, lighterGreenColor);
            }
        } else {
            createLineChart(labels, yearlyVisitsData, document.querySelector('#visits-chart'), blueColor, lighterBlueColor);
            createLineChart(labels, yearlyVisitorsData, document.querySelector('#visitors-chart'), greenColor, lighterGreenColor);
        }
    } else {
        createYearsComparisonCharts(comparisonYearsData);
    }
});

function createLineChart(labels, data, element, lineColor, areaColor, xAxisLabelSize, multipleSeriesData, legendLabels) {
    var chart = echarts.init(element, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    var values = data;

    var chartOptions = {
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
            show: true,
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
                type: 'line',
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
                    color: lineColor,
                    width: 3,
                },
                areaStyle: {
                    color: areaColor,
                },
                silent: true,
                data: values,
            },
        ],
    };

    if (multipleSeriesData) {
        values.forEach(function(data, i) {
            chartOptions.series[i] = {
                name: legendLabels[i],
                type: 'line',
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
                    color: lineColor,
                    width: 3,
                },
                areaStyle: {
                    color: areaColor,
                },
                silent: true,
                data: data,
            };
        });
    }

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

function createYearsComparisonCharts(data) {
    console.log(data)

    // var labels = [];

    // for (let i = 1; i <= 12; i++) {
    //     var d = moment().set({
    //         year: year,
    //         month: i - 1,
    //         day: 1,
    //     });

    //     labels.push(d.format('MMMM'));
    // }

    labels = Object.keys(data);

    var visitsChartData = [];

    for (var year in data) {
    //     visitsChartData.push(data[year].visitsData);
        var totalCount = 0;
        data[year].visitsData.forEach(function(count) {
            totalCount += parseInt(count);
        });
        visitsChartData.push(totalCount);
    }

    // createLineChart(labels, visitsChartData, document.getElementById('years-comparison-visits-chart'), undefined, 'rgba(0, 0, 0, 0)', 'large', true);
    createLineChart(labels, visitsChartData, document.getElementById('years-comparison-visits-chart'), blueColor, lighterBlueColor, 'large');

    var visitorsChartData = [];

    for (var year in data) {
    //     visitorsChartData.push(data[year].visitsData);
        var totalCount = 0;
        data[year].visitorsData.forEach(function(count) {
            totalCount += parseInt(count);
        });
        visitorsChartData.push(totalCount);
    }

    // createLineChart(labels, visitorsChartData, document.getElementById('years-comparison-visitors-chart'), undefined, 'rgba(0, 0, 0, 0)', 'large', true);
    createLineChart(labels, visitorsChartData, document.getElementById('years-comparison-visitors-chart'), greenColor, lighterGreenColor, 'large');

    var labels = [];

    for (let i = 1; i <= 12; i++) {
        var d = moment().set({
            year: year,
            month: i - 1,
            day: 1,
        });

        labels.push(d.format('MMMM'));
    }

    var visitsChartData = [];

    for (var year in data) {
        visitsChartData.push(data[year].visitsData);
    }

    createLineChart(labels, visitsChartData, document.getElementById('years-comparison-visits-chart2'), undefined, 'rgba(0, 0, 0, 0)', 'normal', true, Object.keys(data));

    var visitorsChartData = [];

    for (var year in data) {
        visitorsChartData.push(data[year].visitsData);
    }

    createLineChart(labels, visitorsChartData, document.getElementById('years-comparison-visitors-chart2'), undefined, 'rgba(0, 0, 0, 0)', 'normal', true, Object.keys(data));
}

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

    // add year param to new location
    if (key !== 'year' && currentUrl.searchParams.get('year')) {
        newLocation += '&year=' + currentUrl.searchParams.get('year');
    }

    // add month param to new location
    if (key !== 'month' && currentUrl.searchParams.get('month')) {
        newLocation += '&month=' + currentUrl.searchParams.get('month');
    }

    // add year param to new location
    if (key !== 'comparison-year' && currentUrl.searchParams.get('comparison-year')) {
        newLocation += '&comparison-year=' + currentUrl.searchParams.get('comparison-year');
    }

    // add month param to new location
    if (key !== 'comparison-month' && currentUrl.searchParams.get('comparison-month')) {
        newLocation += '&comparison-month=' + currentUrl.searchParams.get('comparison-month');
    }

    if (redirect) {
        location.href = newLocation;
    } else {
        buildedLocation = newLocation;
    }
}
