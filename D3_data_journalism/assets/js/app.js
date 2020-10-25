// @TODO: YOUR CODE HERE!
var svgH = 1100;
var svgW = 1100;

var margin={top:50,left:70,right:70,bottom:50};

var chartW=svgW-margin.left-margin.right;
var chartH=svgW-margin.top-margin.bottom;

var svg=d3.select('#scatter').append('svg')
    .attr('width',svgW)
    .attr('height',svgH)

var chart=svg.append('g')
    .attr('transform',`translate(${margin.left},${margin.top})`);

d3.csv('../assets/data/data.csv').then(function (d){
    // console.log(d['0']);

    // mapping out desired values
    var incomes=d.map(data=>data.income);
    var obesity=d.map(data=>data.obesity);
    // console.log(obesity);

    // casting the values to numerical 
    incomes.forEach(function(data){
        data=+data;
    })
    obesity.forEach(function (data){
        data = +data;
    })
    xscale=d3.scaleLinear()
        .domain(d3.extent(obesity))
        .range([0,chartW])
    yscale=d3.scaleLinear()
        .domain(d3.extent(incomes))
        .range([chartH,0])
    xaxis=d3.axisBottom(xscale);
    yaxis = d3.axisLeft(yscale);

    chart.append('g')
        .attr('transform',`translate(0,${chartH})`)
        .call(xaxis)
    chart.append('g')
        .call(yaxis)
    var circles=chart.selectAll('circle')
        .data(d)
        .enter()
        .append('circle')
        .attr('cx',function(d,i){
            return xscale(obesity[i]);
        })
        .attr('cy',function (d,i){
            return yscale(incomes[i]);
        })
        .attr('r','10')
        .classed('stateCircle',true)
    var text=chart.selectAll('text')
        .data(d)
        .enter()
        .append('text')
        .classed('aText',true)
        .attr("font-size", "10px")
        .attr('x',function(d,i){
            return xscale(obesity[i]);
        })
        .attr('y',function (d,i){
            return yscale(incomes[i]);
        })
        .text('h')

})

