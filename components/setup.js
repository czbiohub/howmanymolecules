function setup (svg, coords) {

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

module.exports = setup