
function createSoccerViz() {
    d3.csv("data/worldcup.csv", function (data) {
        overallTeamViz(data);
    })

    function overallTeamViz(inData) {

        d3.select("svg").append("g").attr("id", "teamsG")
            .attr("transform", "translate(50, 300)")
            .selectAll("g").data(inData)
            .enter()
            .append("g")
            .attr("class", "overallG")
            .attr("transform", function (d, i) { return "translate(" + (i * 60) + ", 0)" });

        var teamG = d3.selectAll("g.overallG");

        teamG.append("circle")
            .attr("r", 0)
            .transition()
            .delay(function (d, i) { return i * 100 })
            .duration(500)
            .attr("r", 40)
            .transition()
            .duration(500)
            .attr("r", 20);

        teamG.append("text")
            .style("text-anchor", "middle")
            .attr("y", 30)
            .style("font-size", "10px")
            .text(function (d) { return d.team; });

        teamG.on("mouseover", highlightRegion2);

        // style --> pointer-events:none  cancel element events.
        teamG.select("text").style("pointer-events", "none");

        // insert(type, before);
        // 通过svg设置的图片会不会失真？
        // d3.selectAll("g.overallG").insert("image", "text")
        //     .attr("xlink:href", function (d) {
        //         return "images/" + d.team + ".png";
        //     }).attr("width", "45px").attr("height", "20px").attr("x", "-22").attr("y", "-10");

        function highlightRegion(d) {
            d3.selectAll("g.overallG").select("circle")
                .style("fill", function (p) {
                    return p.region == d.region ? "red" : " gray";
                });
        };


        function highlightRegion2(d, i) {
            // d3.select(this.nextSibling).classed("active", true).attr("y", 10);

            var teamColor = d3.rgb("pink");

            d3.select(this).select("text").classed("highlight", true).attr("y", 10);

            d3.selectAll("g.overallG").select("circle")
                .style("fill", function (p) {
                    return p.region == d.region ?
                        teamColor.darker(.75) : teamColor.brighter(.5)
                })
            this.parentElement.appendChild(this);
        };


        teamG.on("mouseout", unHighlight);

        function unHighlight() {
            console.log("Out...");
            d3.selectAll("g.overallG").select("circle").attr("class", "");
            d3.selectAll("g.overallG").select("text").classed("highlight", false).attr("y", 30);
        }




        var dataKeys = d3.keys(inData[0]).filter(function (el) {
            return el != "team" && el != "region";
        });

        d3.select("#controls").selectAll("button.teams")
            .data(dataKeys).enter()
            .append("button")
            .on("click", buttonClick)
            .html(function (d) { return d; });

        // 这里的每次点击，按钮都会把html值传进来？
        // with the bound data sent automatically as the first argument
        function buttonClick(e) {
            console.log('按钮 --> ' + e);
            var maxValue = d3.max(inData, function (d) {
                return parseFloat(d[e]);
            });

            var radiusScale = d3.scale.linear().domain([0, maxValue]).range([2, 20]);

            // var ybRamp = d3.scale.linear().domain([0, maxValue]).range(["yellow", "blue"]);
            var ybRamp = d3.scale.linear().interpolate(d3.interpolateHsl).domain([0, maxValue]).range(["yellow", "blue"]);
            var tenColorScale = d3.scale.category10(["UEFA", "CONMEBOL", "CAF", "AFC"]);

            d3.selectAll("g.overallG").select("circle").transition().duration(1000)
                .attr("r", function (d) { return radiusScale(d[e]); })
                .style("fill", function (d) { return tenColorScale(d.region); });


        };

        function buttonClick(datapoint) {
            var maxValue = d3.max(inData, function (el) {
                return parseFloat(el[datapoint]);
            });

            var colorQuantize = d3.scale.quantize().domain([0, maxValue]).range(colorbrewer.Reds[5]);
            var radiusScale = d3.scale.linear().domain([0, maxValue]).range([2, 20]);

            d3.selectAll("g.overallG").select("circle").transition().duration(1000)
                .style("fill", function (p) {
                    return colorQuantize(p[datapoint]);
                })
                .attr("r", function (p) {
                    return radiusScale(p[datapoint]);
                });
        };


        d3.text("modal.html", function (data) {
            d3.select("body").append("div").attr("id", "modal").html(data);
        });

        d3.html("modal.html", function (data) {
            var a = "Evoque";
        })

        teamG.on("click", teamClick);

        function teamClick(d) {
        
            var vals = d3.values(d); 

            d3.selectAll("td.data").data(vals).html(function(p){
                return p;
            });
        };


        d3.html("icon.svg", loadSVG);

        function loadSVG(svgData) {

            // d3.select(svgData).selectAll("path").each(function () { 
            //     d3.select("svg").node().appendChild(this); 
            // });

            // d3.selectAll("path").attr("transform", "translate(100, 100)");

            d3.selectAll("g.overallG").each(function () {
                var gParent = this;
                d3.select(svgData).selectAll("path").each(function () {
                    gParent.appendChild(this.cloneNode(true))
                });
            });

            // d3.selectAll("path").style("fill", "blue")
            //     .style("stroke", "black").style("stroke-width", "1px");


            d3.selectAll("g.overallG").each(function (d) {
                d3.select(this).selectAll("path").datum(d);
            });


            var a = d3.select("g.overallG").select("path").datum();
            var b = d3.select("g.overallG").select("path").data();
            var tenColorScale = d3.scale.category10(["UEFA", "CONMEBOL", "CAF", "AFC"]);

            d3.selectAll("path").style("fill", function (p) {
                console.log(" .... ");
                console.dir(p);
                return tenColorScale(p.region)
            }).style("stroke", "black").style("stroke-width", "2px");

        };



    }
}