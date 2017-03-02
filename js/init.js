var times = [];
var points = [];
var appid;
var application;
var height;
var width;
var chartType;
var res = 2; // '1' is half hour, '2' is hour etc
var anim = 0;
var chart = 'line';
var legendShow = true;
var legendPosition = 'bottom';
var legendBoxWidth = 50;
var color = 'rgba(75,192,192, 1)';
var colorTransparent = 'rgba(75,192,192, 0.5)';
var colors = {
  blue: 'rgba(20, 150, 255, 1)', 
  lime: 'rgba(180, 220, 0, 1)', 
  green: 'rgba(115, 190, 40, 1)', 
  purple: 'rgba(111, 45, 168, 1)', 
  red: 'rgb(168, 45, 45)', 
  gray: 'rgba(26, 26, 26, 1)',
};
var colorsTransparent = {
  blueTransparent: 'rgba(20, 150, 255, 0.5)', 
  limeTransparent: 'rgba(180, 220, 0, 0.5)', 
  greenTransparent: 'rgba(115, 190, 40, 0.5)', 
  purpleTransparent: 'rgba(111, 45, 168, 0.5)',
  redTransparent: 'rgba(168, 45, 45, 0.5)', 
  grayTransparent: 'rgba(26, 26, 26, 0.5)'
};















$(function() {//doc ready
  //get the URL query strings
  getParams();
  
  //pick a random color to start the chart off with
  var randomColor = pickRandomProperty(colors);
  var randomColorTransparent = randomColor + 'Transparent';
  color = colors[randomColor];
  colorTransparent = colorsTransparent[randomColorTransparent];
  
  //parse the JSON (right now this only supports 1 application)
  $.getJSON( "data/1app.json", function(data) {
    console.log(data)
    //get times and points in arrays
    $.each(data.result.dataPoints,function(key,val) {
      appid = key;
      $.each(val,function(key2,val2) {
        if (key2 % res == 0) {
          if (val2[0] != null) {
//            times.push(convertTime(val2[0]));
            times.push(val2[0]);
          }
          if (val2[1] != null) {
            points.push(val2[1].round(2));
          }
        }
      });
    });
    //get application name
    $.each(data.result.entities,function(key,val) {
      if (key == appid) {
        //remove appid from application name
        application = val.split(' - ')[0];
      }
    });
    //pass init vals to build the chart
    buildChart(application,times,points);
  });
});//end doc ready















//build the chart
function buildChart(app,times,points) {
  var ctx = document.getElementById("chart");
  var data = {
    labels: times,
    datasets: [{
      label: app,
      fill: true, 
      lineTension: 0.1,
      backgroundColor: colorTransparent,
      borderColor: color,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: color,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: points,
      spanGaps: false,
    }]
  };
  var myLineChart = new Chart(ctx, {
    type: chart,
    data:data,
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unitStepSize: 1,
            displayFormats: {
              'hour': 'h:mm'
            }
          }
        }]
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: anim
      },
      legend: {
        display: legendShow,
        position: legendPosition,
        labels: {
          boxWidth: legendBoxWidth,
          fontStyle: 'bold'
        }
      },
      tooltips: {
        callbacks: {
          title: function(tooltipItem, data) {
            return data.datasets[0].label +' '+convertTime(tooltipItem[0].xLabel)
          },
          label: function(tooltipItem, data) {
            return ' '+tooltipItem.yLabel
          }
        }
      }
    }
  });
}











//save url parameters to variables
function getParams() {
  //get height
  if ($.url().param('height')) {
    height = $.url().param('height');
    $('.chart_wrapper').css('height',height);
  }
  //get width
  if ($.url().param('width')) {
    width = $.url().param('width');
    $('.chart_wrapper').css('width',width);
  }
  //get chart resolution
  if ($.url().param('res')) {
    res = $.url().param('res');
  }
  //get color
  if ($.url().param('color')) {
    colorChoice = $.url().param('color');
    switch (colorChoice) {
      case "blue":
        color = colors.blue;
        colorTransparent = colorsTransparent.blueTransparent;
      break;
      case "lime":
        color = colors.lime;
        colorTransparent = colorsTransparent.limeTransparent;
      break;
      case "green":
        color = colors.green;
        colorTransparent = colorsTransparent.greenTransparent;
      break;
      case "purple":
        color = colors.purple;
        colorTransparent = colorsTransparent.purpleTransparent;
      break;
      case "red":
        color = colors.red;
        colorTransparent = colorsTransparent.redTransparent;
      break;
      case "gray":
        color = colors.gray;
        colorTransparent = colorsTransparent.grayTransparent;
      break;
    }
  }
  //get hex color
  if ($.url().param('hex')) {
    hex = $.url().param('hex');
    color = hex2rgb(hex,1);
    colorTransparent = hex2rgb(hex,0.5);
  }
  //get animation boolean
  if ($.url().param('anim')) {
    animChoice = $.url().param('anim');
    if (animChoice == 'false') anim = 0;
    if (animChoice == 'true') anim = 500;
  }
  //get chart type
  if ($.url().param('type')) {
    type = $.url().param('type');
    chart = type;
  }
  //get legend on/off
  if ($.url().param('legend')) {
    legendBoolean = $.url().param('legend');
    if (legendBoolean == "true") legendShow = true;
    if (legendBoolean == "false") legendShow = false;
  }
  //get legend position
  if ($.url().param('legendpos')) {
    position = $.url().param('legendpos');
    legendPosition = position;
  }
  //get legend box width
  if ($.url().param('legendsize')) {
    size = $.url().param('legendsize');
    legendBoxWidth = parseInt(size);
  }
}

//round those ridiculous decimals 
Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}

//convert the time stamp to human time
function convertTime(unixTimeStamp) {
  var date = new Date(unixTimeStamp);
  var formattedDate = date.format('h:i');
  return formattedDate;
}

//convert hexadecimal color to RBA color with opacity
function hex2rgb(hex, opacity) {
  var h=hex.replace('#', '');
  h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));
  for(var i=0; i<h.length; i++)
      h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);
  if (typeof opacity != 'undefined')  h.push(opacity);
  return 'rgba('+h.join(',')+')';
}

//return a random object property
function pickRandomProperty(obj) {
  var result;
  var count = 0;
  for (var prop in obj)
  if (Math.random() < 1/++count)
    result = prop;
  return result;
}