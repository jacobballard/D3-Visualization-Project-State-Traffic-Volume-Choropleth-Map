var dataP = d3.csv("convVSstate.csv")
var mapP = d3.json("https://d3js.org/us-10m.v1.json")

Promise.all([customerTypeP, customerBounceP, customerDeviceDailyP, customerDeviceMonthlyP]).then(function(values){
  var data = values
  var map = values
  drawMap(map, data);
})

var drawMap = function(map, data){
var svg = d3.select("svg");

var path = d3.geoPath();



  svg.append("g")
      .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path);

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
});
}
