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

  drawRevPer(0, data);
  drawRevMobile(0, data);
  drawRevDesk(0, data);

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

var clicked = function(state, data) {
  // console.log("state", state)
  drawRevPer(state, data);
  drawRevMobile(state, data);
  drawRevDesk(state, data);

}

var dataToRevPer = function(d){
  dist = []
  for(var key in d) {
    var value = d[key];
    var revenue = value[2]
    revenue = revenue.replace("$", "")
    revenue = revenue.replace(",", "")
    var users = value[1]
    users = users.replace(",", "")
    // console.log("rev:", revenue, "users:", users)
    var revPer = revenue / users;
    dist.push(revPer)
}
// console.log(dist)
return dist;}

var checkColorTot = function(d, state, data){
  // console.log("d", d, "state", state, "data", data)
  if (state != 0){
    var name = state.properties.name;
    var value = data[name];
    var rev = value[2];
    rev = rev.replace("$", "")
    rev = rev.replace(",", "")
    var user = value[1];
    user = user.replace(",", "")
    revPer = rev / user;
    // console.log("d[0]", d, "revPer", revPer)
    // console.log("RevPERERE", d.includes(revPer))
    if (d.includes(revPer)){
      return "green";
    }
    else{return "blue"}



  }else{return "blue"}



}

var drawRevPer = function(state, data){
    // console.log("state", state)
    revPer = dataToRevPer(data);
    var svgwidth = 500;
    var svgheight = 350;
    var svg = d3.select('body').select('div').select('svg').attr('width',svgwidth).attr('height',svgheight);
    var margins =
    {
      top:20,
      bottom:60,
      left:75,
      right:50
    }
    var width = svgwidth -margins.left - margins.right;
    var height = svgheight -margins.top - margins.bottom;
    var barWidth=width/10-1;
    var yScale = d3.scaleLinear()
                   .domain([0,50])
                   .range([height,0]);

    var xScale = d3.scaleLinear()
                   .domain(d3.extent(revPer))
                   .nice()
                   .range([0,width]);

    var binMaker = d3.histogram()
                     .domain(xScale.domain())
                     .thresholds(xScale.ticks(10));

    var bins = binMaker(revPer);
    // console.log(bins);

    var percentage = function(d){
      return d.length/revPer.length;
    }

    var yScale = d3.scaleLinear()
                   .domain([0,d3.max(bins,function(d){
                     // console.log("d", percentage(d))
                     return percentage(d);})])
                   .range([height,0])
                   .nice();

    var plot = svg.append('g').classed('plot',true)
            .attr('transform','translate('+margins.left+","+margins.top+")");



    var yAxis = d3.axisLeft(yScale);
    svg.append('g').classed('yScale',true)
       .call(yAxis)
       .attr('transform','translate('+(margins.left)+","+margins.top+')');

    function make_y_gridlines() {
           return d3.axisLeft(yScale)
               .ticks(5)
    }

    var yAxislines = plot.append('g').classed('grid',true)
          .call(make_y_gridlines().tickSize(-width-50).tickFormat(""))
          .attr("transform", "translate("+(0)+","+(0)+")");


    plot.selectAll("rect")
              .data(bins)
              .enter()
              .append("rect")
              .attr("x", function(d){
                return xScale(d.x0)+3;})
              .attr("width", barWidth)
              .attr("y", function(d){return yScale(percentage(d));})
              .attr("height", function(d){return height - yScale(percentage(d));})
              .attr("fill", function(d){
                // console.log("big d", d)
                return checkColorTot(d, state, data);
              })

    var xAxis = d3.axisBottom(xScale);
          svg.append("g").classed("xAxis", true)
          .call(xAxis)
          .attr("transform", "translate("+(margins.left+barWidth/2)+","+(margins.top+height+15)+")");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + 30 +","+((height/2) + 25) +")rotate(-90)")
        .classed("graphLabels", true)
        .text("Percent of States");

    svg.append("text")
        .attr("text-anchor", "middle")  // found on bl.ocks.org
        .attr("transform", "translate("+ ((width/2)+ 110) +","+(height+75)+")")
        .classed("graphLabels", true)
        .text("Revenue/User (All)");
}




