var _ = require('lodash')
var d3 = require('d3')
var coords = require('./coordinates')
var generate = require('./generate')

var width = 500
var height = 500

function simulation (params) {
	if (!(this instanceof simulation)) return new simulation(params)

	var svg = d3.select('body').append('svg')
	    .attr('width', width)
	    .attr('height', height)
	    .style('position', 'absolute')
	    .style('left', '170px')
	    .style('top', '0px')

	function run () {

		var data = generate(params)

		console.log(data)

		var circle = svg.selectAll('rect').remove()

		var circle = svg.selectAll('rect')
		    .data(data.one)
		  .enter().append('rect')
		  	.attr('width', 40)
		    .attr('height', 15)
		    .attr('rx', 7)
		    .attr('ry', 10)
		    .attr('x', function (d) {return coords.one.x(d[0])})
		    .attr('y', function (d) {return coords.one.y(d[1])})
		    .style('fill', function (d) {
		    	if (d[2] == 1) return '#F768A1'
		    	return '#C4C4C4'
		    })
		    .style('stroke', 'black')

		circle = circle.data(data.two)

		circle.transition()
		  .duration(500)
		  .attr('x', function (d) {return coords.two.x(d[0])})
		  .attr('y', function (d) {return coords.two.y(d[1])})

		circle.exit().transition()
		  .duration(250)
		  .style('opacity', 0)
		  .remove()

		// setTimeout(function () {
		// 	circle = circle.data(data.three)

		// 	circle.transition()
		// 	  .duration(1500)
		// 	  .attr('x', function (d) {return coords.three.x(d[0])})
		// 	  .attr('y', function (d) {return coords.three.y(d[1])})

		// 	circle.enter().append('rect')
		// 		.attr('width', 40)
		// 		.attr('height', 15)
		// 		.attr('rx', 7)
		// 		.attr('ry', 10)
		// 		.attr('x', function (d) {return coords.three.x(d[0])})
		// 		.attr('y', function (d) {return coords.three.y(d[1])})

		// }, 2000)
	}

	run()

	setInterval(function () {
		run()
	}, 1000)

}

module.exports = simulation