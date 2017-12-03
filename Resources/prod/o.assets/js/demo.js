type = ['', 'info', 'success', 'warning', 'danger'];


demo = {
    initPickColor: function() {
        $('.pick-class-label').click(function() {
            var new_class = $(this).attr('new-class');
            var old_class = $('#display-buttons').attr('data-class');
            var display_div = $('#display-buttons');
            if (display_div.length) {
                var display_buttons = display_div.find('.btn');
                display_buttons.removeClass(old_class);
                display_buttons.addClass(new_class);
                display_div.attr('data-class', new_class);
            }
        });
    },

    initDashboardPageCharts: function(data) {      
        dataDailySalesChart = {
            labels: (data.grouping.winning.filled.map(e => e.date_week_day)).reverse(),
            series: [
                (data.grouping.winning.filled.map(e => e.count)).reverse()                
            ]
        };

        optionsDailySalesChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: data.grouping.winning.max,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }

        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
        md.startAnimationForLineChart(dailySalesChart);

        

        dataCompletedTasksChart = {
            labels: (data.grouping.winning.filled.map(e => e.date_week_day)).reverse(),
            series: [
                (data.grouping.product.filled.map(e => e.count)).reverse()
            ]
        };

        optionsCompletedTasksChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            showArea: true,
            showPoint: false,            
            high: data.grouping.product.max,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }

        var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);
        md.startAnimationForLineChart(completedTasksChart);


        var dataEmailsSubscriptionChart = {
            labels: (data.grouping.winning.filled.map(e => e.date_week_day)).reverse(),
            series: [
                (data.grouping.payment.filled.map(e => e.count)).reverse()
            ]
        };
        var optionsEmailsSubscriptionChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: data.grouping.payment.max,
            chartPadding: {
                top: 0,
                right: 5,
                bottom: 0,
                left: 0
            }
        };
        var responsiveOptions = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function(value) {
                        return value[0];
                    }
                }
            }]
        ];
        var emailsSubscriptionChart = Chartist.Bar('#emailsSubscriptionChart', dataEmailsSubscriptionChart, optionsEmailsSubscriptionChart, responsiveOptions);
        md.startAnimationForBarChart(emailsSubscriptionChart);
  
  
        var monthlyUsersChart = {
            labels: (data.grouping.users.filled.map(e => e.date_month)).reverse(),
            series: [
                (data.grouping.users.filled.map(e => e.count)).reverse()
            ]
        };

        var monthlyUsersOptions = {
            lineSmooth: Chartist.Interpolation.step({
                tension: 0
            }),
            low: 0,
            showPoint: false,
            showArea : true,
            high: data.grouping.users.max,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        }

        var monthlyUsersChartReady = new Chartist.Line('#monthUsersChart', monthlyUsersChart, monthlyUsersOptions);
        md.startAnimationForLineChart(monthlyUsersChartReady);
  

        var monthlyWinningsChart = {
            labels: (data.grouping.mwinnings.filled.map(e => e.date_month)).reverse(),
            series: [
                (data.grouping.mwinnings.filled.map(e => e.count)).reverse()
            ]
        };

        var monthlyWinningsOptions = {
            lineSmooth: Chartist.Interpolation.step({
                tension: 0
            }),
            low: 0,
            showPoint: false,
            showArea : true,
            high: data.grouping.mwinnings.max,
            chartPadding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        }

        var monthlyWinningsChartReady = new Chartist.Line('#monthWinningsChart', monthlyWinningsChart, monthlyWinningsOptions);
        md.startAnimationForLineChart(monthlyWinningsChartReady);
    }
   
}