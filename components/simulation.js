var _ = require('lodash')
var d3 = require('d3')
var coords = require('./coordinates')
var setup = require('./setup')
var animate = require('./animate')
var generate = require('./generate')
var histogram = require('./histogram')
var prob = require('prob.js')

var width = 1100
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
  setup(svg, coords[3], 'cell')
  setup(svg, coords['histogram'], 'histogram')

  var id, counts1, counts2, hist1, hist2

  var history = [100, 500] // history for histogram ticks [0] and kde [1]

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
    counts1 = [] // reset count vector
    counts2 = []
    if (id) clearInterval(id)  // clear current loop
    if (hist1) clearTimeout(hist1)  // clear current loop
    if (hist2) clearTimeout(hist2)
    svg.selectAll('.count' + 0).remove() // clear all histogram ticks
    svg.selectAll('.count' + 1).remove()
    svg.selectAll('.path' + 0).remove() // clear the path
    svg.selectAll('.path' + 1).remove()
    _.forEach([0, 1, 2, 3], function (d) {svg.selectAll('.pill' + d).remove()}) // clear all molecules
  }

  function once (duration, display) {

    // simulate three cells
    var sim = [generate(controls.state), generate(controls.state), generate(controls.state), generate(controls.state)]

    // animate three cells
    if (display) {
      animate(svg, sim[0], coords[0], coords['histogram'], duration, '#F768A1', 0)
      animate(svg, sim[1], coords[1], coords['histogram'], duration, '#F768A1', 1)
      animate(svg, sim[2], coords[2], coords['histogram'], duration, '#B191DB', 2)
      animate(svg, sim[3], coords[3], coords['histogram'], duration, '#B191DB', 3)
    }

    // store the total cell counts
    counts1.push(sim[0].count)
    counts1.push(sim[1].count)
    counts2.push(sim[2].count)
    counts2.push(sim[3].count)

    // render the histogram
    hist1 = histogram(svg, counts1, coords['histogram'], duration, history, '#F768A1', 0)
    // demo2 = histogram(svg, random_array_demo2,)
    hist2 = histogram(svg, counts2, coords['histogram'], duration, history, '#B191DB', 1)
  }
}

module.exports = simulation
