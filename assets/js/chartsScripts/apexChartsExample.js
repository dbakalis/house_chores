// chart options
var optionsDaily = {
    series: [{
        name: 'Clicks',
        data: hitsSerries
    }],
    chart: {
        height: 500,
        type: 'bar',
        toolbar: {
            show: false,
        }
    },
    fill: {
        colors: ['#FF8A45']
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            columnWidth: '30%',
            dataLabels: {
                position: 'top', // top, center, bottom
            },
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (theVal) {
            if(theVal != 0) {
                return theVal;
            }
        },
        offsetY: -30,
        style: {
            fontSize: '18px',
            colors: ["#000000"]
        }
    },
    xaxis: {
        categories: daysOfMonth,
        position: 'bottom',
        axisBorder: {
            show: true
        },
        axisTicks: {
            show: true
        },
        crosshairs: {
            fill: {
                type: 'gradient',
                gradient: {
                    colorFrom: '#FF8A45',
                    colorTo: '#FF8A45',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                }
            }
        }
    },
    yaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: true,
        },
        labels: {
            show: true,
            formatter: function (theVal) {
                return theVal;
            }
        }
    },
    tooltip: {
        x: {
            show: false
        },
        y: {
            show: false
        },
        marker: {
            show: false,
        },
    },
    title: {
        align: 'center',
        style: {
            fontWeight: 'bold',
            fontSize: '28px',
            color: '#444'
        }
    },
};

var chartDaily = new ApexCharts(document.querySelector("#dashboardBarChart"), optionsDaily);
chartDaily.render();