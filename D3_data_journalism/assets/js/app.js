// @TODO: YOUR CODE HERE!
var svgH = 900;
var svgW = 850;

var margin={top:50,left:70,right:50,bottom:30};

var chartW=svgW-margin.left-margin.right;
var chartH=svgW-margin.top-margin.bottom;

var svg=d3.select('#scatter').append('svg')
    .attr('width',svgW)
    .attr('height',svgH)

var chart=svg.append('g')
    .attr('transform',`translate(${margin.left},${margin.top})`)

d3.csv('../assets/data/data.csv').then(function (d){
    console.log(d);

    // mapping out desired values
    var incomes=d.map(data=>data.income);
    var obesity=d.map(data=>data.obesity);

    // casting the values to numerical 
    incomes.forEach(function(d,i){
        incomes[i]=parseInt(d);
    })
    obesity.forEach(function (d,i){
        obesity[i]=parseFloat(d);
    })
    console.log(incomes);
    yscale=d3.scaleLinear()
        .domain(d3.extent(obesity))
        .range([chartH,0])
    xscale=d3.scaleLinear()
        .domain(d3.extent(incomes))
        .range([0,chartW])
    xaxis=d3.axisBottom(xscale);
    yaxisL = d3.axisLeft(yscale);
    yaxisR=d3.axisRight(yscale);

    chart.append('g')
        .attr('transform',`translate(0,${chartH})`)
        .call(xaxis)
    chart.append('g')
        .call(yaxisL)
    chart.append('g')
        .attr('transform',`translate(${chartW},0)`)
        .call(yaxisR)
    var circles=chart.selectAll('circle')
        .data(d)
        .enter()
        .append('circle')
        .attr('cx',function(d,i){
            return xscale(incomes[i]);
        })
        .attr('cy',function (d,i){
            return yscale(obesity[i]);
        })
        .attr('r','15')
        .classed('stateCircle',true)
    var text=chart.selectAll('text')
        .data(d)
        .enter()
        .append('text')
        .classed('stateText',true)
        .attr('x',function(d,i){
            return xscale(incomes[i]);
        })
        .attr('y',function (d,i){
            return yscale(obesity[i])+1.5;
        })
        .text(function (d, i){
            return `${d.abbr}`;
        })
    var x_label=chart.append("text")
    .attr("transform", `translate(${chartW / 2}, ${chartH + margin.top})`)
    .attr('text-anchor', 'middle')
    .attr('font-size',20)
    .text("Median Income")

    var y_label=chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0-margin.top-5)
    .attr("x", 0-margin.left-(chartW/2))
    .attr('font-size',20)
    .attr('text-anchor', 'middle')
    .text("Obesity");

})

