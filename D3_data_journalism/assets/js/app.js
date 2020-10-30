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
    var poverty=d.map(data=>data.poverty);
    var smokes=d.map(data=>data.smokes);

    // casting the values to numerical 
    incomes.forEach(function(d,i){
        incomes[i]=parseInt(d);
    })
    poverty.forEach(function(d,i){
        poverty[i]=parseFloat(d);
    })
    obesity.forEach(function (d,i){
        obesity[i]=parseFloat(d);
    })
    smokes.forEach(function (d,i){
        smokes[i]=parseFloat(d);
    })
    console.log(incomes);
    // functions for rendering new axes and circles based on selection.
    function xscaler(choice){
        xscale=d3.scaleLinear()
       if (choice=='Poverty(%)'){
        xscale.domain(d3.extent(poverty)).range([0,chartW])
       }
       else {
        xscale.domain(d3.extent(incomes)).range([0,chartW])
       }
       return xscale;
    }

    function yscaler(choice){
        yscale=d3.scaleLinear()
       if (choice=='Smokes(%)'){
        yscale.domain(d3.extent(smokes)).range([chartH,0])
       }
       else {
        yscale.domain(d3.extent(obesity)).range([0,chartH])
       }
       return yscale;
    }

    function render_x_axis(scale,axis){
        var bottom=d3.axisBottom(scale);
        axis.transition()
        .duration(1000)
        .call(bottom);
        return axis;
    }
    function render_y_axes(scale,axisL,axisR){
        var left=d3.axisLeft(scale);
        var right=d3.axisRight(scale);
        axisL.transition()
        .duration(1000)
        .call(left);
        axisR.transition()
        .duration(1000)
        .call(right);
        return [axisL,axisR];
    }
    function circle_x(text,scale,circles,text_el){
        if(text=='Poverty(%)'){
            circles=circles.transition().duration(1000).attr('cx',function (d, i){return scale(poverty[i])})
            text_el=text_el.transition().duration(1000).attr('x',function (d, i){return scale(poverty[i])})
           }
           else {
            circles=circles.transition().duration(1000).attr('cx',function (d, i){return scale(incomes[i])})
            text_el=text_el.transition().duration(1000).attr('x',function (d, i){return scale(incomes[i])})
           }
    }
    function circle_y(text,scale,circles,text_el){
        if(text=='Smokes(%)'){
            circles=circles.transition().duration(1000).attr('cy',function (d, i){return scale(smokes[i])})
            text_el=text_el.transition().duration(1000).attr('y',function (d, i){return scale(smokes[i])})
           }
        else {
            circles=circles.transition().duration(1000).attr('cy',function (d, i){return scale(obesity[i])})
            text_el=text_el.transition().duration(1000).attr('y',function (d, i){return scale(obesity[i])})
           }
    }


    // inital scales and plots
        yscale=d3.scaleLinear()
        .domain(d3.extent(obesity))
        .range([chartH,0])
        xscale=d3.scaleLinear()
        .domain(d3.extent(incomes))
        .range([0,chartW])
        xaxis=d3.axisBottom(xscale);
        yaxisL = d3.axisLeft(yscale);
        yaxisR=d3.axisRight(yscale);

        var x_obj=chart.append('g')
            .attr('transform',`translate(0,${chartH})`)
            .call(xaxis)
        var yl_obj=chart.append('g')
            .call(yaxisL)
        var yr_obj=chart.append('g')
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
        // I really cannot figure out why less text elements than circle elements are being added, so I'm moving on without perfect state abbreviations. Unfortunately nobody in my class seemed to know why either.
        var text_el=chart.selectAll('text')
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
    
    // click event function to swap between x and y values and reclass each axis
    function clicker(){
       var selection =d3.select(this)
       console.log(selection.text())
       x_arr=["Median Household Income",'Poverty(%)'];
       y_arr=["Obesity(%)","Smokes(%)"];
       if ( x_arr.includes(selection.text())){
           console.log('yes in x arr')
           temp_xscale=xscaler(selection.text());
           x_obj=render_x_axis(temp_xscale,x_obj)
           circle_x(selection.text(),temp_xscale,circles,text_el);
           x_arr.forEach(function (d){
               if (d!=selection.text()){
                chart.selectAll('text')
                .filter(function (){
                    return d3.select(this).text()==d;
                })
                .classed('active',false).classed('inactive',true)
               }
           })
       }
       else{
           console.log('yes in y arr')
           temp_yscale=yscaler(selection.text());
           yr_obj=render_y_axes(temp_yscale,yl_obj,yr_obj)[1];
           yl_obj=render_y_axes(temp_yscale,yl_obj,yr_obj)[0];
           circle_y(selection.text(),temp_yscale,circles,text_el);
           y_arr.forEach(function (d){
               if (d!=selection.text()){
                   chart.selectAll('text')
                    .filter(function(){
                        return d3.select(this).text()==d;
                    })
                    .classed('active',false).classed('inactive',true)
               }
           })
       }
        
       selection.classed('inactive',false).classed('active',true);

    }
    //inital x and y labels were made outside the init function so they could be referenced inside the clicker event function
    var x_label_income=chart.append("text")
        .attr("transform", `translate(${chartW / 2}, ${chartH + margin.top})`)
        .attr('text-anchor', 'middle')
        .attr('font-size',20)
        .classed('active',true)
        .text("Median Household Income")
    var x_label_poverty=chart.append("text")
        .attr("transform", `translate(${chartW / 2}, ${chartH + margin.top+15})`)
        .attr('text-anchor', 'middle')
        .attr('font-size',20)
        .classed('inactive',true)
        .text("Poverty(%)")
    var y_label_obesity=chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.top+17)
        .attr("x", 0-margin.left-(chartW/2))
        .attr('font-size',20)
        .attr('text-anchor', 'middle')
        .classed('active',true)
        .text("Obesity(%)");
    var y_label_smokes=chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.top-5)
        .attr("x", 0-margin.left-(chartW/2))
        .attr('font-size',20)
        .attr('text-anchor', 'middle')
        .classed('inactive',true)
        .text("Smokes(%)");
    y_label_smokes.on('click',clicker);
    y_label_obesity.on('click',clicker);
    x_label_income.on('click',clicker);
    x_label_poverty.on('click',clicker);
})

