

// d3.select("svg")
//     .append("circle")
//     .attr("r", 20)
//     .attr("cx", 20)
//     .attr("cy", 20)
//     .attr("id", "c1")
//     .style("fill", "red");
// d3.select("svg")
//     .append("text")
//     .attr("id", "a")
//     .attr("x", 20)
//     .attr("y", 20)
//     .style("opacity", 0)
//     .text("HELLO WORLD");
// d3.select("svg")
//     .append("circle")
//     .attr("r", 100)
//     .attr("cx", 400)
//     .attr("cy", 400)
//     .attr("id", "c2")
//     .style("fill", "lightblue");
// d3.select("svg")
//     .append("text")
//     .attr("id", "b")
//     .attr("x", 400)
//     .attr("y", 400)
//     .style("opacity", 0)
//     .text("Uh, hi.");


var svg = d3.select("svg");


// d3.csv("data/cities.csv", function (error, data) { dataViz(data) });

function dataViz(inData) {

    var maxPopulation = d3.max(inData, function (el) {
        return parseInt(el.population);
    });

    var yScale = d3.scale.linear().domain([0, maxPopulation]).range([0, 460]);
    svg.attr("style", "height: 480px; width: 600px;");
    svg.selectAll("rect").data(inData)
        .enter()
        .append("rect")
        .attr("width", 50)
        .attr("height", function (d) { return yScale(parseInt(d.population)); })
        .attr("x", function (d, i) { return i * 60; })
        .attr("y", function (d) { return 480 - yScale(parseInt(d.population)); })
        .style("fill", "blue")
        .style("stroke", "red")
        .style("stroke-width", "1px")
        .style("opacity", .25);

}



d3.json("data/tweets.json", function (data) { dataViz_Tweets_Details(data.tweets) });

function dataViz_Tweets(inData) {

    var aa = "Evoque";
    var nestedTweets = d3.nest().key(function (el) {
        console.log("category --> ");
        return el.user;
    }).entries(inData);

    nestedTweets.forEach(function (el) {
        console.log("add property -- > ");
        el.numTweets = el.values.length;
    })

    var maxTweets = d3.max(nestedTweets, function (el) {
        console.log("get max number --> ");
        return el.numTweets;
    });

    console.log("顺序执行 -------! ");
    var yScale = d3.scaleLinear().domain([0, maxTweets]).range([0, 400]);

    svg.selectAll("rect")
        .data(nestedTweets)
        .enter()
        .append("rect")
        .attr("width", 50)
        .attr("height", function (d) { return yScale(d.numTweets); })
        .attr("x", function (d, i) { return i * 60; })
        .attr("y", function (d) { return 450 - yScale(d.numTweets); })
        .style("fill", "blue")
        .style("stroke", "red")
        .style("stroke-width", "1px").style("opacity", .25);
}


function dataViz_Tweets_Details(inData) {

    inData.forEach(function (el) {
        el.impact = el.favorites.length + el.retweets.length;
        el.tweetTime = new Date(el.timestamp);
    })

    var maxImpact = d3.max(inData, function (el) { return el.impact; });
    var startEnd = d3.extent(inData, function (el) { return el.tweetTime; });

    var timeRamp = d3.time.scale().domain(startEnd).range([20, 480]);

    var yScale = d3.scale.linear().domain([0, maxImpact]).range([0, 460]);
    var radiusScale = d3.scale.linear().domain([0, maxImpact]).range([1, 20]);
    var colorScale = d3.scale.linear().domain([0, maxImpact]).range(["white", "#990000"]);

    // svg.selectAll("circle")
    //     .data(inData)
    //     .enter()
    //     .append("circle")
    //     .attr("r", function (d) { return radiusScale(d.impact); })
    //     .attr("cx", function (d, i) { return timeRamp(d.tweetTime); })
    //     .attr("cy", function (d) { return 480 - yScale(d.impact); })
    //     .style("fill", function (d) { return colorScale(d.impact) })
    //     .style("stroke", "black")
    //     .style("stroke-width", "1px");

    var tweetG = svg.selectAll("g").data(inData)
        .enter()
        .append("g") 
        .attr("transform", function (d) {
            return "translate(" + timeRamp(d.tweetTime) + "," + (480 - yScale(d.impact)) + ")";
        });

    tweetG.append("circle").attr("r", function (d) { return radiusScale(d.impact); })
        .style("fill", "#990000")
        .style("stroke", "black")
        .style("stroke-width", "1px");

    tweetG.append("text").text(function (d) {
        return d.user + "-" + d.tweetTime.getHours();
    });
}

