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

  var id, counts0, counts1, hist0, hist1, true_hist0, true_hist1

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
    if (hist0) clearTimeout(hist0)  // clear current loop
    if (hist1) clearTimeout(hist1)
    if (true_hist0) {
      clearTimeout(true_hist0)
      svg.selectAll('.path' + 2).remove()
    }
    if (true_hist1) {
      clearTimeout(true_hist1)
      svg.selectAll('.path'+3).remove()
    }

    svg.selectAll('.count' + 0).remove() // clear all histogram ticks
    svg.selectAll('.count' + 1).remove()
    svg.selectAll('.path' + 0).remove() // clear the path
    svg.selectAll('.path' + 1).remove()
    _.forEach([0, 1, 2, 3], function (d) {svg.selectAll('.pill' + d).remove()}) // clear all molecules
  }

  function once (duration, display) {

    console.log(controls.state['shared_params'])

    if (controls.state['shared_params']['showtrue'] == true) {
      true_hist0 = histogram(svg, controls.state['pop0_params']['true_counts'], coords['histogram'], duration, [0, 1000], '#646464', 2)

      if (controls.state['shared_params']['comparepops'] == true) {
        true_hist1 = histogram(svg, controls.state['pop1_params']['true_counts'], coords['histogram'], duration, [0, 1000], '#646464', 3)
      }
    }

    // simulate four cells
    var sim = [generate(controls.state['pop0_params']), generate(controls.state['pop0_params']), generate(controls.state['pop1_params']), generate(controls.state['pop1_params'])]

    if (controls.state['shared_params']['historylim']) {
      var history = [50, 250]
    } else {
      var history = [1500, 1500]
    }

    // animate four cells
    if (display) {
      animate(svg, sim[0], coords[0], coords['histogram'], duration, controls.state['pop0_params']['color'], 0)
      animate(svg, sim[1], coords[1], coords['histogram'], duration, controls.state['pop0_params']['color'], 1)
      animate(svg, sim[2], coords[2], coords['histogram'], duration, controls.state['pop1_params']['color'], 2)
      animate(svg, sim[3], coords[3], coords['histogram'], duration, controls.state['pop1_params']['color'], 3)
    }

    // store the total cell counts
    counts1.push(sim[0].count)
    counts1.push(sim[1].count)
    counts2.push(sim[2].count)
    counts2.push(sim[3].count)

    // render the histogram
    hist1 = histogram(svg, counts1, coords['histogram'], duration, history, controls.state['pop0_params']['color'], 0)
    // demo2 = histogram(svg, random_array_demo2,)
    hist2 = histogram(svg, counts2, coords['histogram'], duration, history, controls.state['pop1_params']['color'], 1)
  }


}

module.exports = simulation
