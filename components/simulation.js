var _ = require('lodash')
var prob = require('prob.js')
var d3 = require('d3')
var css = require('dom-css')

var width = 500
var height = 500

function simulation (params) {
	if (!(this instanceof simulation)) return new simulation(params)

	var x = d3.scaleLinear()
	    .domain([0, 1])
	    .range([0, width])

	var y = d3.scaleLinear()
	    .domain([0, 1])
	    .range([0, height])

	var svg = d3.select('body').append('svg')
	    .attr('width', width)
	    .attr('height', height)
	    .style('position', 'absolute')
	    .style('left', '170px')
	    .style('top', '0px')

	function run () {

		var n1 = params.expression
		var n2 = Math.round(params.molecules * params.expression)

		var rx = prob.uniform(0.3, 0.6)
		var ry = prob.uniform(0.1, 0.4)
		var initial = Array(n1).fill(0).map(function (d) {
			return [rx(), ry()]
		})

		var rx = prob.uniform(0.3, 0.6)
		var ry = prob.uniform(0.6, 0.9)
		var final = Array(n2).fill(0).map(function (d) {
			return [rx(), ry()]
		})

		var circle = svg.selectAll('rect').remove()

		var circle = svg.selectAll('rect')
		    .data(initial)
		  .enter().append('rect')
		  	.attr('width', 40)
		    .attr('height', 15)
		    .attr('rx', 7)
		    .attr('ry', 10)
		    .attr('x', function (d) {return x(d[0])})
		    .attr('y', function (d) {return y(d[1])})
		    .style('fill', '#F768A1')
		    .style('stroke', 'black')

		circle = circle.data(final)

		circle.transition()
		  .duration(1500)
		  .attr('x', function (d) {return x(d[0])})
		  .attr('y', function (d) {return y(d[1])})

		circle.enter().append('rect')
		  .attr('width', 40)
		  .attr('height', 15)
		  .attr('rx', 7)
		  .attr('ry', 10)
		  .attr('x', function (d) {return x(d[0])})
		  .attr('y', function (d) {return y(d[1])})

		circle.exit().transition()
		  .duration(500)
		  .style('opacity', 0)
		  .remove()
	}

	run()

	setInterval(function () {
		run()
	}, 2000)

}

module.exports = simulation