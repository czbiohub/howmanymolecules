var d3 = require('d3')

function setup (svg, coords, layout) {

  // create boxes using the provided coordinate systems

  if (layout == 'cell') {
    svg.append('circle')
      .attr('r', 110)
      .attr('cx', coords.cell.x(0))
      .attr('cy', coords.cell.y(0))
      .style('fill', 'white')
      .style('stroke', 'rgb(100,100,100)')
      .style('stroke-dasharray', '5')
      .style('stroke-width', 2)
      .attr('transform', 'translate(8,5)')

    svg.append('circle')
      .attr('r', 110)
      .attr('cx', coords.sample.x(0))
      .attr('cy', coords.sample.y(0))
      .style('fill', 'white')
      .style('stroke', 'rgb(100,100,100)')
      .style('stroke-dasharray', '5')
      .style('stroke-width', 2)
      .attr('transform', 'translate(8,5)')
  }
  
  if (layout == 'histogram') {
    svg.append('rect')
      .attr('width', 725)
      .attr('height', 175)
      .attr('x', coords.x(0))
      .attr('y', coords.y(0.1))
      .style('fill', 'white')
      .style('stroke', 'rgb(100,100,100)')
      .style('stroke-dasharray', '5')
      .style('stroke-width', 2)

    svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + (coords.y(0)) + ')')
      .call(d3.axisBottom(coords.x))
    .append('text')
      .attr('x', coords.x(0))
      .attr('y', -6)
      .attr('fill', '#000')
      .attr('text-anchor', 'end')
      .attr('font-weight', 'bold')
  }

}

module.exports = setup