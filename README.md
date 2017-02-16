#ChartJS Dynatrace Timeseries JSON

![alt text](http://arnaud.cr/dynatrace/davis/res/git1.png "Example screenshot")

This tool can be used to dynamically create a chart from Dynatrace timeseries data.
Using URL query parameters, many options can be changed.

##Requirements
- Chart JS http://www.chartjs.org/
- Web Server
- Dynatrace time series data: 
```javascript
{
  "result":{
    "dataPoints":{
      "APPLICATION-157F59F44773DD97":
      [
        [1486668600000,2.6333333333333333],[1486670400000,2.4],[1486672200000,2.466666666666667],[1486674000000,2.6666666666666665],[1486675800000,2.8],[1486677600000,4.466666666666667],[1486679400000,3.533333333333333],[1486681200000,3.0],[1486683000000,3.1333333333333333]
      ]
    },
      "timeseriesId": "com.dynatrace.builtin:app.useractionsperminute",
      "unit": "count/min",
      "entities": {
      "APPLICATION-157F59F44773DD97": "Dynatrace EasyTravel"
    },
    "resolutionInMillisUTC": 1800000,
    "aggregationType": "COUNT"
  }
}
```

##Query String
Example query string:
`http://localhost/chart/?width=800&height=500&res=4&color=red&anim=true&hex=f21&legend=true`

| Property | Parameter | Description | Default |
|:---:|:---:|:---:|:---:|
| Width | `width` | width of chart | `400` |
| Height | `height` | height of chart | `500` |
| Resolution | `res` | chart resolution | `2` (1hr) |
| Color | `color` | built-in colors | random |
| Hex | `hex` | use hex color | none |
| Legend | `legend` | (true/false) to toggle legend | `true` |
| Legend Position | `legendpos` | (left/right/bottom/top) legend position | `bottom` |
| Legend Label Width | `legendsize` | width of colored label in legend | `50` |
| Chart Type | `type` | type of chart being created | `line` |
| Animation | `anim` | (true/false) to toggle animation | `false` |


##Chart Resolutions
You can pass a number to the `res` query in order to scale the X axis.
- `1` will represent 30 minute increments 
- `2` will represent 1hr increments
- `3` will represent 1.5hr increments
- `4` will represent 2hr increments

##Colors
A random color will be selected on initialization of chart.
You can pass a color with the `color` query. Default colors include:
- Blue
- Green
- Lime
- Purple
- Red
- Gray

You can also use the `hex` query to pass in a hexadecimal color code (long or short hand). Example:
- `?hex=ff00ff`
- `?hex=f0f`

##Issues
Currently will not work if the timeseries JSON includes data from more than 1 application. Filter your JSON beforehand.
