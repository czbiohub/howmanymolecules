var _ = require('lodash')
var d3 = require('d3')
var coords = require('./coordinates')
var setup = require('./setup')
var animate = require('./animate')
var generate = require('./generate')
var prob = require('prob.js')

var width = 900
var height = 750

function simulation (params) {
	if (!(this instanceof simulation)) return new simulation(params)

	var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('position', 'absolute')
    .style('left', '250px')
    .style('top', '25px')

  svg.append('rect')
		.attr('width', 800)
		.attr('height', 175)
		.attr('x', coords[0].count.x(-1))
		.attr('y', coords[0].count.y(-1))
		.style('fill', 'white')
		.style('stroke', 'rgb(100,100,100)')
		.style('stroke-dasharray', '5')
		.style('stroke-width', 2)

  setup(svg, coords[0])
  setup(svg, coords[1])
  setup(svg, coords[2])

	var counts = []
	var duration = 3000

	function run () {

		var sim = [generate(params), generate(params), generate(params)]

		animate(svg, sim[0], coords[0], duration, 0)
		animate(svg, sim[1], coords[1], duration, 1)
		animate(svg, sim[2], coords[2], duration, 2)

		counts.push(sim[0].count)
		counts.push(sim[1].count)
		counts.push(sim[2].count)

		var currentCounts = counts.map(function (d, i) {return {name: i, value: d}})

		var tick = svg.selectAll('.tick')
	    .data(_.takeRight(currentCounts, 50), function (d) {return d.name})

	  tick.enter().append('circle')
	  	.attr('class', 'tick')
	  	.attr('r', 0)
	    .attr('cx', function (d) {return coords[0].count.x(d.value)})
	    .attr('cy', function (d) {return coords[0].count.y(1)})
	    .attr('transform', 'translate(0,5)')
	    .style('fill', '#F768A1')
	    .style('opacity', 0.5)
	  .transition()
	    .delay(duration - duration * 0.1)
	    .attr('r', 12)

	  var tick = svg.selectAll('.tick')
	    .data(_.takeRight(currentCounts, 49), function (d) {return d.name})
	    .exit()
	    .transition()
	    .delay(duration - duration * 0.1)
	    .attr('r', 0)
	    .remove()

	}

	run()

	setInterval(function () {
		run()
	}, duration)

}

module.exports = simulation