var color = function(name, data){

  var value = data[name]
  // console.log("name", name)
  if (name == 'South Dakota'){
    // console.log("SD"
    return "grey";}
  else{

    var totalUsersInState = value[1]
    var percent = (totalUsersInState / 9908) * 100
    // console.log("%", percent)
    if (percent <= 2) {
      // console.log("<2")
      return d3.rgb("#AACCA1");
    }
    if (percent > 2 && percent <= 10) {return d3.rgb("#4f7d4d");}
    else{return d3.rgb("#294128");}
  }}





var drawMap = function(map, data){

var width = 1300;
var height = 800;

var svg = d3.select("svg")
			.attr("width", width)
			.attr("height", height);

      var projection = d3.geoAlbersUsa()
                      .translate([width/2.2, height/2.2])
                      .scale(1200);
      var path = d3.geoPath().projection(projection);



// var map = svg.append("g");

var states = svg.append("g")
            .selectAll("path")
            .data(map.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "grey")
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
                 .attr("width",340)
                 .attr("height",125)
                 .style("fill","#EDF0EC")
             svg.append('g').append('text')
                .attr("id","tooltipT01")
                .attr("x",mouseX+137.5 - 2 * (d.properties.name.length/2))
                .attr("y",mouseY+25)
                .text(d.properties.name)
                .attr("font-size","20px")
              svg.append('g').append('text')
                 .attr("id","tooltipT0")
                 .attr("x",mouseX+5)
                 .attr("y",mouseY+50)
                 .text("Segment")
                 .attr("font-size","15px")
             svg.append('g').append('text')
                .attr("id","tooltipT1")
                .attr("x",mouseX+65)
                .attr("y",mouseY+50)
                .text("Users")
                .attr("font-size","15px")
            svg.append('g').append('text')
                .attr("id","tooltipT2")
                .attr("x",mouseX+105)
                .attr("y",mouseY+50)
                .text("Revenue")
                .attr("font-size","15px")
            svg.append('g').append('text')
                .attr("id","tooltipT3")
                .attr("x",mouseX+165)
                .attr("y",mouseY+50)
                .text("Conversions")
                .attr("font-size","15px")
            svg.append('g').append('text')
                .attr("id","tooltipT20")
                .attr("x",mouseX+250)
                .attr("y",mouseY+50)
                .text("Revenue/User")
                .attr("font-size","15px")
            svg.append('g').append('text')
                .attr("id","tooltipT4")
                .attr("x",mouseX+5)
                .attr("y",mouseY+70)
                .text(data[d.properties.name][0])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT5")
                .attr("x",mouseX+65)
                .attr("y",mouseY+70)
                .text(data[d.properties.name][1])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT6")
                .attr("x",mouseX+105)
                .attr("y",mouseY+70)
                .text(data[d.properties.name][2])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT7")
                .attr("x",mouseX+165)
                .attr("y",mouseY+70)
                .text(data[d.properties.name][3])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT21")
                .attr("x",mouseX+250)
                .attr("y",mouseY+70)
                .text(function(k){
                  use = data[d.properties.name][1]
                  rev = data[d.properties.name][2] //2/1
                  rev = rev.replace("$", "")
                  rev = rev.replace(",", "")
                  use = use.replace(",", "")
                  rat = rev/use;
                  num = rat.toString();
                  num = num.substring(0, 4)
                  return ("$" + num);
                })
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT8")
                .attr("x",mouseX+5)
                .attr("y",mouseY+90)
                .text("Mobile")
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT9")
                .attr("x",mouseX+65)
                .attr("y",mouseY+90)
                .text(data[d.properties.name][5])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT10")
                .attr("x",mouseX+105)
                .attr("y",mouseY+90)
                .text(data[d.properties.name][6])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT11")
                .attr("x",mouseX+165)
                .attr("y",mouseY+90)
                .text(data[d.properties.name][7])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT22")
                .attr("x",mouseX+250)
                .attr("y",mouseY+90)
                .text(function(k){
                  use = data[d.properties.name][5]
                  rev = data[d.properties.name][6] //2/1
                  rev = rev.replace("$", "")
                  rev = rev.replace(",", "")
                  use = use.replace(",", "")
                  rat = rev/use;
                  num = rat.toString();
                  num = num.substring(0, 4)
                  return ("$" + num);
                })
                    .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT12")
                .attr("x",mouseX+5)
                .attr("y",mouseY+105)
                .text("Desktop")
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT13")
                .attr("x",mouseX+5)
                .attr("y",mouseY+115)
                .text("& Tablet")
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT14")
                .attr("x",mouseX+65)
                .attr("y",mouseY+110)
                .text(data[d.properties.name][9])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT15")
                .attr("x",mouseX+105)
                .attr("y",mouseY+110)
                .text(data[d.properties.name][10])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT16")
                .attr("x",mouseX+165)
                .attr("y",mouseY+110)
                .text(data[d.properties.name][11])
                .attr("font-size","12px")
            svg.append('g').append('text')
                .attr("id","tooltipT23")
                .attr("x",mouseX+250)
                .attr("y",mouseY+110)
                .text(function(k){
                  use = data[d.properties.name][9]
                  rev = data[d.properties.name][10] //2/1
                  rev = rev.replace("$", "")
                  rev = rev.replace(",", "")
                  use = use.replace(",", "")
                  rat = rev/use;
                  num = rat.toString();
                  num = num.substring(0, 4)
                  return ("$" + num);
                })
                    .attr("font-size","12px")
            })

            .on("mouseout",function(d){
              d3.select(this).attr("fill",function(d){
                return color(d.properties.name, data)
              })
                .attr("stroke-width", 1)
              d3.select("#tooltip").remove()
              d3.select("#tooltipT0").remove()
              d3.select("#tooltipT1").remove()
              d3.select("#tooltipT2").remove()
              d3.select("#tooltipT3").remove()
              d3.select("#tooltipT4").remove()
              d3.select("#tooltipT5").remove()
              d3.select("#tooltipT6").remove()
              d3.select("#tooltipT7").remove()
              d3.select("#tooltipT8").remove()
              d3.select("#tooltipT9").remove()
              d3.select("#tooltipT10").remove()
              d3.select("#tooltipT11").remove()
              d3.select("#tooltipT12").remove()
              d3.select("#tooltipT13").remove()
              d3.select("#tooltipT14").remove()
              d3.select("#tooltipT15").remove()
              d3.select("#tooltipT16").remove()
              d3.select("#tooltipT01").remove()
              d3.select("#tooltipT20").remove()
              d3.select("#tooltipT21").remove()
              d3.select("#tooltipT22").remove()
              d3.select("#tooltipT23").remove()
            })
          .on("click", function(d){return clicked(d, data);})

  var legendText=["Users = 0%", "Users <= 2%", "2% < Users <= 10%", "Users > 10%"]
  var legendColor=["grey", "#AACCA1", "#4f7d4d", "#294128"]
  var legend=svg.append("g")
                .classed("legend",true)
                .attr("transform","translate("+40+")");
  var legendPoints=legend.selectAll("rect")
                         .data(legendColor)
                         .enter()
                         .append("rect")
                         .attr("x",-5)
                         .attr("y",function(d,i){return 30*i + i;})
                         .attr("width",30)
                         .attr("height",30)
                         .attr("fill",function(d){return d})
  var legengtext=legend.selectAll("text")
                         .data(legendText)
                         .enter()
                         .append("text")
                         .attr("x",27)
                         .attr("y",function(d,i){return 25+30*i;})
                         .text(function(d){return d})

    }


    var drawRevMobile = function(state, data){
        // console.log("state", state)
        revPer = dataToRevMob(data);
        var svgwidth = 500;
        var svgheight = 350;
        var svg = d3.select('body').select('.mob').select('svg').attr('width',svgwidth).attr('height',svgheight);
        var margins =
        {
          top:20,
          bottom:60,
          left:75,
          right:50
        }
        var width = svgwidth -margins.left - margins.right;
        var height = svgheight -margins.top - margins.bottom;
        var barWidth=width/10-1;
        var yScale = d3.scaleLinear()
                       .domain([0,50])
                       .range([height,0]);

        var xScale = d3.scaleLinear()
                       .domain(d3.extent(revPer))
                       .nice()
                       .range([0,width]);

        var binMaker = d3.histogram()
                         .domain(xScale.domain())
                         .thresholds(xScale.ticks(10));

        var bins = binMaker(revPer);
        // console.log(bins);

        var percentage = function(d){
          return d.length/revPer.length;
        }

        var yScale = d3.scaleLinear()
                       .domain([0,d3.max(bins,function(d){
                         // console.log("d", percentage(d))
                         return percentage(d);})])
                       .range([height,0])
                       .nice();

        var plot = svg.append('g').classed('plot',true)
                .attr('transform','translate('+margins.left+","+margins.top+")");



        var yAxis = d3.axisLeft(yScale);
        svg.append('g').classed('yScale',true)
           .call(yAxis)
           .attr('transform','translate('+(margins.left)+","+margins.top+')');

        function make_y_gridlines() {
               return d3.axisLeft(yScale)
                   .ticks(5)
        }

        var yAxislines = plot.append('g').classed('grid',true)
              .call(make_y_gridlines().tickSize(-width-50).tickFormat(""))
              .attr("transform", "translate("+(0)+","+(0)+")");


        plot.selectAll("rect")
                  .data(bins)
                  .enter()
                  .append("rect")
                  .attr("x", function(d){
                    return xScale(d.x0)+3;})
                  .attr("width", barWidth)
                  .attr("y", function(d){return yScale(percentage(d));})
                  .attr("height", function(d){return height - yScale(percentage(d));})
                  .attr("fill", function(d){
                    // console.log("big d", d)
                    return checkColorMob(d, state, data);
                  })

        var xAxis = d3.axisBottom(xScale);
              svg.append("g").classed("xAxis", true)
              .call(xAxis)
              .attr("transform", "translate("+(margins.left+barWidth/2)+","+(margins.top+height+15)+")");

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + 30 +","+((height/2) + 25) +")rotate(-90)")
            .classed("graphLabels", true)
            .text("Percent of States");

        svg.append("text")
            .attr("text-anchor", "middle")  // found on bl.ocks.org
            .attr("transform", "translate("+ ((width/2)+ 110) +","+(height+75)+")")
            .classed("graphLabels", true)
            .text("Revenue/User (Mobile)");
    }

    var dataToRevMob = function(d){
      dist = []
      for(var key in d) {
        var value = d[key];
        var revenue = value[6]
        revenue = revenue.replace("$", "")
        revenue = revenue.replace(",", "")
        var users = value[5]
        users = users.replace(",", "")
        // console.log("rev:", revenue, "users:", users)
        var revPer = revenue / users;
        dist.push(revPer)
    }
    // console.log(dist)
    return dist;}

    var checkColorMob = function(d, state, data){
      // console.log("d", d, "state", state, "data", data)
      if (state != 0){
        var name = state.properties.name;
        var value = data[name];
        var rev = value[6];
        rev = rev.replace("$", "")
        rev = rev.replace(",", "")
        var user = value[5];
        user = user.replace(",", "")
        revPer = rev / user;
        // console.log("d[0]", d, "revPer", revPer)
        // console.log("RevPERERE", d.includes(revPer))
        if (d.includes(revPer)){
          return "green";
        }
        else{return "blue"}



      }else{return "blue"}



    }

    var drawRevDesk = function(state, data){
        // console.log("state", state)
        revPer = dataToRevDesk(data);
        var svgwidth = 500;
        var svgheight = 350;
        var svg = d3.select('body').select('.desk').select('svg').attr('width',svgwidth).attr('height',svgheight);
        var margins =
        {
          top:20,
          bottom:60,
          left:75,
          right:50
        }
        var width = svgwidth -margins.left - margins.right;
        var height = svgheight -margins.top - margins.bottom;
        var barWidth=width/10-1;
        var yScale = d3.scaleLinear()
                       .domain([0,50])
                       .range([height,0]);

        var xScale = d3.scaleLinear()
                       .domain(d3.extent(revPer))
                       .nice()
                       .range([0,width]);

        var binMaker = d3.histogram()
                         .domain(xScale.domain())
                         .thresholds(xScale.ticks(10));

        var bins = binMaker(revPer);
        // console.log(bins);

        var percentage = function(d){
          return d.length/revPer.length;
        }

        var yScale = d3.scaleLinear()
                       .domain([0,d3.max(bins,function(d){
                         // console.log("d", percentage(d))
                         return percentage(d);})])
                       .range([height,0])
                       .nice();

        var plot = svg.append('g').classed('plot',true)
                .attr('transform','translate('+margins.left+","+margins.top+")");



        var yAxis = d3.axisLeft(yScale);
        svg.append('g').classed('yScale',true)
           .call(yAxis)
           .attr('transform','translate('+(margins.left)+","+margins.top+')');

        function make_y_gridlines() {
               return d3.axisLeft(yScale)
                   .ticks(5)
        }

        var yAxislines = plot.append('g').classed('grid',true)
              .call(make_y_gridlines().tickSize(-width-50).tickFormat(""))
              .attr("transform", "translate("+(0)+","+(0)+")");


        plot.selectAll("rect")
                  .data(bins)
                  .enter()
                  .append("rect")
                  .attr("x", function(d){
                    return xScale(d.x0)+3;})
                  .attr("width", barWidth)
                  .attr("y", function(d){return yScale(percentage(d));})
                  .attr("height", function(d){return height - yScale(percentage(d));})
                  .attr("fill", function(d){
                    // console.log("big d", d)
                    return checkColorDesk(d, state, data);
                  })

        var xAxis = d3.axisBottom(xScale);
              svg.append("g").classed("xAxis", true)
              .call(xAxis)
              .attr("transform", "translate("+(margins.left+barWidth/2)+","+(margins.top+height+15)+")");

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + 30 +","+((height/2) + 25) +")rotate(-90)")
            .classed("graphLabels", true)
            .text("Percent of States");

        svg.append("text")
            .attr("text-anchor", "middle")  //found on bl.ocks.org
            .attr("transform", "translate("+ ((width/2)+ 110) +","+(height+75)+")")
            .classed("graphLabels", true)
            .text("Revenue/User (Tablet & Desktop)");
    }

    var dataToRevDesk = function(d){
      dist = []
      for(var key in d) {
        var value = d[key];
        var revenue = value[10]
        revenue = revenue.replace("$", "")
        revenue = revenue.replace(",", "")
        var users = value[9]
        users = users.replace(",", "")
        // console.log("rev:", revenue, "users:", users)
        var revPer = revenue / users;
        dist.push(revPer)
    }
    // console.log(dist)
    return dist;}

    var checkColorDesk = function(d, state, data){
      // console.log("d", d, "state", state, "data", data)
      if (state != 0){
        var name = state.properties.name;
        var value = data[name];
        var rev = value[10];
        rev = rev.replace("$", "")
        rev = rev.replace(",", "")
        var user = value[9];
        user = user.replace(",", "")
        revPer = rev / user;
        // console.log("d[0]", d, "revPer", revPer)
        // console.log("RevPERERE", d.includes(revPer))
        if (d.includes(revPer)){
          return "green";
        }
        else{return "blue"}



      }else{return "blue"}



    }
