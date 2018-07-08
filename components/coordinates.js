var d3 = require('d3')

var coordinates = {one: {}, two: {}, three: {}}

// coordinates of the cell (stage one)
coordinates.one.x = d3.scaleLinear()
  .domain([-1, 1])
  .range([20, 220])

coordinates.one.y = d3.scaleLinear()
  .domain([-1, 1])
  .range([20, 220])

// coordinates of the sample space (stage two)
coordinates.two.x = d3.scaleLinear()
	.domain([-1, 1])
	.range([20, 220])

coordinates.two.y = d3.scaleLinear()
	.domain([-1, 1])
	.range([220, 420])

// coordinates of the PCR space (stage three)
coordinates.three.x = d3.scaleLinear()
	.domain([-1, 1])
	.range([20, 220])

coordinates.three.y = d3.scaleLinear()
	.domain([-1, 1])
	.range([420, 620])

module.exports = coordinates