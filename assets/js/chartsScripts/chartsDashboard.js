function renderDashBarChart(hitsPerDaySerries){
    var hitsSerries = hitsPerDaySerries.split(",");
    var daysOfMonth = [];

    // current dates objects and variables
    const dateObject        = new Date();
    const currentMonthIndex = new Date().getMonth() + 1;
    var currentYear         = new Date().getFullYear();

    // function to get current days of month
    var getDaysInMonth = function(month,year) {
        return new Date(year, month, 0).getDate();
    };
    
    // max days of month
    var maxDaysOfMonth = getDaysInMonth(currentMonthIndex, currentYear);

    // create an array of days of current month to use for x axis labels
    for (let i = 1; i <= maxDaysOfMonth; i++) {
        daysOfMonth[i-1] = i;
    }

    var chart;
    var options;

    options = {
        title: {
            text: ''
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
                boundaryGap: false,
                data: daysOfMonth,
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
                    color: "#36A2EB",
                    width: 3,
                },
                areaStyle: {
                    color: "#EFFAFF",
                },
                silent: true,
                data: hitsSerries,
            },
        ],
    };

    function initChart() {
        $('.chart-container').empty();
        $('.chart-container').append($('<canvas id="line-chart" height="450"></canvas>'));
        $('#line-chart').attr('width', $('#line-chart').parent().width());
        chart = echarts.init(document.getElementById('line-chart'));
        options && chart.setOption(options);
    }

    initChart();

    $(window).on('resize', initChart);
}