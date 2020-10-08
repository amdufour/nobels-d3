const margin_sex_year = {top: 50, right: 50, bottom: 50, left: 50};
const height_sex_year = 80;

// Display data - sex distribution per year
function generateSexPerYear(data, innerRadius, width_sex_year) {

  // Multiply each Female value by -1
  data.forEach(item => {
    if (item['sum_women'] !== 0) {
      item['sum_women'] *= -1;
    }
  });

  // Append svg to page
  let svg_sex_year = d3.select('#sex-per-year')
    .append('svg')
      .attr('width', 100)
      .attr('height', outerRadius + 10)
    .append('g')
      .attr('class', 'sex-per-year--group');

  // Add defs
  let defs = svg_sex_year.append('defs');
  
  // Create linear gradient for men
  let linearGradientMen = defs.append('linearGradient')
    .attr('id', 'men-gradient-sexperyear')
    .attr('x1', '0%')
		.attr('y1', '0%')
		.attr('x2', '0%')
    .attr('y2', '100%');
  linearGradientMen.append('stop')
    .attr('offset', '0%')
    .style('stop-color', '#68BDBF')
    .style('stop-opacity', 0.5);
  linearGradientMen.append('stop')
    .attr('offset', '90%')
    .style('stop-color', 'white')
    .style('stop-opacity', 1);
  
  // Create linear gradient for women
  let linearGradientWomen = defs.append('linearGradient')
    .attr('id', 'women-gradient-sexperyear')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');
  linearGradientWomen.append('stop')
    .attr('offset', '0%')
    .style('stop-color', 'white')
    .style('stop-opacity', 1);
  linearGradientWomen.append('stop')
    .attr('offset', '50%')
    .style('stop-color', '#E0867B')
    .style('stop-opacity', 0.5);
    
  // Create linear gradient for women
  defs.append('radialGradient')
    .attr('id', 'women-gradient-sexperyear')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('cx', 0)
    .attr('cy', 0)
    .selectAll('stop')
    .data([
        {offset: '20%', color: 'white'},
        {offset: '100%', color: '#F9E7E5'}
      ])
    .enter().append('stop')
    .attr('offset', function(d) { return d.offset; })
    .attr('stop-color', function(d) { return d.color; });

  // X scale
  let x_scale_sex_year = d3.scaleLinear()
    .domain([d3.min(data, d => d['year']), d3.max(data, d => d['year'])])
    .range([innerRadius, width_sex_year + 3]);

  // Y scales
  let y_scale_sex_year = d3.scaleLinear()
    .domain([-10, 10])
    .range([height_sex_year, 0]);

  // Generate lines
  // let line_male_sex_year = d3.line()
  //   .x(d => { return x_scale_sex_year(d['year']) })
  //   .y(d => { return y_scale_sex_year(d['sum_men']); })
  //   .curve(d3.curveMonotoneX);
  // let line_female_sex_year = d3.line()
  //   .x(d => { return x_scale_sex_year(d['year']) })
  //   .y(d => { return y_scale_sex_year(d['sum_women']); })
  //   .curve(d3.curveMonotoneX);

  // Generate areas
  let area_male_sex_year = d3.area()
    .x(d => { return x_scale_sex_year(d['year']) })
    .y0(height_sex_year/2)
    .y1(d => { return y_scale_sex_year(d['sum_men']); })
    .curve(d3.curveCatmullRom.alpha(0.25));
  let area_female_sex_year = d3.area()
    .x(d => { return x_scale_sex_year(d['year']) })
    .y0(d => { return y_scale_sex_year(d['sum_women']); })
    .y1(height_sex_year/2)
    .curve(d3.curveCatmullRom.alpha(0.25));

  // Call x axis
  svg_sex_year.append('g')
    .attr('class', 'axis axis-x')
    .attr('transform', 'translate(0,' + height_sex_year/2 + ')')
    .call(d3.axisBottom(x_scale_sex_year)
      .tickValues([1901, 1920, 1940, 1960, 1980, 2000, 2019])
      .tickFormat(d3.format(""))
    )
    .selectAll('text')
      .attr('text-achor', 'start')
      .attr('dx', '22px')
      .attr('dy', '-5px')
      .attr('transform', 'rotate(90)');

  // Append path, bind data and call line generator
  // svg_sex_year.append('path')
  //   .datum(data)
  //   .attr('class', 'line line-male')
  //   .attr('d', line_male_sex_year);
  // svg_sex_year.append('path')
  //   .datum(data)
  //   .attr('class', 'line line-female')
  //   .attr('d', line_female_sex_year);

  // Append areas
  svg_sex_year.append('path')
    .datum(data)
    .attr('class', 'area area-male')
    .attr('d', area_male_sex_year);
  svg_sex_year.append('path')
    .datum(data)
    .attr('class', 'area area-female')
    .attr('d', area_female_sex_year);
}