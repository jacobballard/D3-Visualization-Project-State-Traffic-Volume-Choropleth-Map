var dataP = d3.json("convVSstate.json")
var mapP = d3.json("us-states.json")

Promise.all([dataP, mapP]).then(function(values){
  var data = values[0] //convVSstate

  var mapData = values[1] //us-states
  // console.log("test", data, mapData)
  // console.log("load",data[1].features[0].properties)
  data = matchData(mapData, data);
  // console.log("calc", calc(data));
  drawMap(mapData, data);

});

var calc = function(d){
  yes = []
  // console.log("here")
  for(var key in d) {
    var value = d[key];
    users = value[1]
    yes.push((users / 9908) * 100)

  // do something with "key" and "value" variables

}
// console.log(yes)
}



var matchData = function(mapData, data){
  // console.log("mapData",mapData.features)
  allUsersConv = []
    // console.log("data", data[1].features[5].properties.name)
  mapData.features.forEach(function(d, i){
    // console.log(d)
      // console.log(mapData[1].features)
      var count = 0;
    data.forEach(function(j, k){
      if (d.properties.name == j.Region && (j.Segment=="All Users" || j.Segment=="Mobile Traffic" || j.Segment=="Tablet and Desktop Traffic")){
        if (allUsersConv[d.properties.name] === undefined){
          allUsersConv[d.properties.name] = []
          allUsersConv[d.properties.name] = [j.Segment+", "+j.Users+", "+j.Revenue+", "+j["Ecommerce Conversion Rate"]]
          // console.log("created");
        }else{
        allUsersConv[d.properties.name] = [allUsersConv[d.properties.name]] + [", "+j.Segment+", "+j.Users+", "+j.Revenue+", "+j["Ecommerce Conversion Rate"]]
        count++;

      }
      if (count == 2){
        allUsersConv[d.properties.name] = allUsersConv[d.properties.name].split(", ");
      }

      }
      })

      // console.log("parsing", allUsersConv[d.properties.name], d.properties.name)


      // console.log(allUsersConv[d.properties.name])
      // console.log("Length:", allUsersConv.keys)
 //      var count = 0;
 //      for (var i in allUsersConv) {
 //         if (allUsersConv.hasOwnProperty(i)) count++;
 //      }
 //      console.log("Length:", count)
 //    }
 //  )
 // console.log("AL", allUsersConv["Alaska"])
})
return allUsersConv;
}


var color = function(name, data){

  var value = data[name]
  // console.log("name", name)
  if (name == 'South Dakota'){
    // console.log("SD"
    return "white";}
  else{

    var totalUsersInState = value[1]
    var percent = (totalUsersInState / 9908) * 100
    // console.log("%", percent)
    if (percent <= 2) {
      // console.log("<2")
      return d3.rgb("#75bb74");
    }
    if (percent > 2 && percent <= 10) {return d3.rgb("#4f7d4d");}
    else{return d3.rgb("#294128");}
  }}








var drawMap = function(map, data){

var width = 1000;
var height = 600;

var svg = d3.select("svg")
			.attr("width", width)
			.attr("height", height);

      var projection = d3.geoAlbersUsa()
                      .translate([width/2, height/2])
                      .scale(1200);
      var path = d3.geoPath().projection(projection);



// var map = svg.append("g");

var states = svg.append("g")
            .selectAll("path")
            .data(map.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "green")
            .attr("fill", function(d){
              return color(d.properties.name, data)
            })
            // .attr("fill",function(d){
            //
            //   return color(d)
            // })
            .on("mouseover",function(d){
              // console.log("WOW", d)
              d3.select(this).attr("fill","darkgrey")
                .attr("stroke-width",3)
              var mouse = d3.mouse(this)
              var mouseX = mouse[0]
              var mouseY = mouse[1]
              svg.append('g').append('rect')
                 .attr("id","tooltip")
                 .attr("x",mouseX)
                 .attr("y",mouseY)
                 .attr("width",150)
                 .attr("height",200)
                 .style("fill","#EDF0EC")
              svg.append('g').append('text')
                 .attr("id","tooltipT0")
                 .attr("x",mouseX+5)
                 .attr("y",mouseY+20)
                 .text(data[d.properties.name][0])
                 .attr("font-size","15px")
             svg.append('g').append('text')
                .attr("id","tooltipT1")
                .attr("x",mouseX+5)
                .attr("y",mouseY+35)
                .text(data[d.properties.name][1])
                .attr("font-size","15px")
            })

            .on("mouseout",function(d){
              d3.select(this).attr("fill",function(d){
                return color(d.properties.name, data)
              })
                .attr("stroke-width", 1)
              d3.select("#tooltip").remove()
              d3.select("#tooltipT").remove()
            })

var mouseEvent = function(event){
  if (event = 0){
    var state = d3.select(this)
                .attr("fill", "orange")
  }
  else{

  }


}


var stateDict = {}
}
