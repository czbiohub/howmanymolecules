function animate (svg, data, coords, histogram, duration, color, index) {

  // primary animation loop for molecules
  duration = duration/1.1
  // var duration = 4
  var pill = svg.selectAll('.pill' + index).remove()

  var pill = svg.selectAll('.pill' + index)
      .data(data.data)
    .enter().append('rect')
      .attr('class', 'pill' + index)
      .attr('width', 0)
      .attr('height', 0)
      .attr('transform', 'translate(10,4)')
      .attr('rx', 7)
      .attr('ry', 10)
      .attr('x', function (d) {return coords.cell.x(d[0])})
      .attr('y', function (d) {return coords.cell.y(d[1])})
      .style('fill', function (d) {
        if (d[2] == 1) return color
        return '#C4C4C4'
      })
      .style('opacity', 0.75)
    .transition() //appear in first circle
      .duration(duration * 0.2)
      .attr('width', 40)
      .attr('height', 15)
      .attr('transform', 'translate(-10,-4)')
    .transition() //slide down to second circle
      .duration(duration * 0.2)
      .attr('x', function (d) {return d[5] ? coords.sample.x(d[3]) : coords.cell.x(d[0])})
      .attr('y', function (d) {return d[5] ? coords.sample.y(d[4]) : coords.cell.y(d[1])})
    .transition() //duplicate for pcr
      .duration(duration * 0.1)
      .attr('transform', function (d) {return (d[6] & d[5] ? 'translate(4,-10)' : 'translate(-10,-4)')})
    .transition() //turn into counts/bars
      .duration(duration * 0.15)
      .attr('x', function (d) {return d[5] ? coords.sample.x(d[7]) : coords.cell.x(d[0])})
      .attr('y', function (d) {return d[5] ? coords.sample.y(d[8]) : coords.cell.y(d[1])})
      .style('opacity', function (d) {return d[5] ? 1 : 0.75})
      .attr('transform', 'translate(-10,-4)')
      .style('stroke', 'none')
    .transition() //normalize
      .duration(duration * 0.1)
      .attr('height', function (d) {return d[5] ? d[11] - d[10] : 15})
      .attr('y', function (d) {return d[5] ? (d[11] + d[10])/2 : coords.cell.y(d[1])})
      .attr('x', function (d) {return d[5] ? coords.sample.x(d[7]) : coords.cell.x(d[0])})
      // .attr('transform', 'translate(-10,-4)')
    .transition() //remove the gray count bar
      .duration(duration * 0.1)
      .style('opacity', function (d) {return ((d[5]) & (d[2] == 1)) ? 1 : 0})
    .transition() //move the colored bar to the histogram
      .duration(duration * 0.15)
      .attr('class', function (d) {return d[5] ? 'sample'+index : 'pill'+index})
      .attr('x', function (d) {return d[5] ? histogram.x(d[9]) : coords.cell.x(d[0])})
      .attr('y', function (d) {return d[5] ? histogram.y(0.01) : coords.cell.y(d[1])})
      .attr('width', function (d) {return d[5] ? 20 : 40})
      .attr('height', function (d) {return d[5] ? 20 : 15})
      .style('opacity', function (d) {return ((d[5]) & (d[2] == 1)) ? 0.375 : 0})
      .attr('rx', 10)
      .attr('ry', 10)
      // .on('end', console.log('all done'))
}

module.exports = animate
