var _ = require('lodash')
var d3 = require('d3')
var coords = require('./coordinates')
var setup = require('./setup')
var animate = require('./animate')
var generate = require('./generate')
var histogram = require('./histogram')
var prob = require('prob.js')

var width = 900
var height = 750

function simulation (controls) {
  if (!(this instanceof simulation)) return new simulation(controls)

  // create svg
  var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('position', 'absolute')
    .style('left', '250px')
    .style('top', '25px')

  // setup boxes and axes
  setup(svg, coords[0], 'cell')
  setup(svg, coords[1], 'cell')
  setup(svg, coords[2], 'cell')
  setup(svg, coords['histogram'], 'histogram')

  var id, it, counts
  
  var history = [50, 500] // history for histogram ticks [0] and kde [1]

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
    svg.selectAll('.count').remove() // clear all histogram ticks
    svg.selectAll('.path').remove() // clear the path
    _.forEach([0, 1, 2], function (d) {svg.selectAll('.pill' + d).remove()}) // clear all molecules
  }

  function once (duration, display) {

    // simulate three cells
    var sim = [generate(controls.state), generate(controls.state), generate(controls.state)]

    // animate three cells
    if (display) {
      animate(svg, sim[0], coords[0], coords['histogram'], duration, 0)
      animate(svg, sim[1], coords[1], coords['histogram'], duration, 1)
      animate(svg, sim[2], coords[2], coords['histogram'], duration, 2)
    }

    // store the total cell counts
    counts.push(sim[0].count)
    counts.push(sim[1].count)
    counts.push(sim[2].count)

    // render the histogram
    it = histogram(svg, counts, coords['histogram'], duration, history)
  }
}

module.exports = simulation