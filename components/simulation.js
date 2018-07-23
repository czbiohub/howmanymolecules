var _ = require('lodash')
var d3 = require('d3')
var coords = require('./coordinates')
var setup = require('./setup')
var animate = require('./animate')
var generate = require('./generate')
var prob = require('prob.js')

var width = 900
var height = 750

function simulation (controls) {
  if (!(this instanceof simulation)) return new simulation(controls)

  var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('position', 'absolute')
    .style('left', '250px')
    .style('top', '25px')

  svg.append('rect')
    .attr('width', 650)
    .attr('height', 175)
    .attr('x', coords[0].count.x(0))
    .attr('y', coords[0].count.y(0.1))
    .style('fill', 'white')
    .style('stroke', 'rgb(100,100,100)')
    .style('stroke-dasharray', '5')
    .style('stroke-width', 2)

  setup(svg, coords[0])
  setup(svg, coords[1])
  setup(svg, coords[2])

  var id, it, counts
  
  var history = [50, 500] // history for ticks [0] and kde [1]

  controls.on('play', function (e) {
    if (e == '1x') play(3000, true)
    if (e == '3x') play(1000, true)
    if (e == '10x') play(300, false)
    if (e == '100x') play(30, false)
  })

  controls.on('clear', function (e) {
    clear()
  })

  function play (duration, display) {
    console.log('restarting')
    clear()
    once(duration, display) // run one loop
    id = setInterval(function () { // setup loops
      once(duration, display)
    }, duration)
  }

  function clear () {
    counts = [] // reset count vector
    if (id) clearInterval(id)  // clear current loop
    if (it) clearTimeout(it)  // clear current loop
    svg.selectAll('.tick').remove() // clear all histogram ticks
    svg.selectAll('.path').remove() // clear the path
    _.forEach([0, 1, 2], function (d) {svg.selectAll('.pill' + d).remove()}) // clear all molecules
  }

  function once (duration, display) {

    // simulate three cells
    var sim = [generate(controls.state), generate(controls.state), generate(controls.state)]

    // animate three cells
    if (display) {
      animate(svg, sim[0], coords[0], duration, 0)
      animate(svg, sim[1], coords[1], duration, 1)
      animate(svg, sim[2], coords[2], duration, 2)
    }
    
    // store the total cell counts
    counts.push(sim[0].count)
    counts.push(sim[1].count)
    counts.push(sim[2].count)

    // add an index to each element of count vector for correct data binding
    var currentCounts = counts.map(function (d, i) {return {name: i, value: d}})

    var tick = svg.selectAll('.tick')
      .data(_.takeRight(currentCounts, history[0]), function (d) {return d.name})

    tick.enter().append('circle')
      .attr('class', 'tick')
      .attr('r', 0)
      .attr('cx', function (d) {return coords[0].count.x(d.value)})
      .attr('cy', function (d) {return coords[0].count.y(0)})
      .attr('transform', 'translate(0,5)')
      .style('fill', '#F768A1')
      .style('opacity', 0.5)
    .transition()
      .delay(duration - duration * 0.1)
      .attr('r', 12)

    var tick = svg.selectAll('.tick')
      .data(_.takeRight(currentCounts, history[0] - 1), function (d) {return d.name})
      .exit()
      .transition()
      .delay(duration - duration * 0.1)
      .attr('r', 0)
      .remove()

    it = setTimeout(function () {
      density()
    }, duration - duration * 0.1)

    function density () {
      var vals = _.takeRight(currentCounts, history[1]).map(function (d) {return d.value})
      var n = vals.length
      var density = kde(epanechnikov(7), coords[0].count.x.ticks(40))(vals)

      svg.selectAll('.path').remove()

      svg.append('path')
        .datum(density)
        .attr('opacity', 1)
        .attr('class', 'path')
        .attr('fill', 'none')
        .attr('stroke', '#F768A1')
        .attr('stroke-width', 3)
        .attr('stroke-linejoin', 'round')
        .attr('d',  d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return coords[0].count.x(d[0]) })
          .y(function(d) { return coords[0].count.y(d[1]) }))
    }

    function kde (kernel, X) {
      return function (V) {
        return X.map(function (x) {
          return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
      };
    }

    function epanechnikov (k) {
      return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }

  }
}

module.exports = simulation