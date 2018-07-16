var d3 = require('d3')

var coordinates = {0: {}, 1: {}, 2: {}}

// cell #0

coordinates[0].cell = {
	x: d3.scaleLinear()
	  .domain([-1, 1])
	  .range([50, 250]),
  y: d3.scaleLinear()
	  .domain([-1, 1])
	  .range([50, 250])
}

coordinates[0].sample = {
	x: d3.scaleLinear()
		.domain([-1, 1])
		.range([50, 250]),
	y: d3.scaleLinear()
		.domain([-1, 1])
		.range([300, 500])
}

coordinates[0].count = {
	x: d3.scaleLinear()
		.domain([0, 20])
		.range([50, 500]),
	y: d3.scaleLinear()
		.domain([-1, 1])
		.range([550, 700])
}

// cell #1

coordinates[1].cell = {
	x: d3.scaleLinear()
	  .domain([-1, 1])
	  .range([300, 500]),
  y: d3.scaleLinear()
	  .domain([-1, 1])
	  .range([50, 250])
}

coordinates[1].sample = {
	x: d3.scaleLinear()
		.domain([-1, 1])
		.range([300, 500]),
	y: d3.scaleLinear()
		.domain([-1, 1])
		.range([300, 500])
}

coordinates[1].count = coordinates[0].count

// cell #2

coordinates[2].cell = {
	x: d3.scaleLinear()
	  .domain([-1, 1])
	  .range([550, 750]),
  y: d3.scaleLinear()
	  .domain([-1, 1])
	  .range([50, 250])
}

coordinates[2].sample = {
	x: d3.scaleLinear()
		.domain([-1, 1])
		.range([550, 750]),
	y: d3.scaleLinear()
		.domain([-1, 1])
		.range([300, 500])
}

coordinates[2].count = coordinates[0].count

module.exports = coordinates