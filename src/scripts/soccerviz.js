
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
            .attr("transform", function (d, i) { return "translate(" + (i * 50) + ", 0)" });

        var teamG = d3.selectAll("g.overallG");

        teamG.append("circle")
            .attr("r", 0)
            .transition()
            .delay(function(d, i){return i * 100})
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

        teamG.on("mouseover", highlightRegion);

        function highlightRegion(d) {
            d3.selectAll("g.overallG").select("circle")
                .style("fill", function (p) {
                    return p.region == d.region ? "red" : " gray";
                });
        };

        teamG.on("mouseout", function () { 
            d3.selectAll("g.overallG").select("circle").style("fill", "pink");
        });

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
            // 每次点击都需要遍历整个数据源， 显然是不行的!
            var maxValue = d3.max(inData, function (d) {
                return parseFloat(d[e]);
            });

            var radiusScale = d3.scale.linear().domain([0, maxValue]).range([2, 20]);

            d3.selectAll("g.overallG").select("circle").transition().duration(1000)
                .attr("r", function (d) {
                    return radiusScale(d[e]);
                });
        };

    }
}