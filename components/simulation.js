var _ = require('lodash')
var d3 = require('d3')
var coords = require('./coordinates')
var setup = require('./setup')
var animate = require('./animate')
var generate = require('./generate')
var histogram = require('./histogram')
var prob = require('prob.js')
var walkthrough = require('./walkthrough.js')

var width = 1100
var height = 750

function simulation (controls) {
  if (!(this instanceof simulation)) return new simulation(controls)

  // create svg
  var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('position', 'absolute')
    .style('left', '190px')
    .style('top', '-20px')

  // setup boxes and axes
  setup(svg, coords[0], 'cell')
  setup(svg, coords[1], 'cell')
  setup(svg, coords[2], 'cell')
  setup(svg, coords[3], 'cell')
  setup(svg, coords['histogram'], 'histogram')

  var id, hist0, hist1, true_hist0, true_hist1
  var counts0 = []
  var counts1 = []

  controls.on('distrib_change', function (e) {
  if (controls.state['shared_params']['showtrue']==true) {
    add_true_distribution()
  }
})

  controls.on('play', function (e) {
    if (e == '1x') play(4500, 1, true)
    if (e == '3x') play(1500, 3, true)
    if (e == '100x') play(45, 100, false)
  })

  controls.on('clear', function (e) {
    clear()
  })

  controls.on('set_histogram', function (e) {
    set_histogram()
  })

  controls.on('showtrue', function (e) {
    if (e == true) {
      add_true_distribution()
    }
    else {
      clear_true_distrib()
    }
  })

  controls.on('walkthrough', function (e) {
    walkthrough(svg, controls, coords, 3000)
  })

  function play (duration, N, display) {

    var play_buttons = [controls.play_ctrls['inputs']['play3x'], controls.play_ctrls['inputs']['play1x'], controls.play_ctrls['inputs']['play100x'], controls.play_ctrls['inputs']['clear']]
    var total_time = N*duration

    _.forEach(play_buttons, function (d) {d.disabled = true})
    _.forEach(play_buttons, function (d) {d.style['opacity'] = 0.7})
    function reenable(buttons) {
      _.forEach(buttons, function (d) {d.disabled = false})
      _.forEach(buttons, function (d) {d.style['opacity'] = 1})
    }
    setTimeout(reenable, total_time, play_buttons)
    for (n in _.range(0,N)) {
      setTimeout(once, n*duration, duration, display)
      setTimeout(clear_pills, n*duration+duration)
    }
  }

  function clear_pills() {
    _.forEach([0, 1, 2, 3], function (d) {svg.selectAll('.pill' + d).remove()}) // clear all molecules
  }

  function clear_true_distrib() {
    if (true_hist0) {
      clearTimeout(true_hist0)
      svg.selectAll('.path'+2).remove()
    }
    if (true_hist1) {
      clearTimeout(true_hist1)
      svg.selectAll('.path'+3).remove()
    }
  }

  function clear_sample_distrib() {

    counts0 = [] // reset count vector
    counts1 = []

    svg.selectAll('.count' + 0).remove() // clear all histogram ticks
    svg.selectAll('.count' + 1).remove()
    svg.selectAll('.path' + 0).remove() // clear the path
    svg.selectAll('.path' + 1).remove()
    _.forEach([0, 1, 2, 3], function (d) {svg.selectAll('.sample' + d).remove()}) // clear all molecules

  }

  function clear () {
    clear_pills()
    clear_true_distrib()
    clear_sample_distrib()
    }


  function add_true_distribution() {
    if (controls.state['shared_params']['showtrue'] == true) {
      true_hist0 = histogram(svg, controls.state['pop0_params']['true_counts'], coords['histogram'], null, [0, 1000], controls.state['pop0_params']['color'], 2, true)
      if (controls.state['shared_params']['comparepops'] == true) {
        true_hist1 = histogram(svg, controls.state['pop1_params']['true_counts'], coords['histogram'], null, [0, 1000], controls.state['pop1_params']['color'], 3, true)
        }
      }
    }

  //set histogram scale and ticks to match normalization method
  function set_histogram () {
    if (controls.state['shared_params']['log']) {
      coords['histogram'].x.domain([0, 80])
    }
    else if (controls.state['shared_params']['normalize']) {
      coords['histogram'].x.domain([0, 100])
    }
    else {
      coords['histogram'].x.domain([0, 60])
    }

    svg.selectAll('.axis-x').call(d3.axisBottom(coords['histogram'].x))
  }

  function once (duration, display) {
    // simulate four cells
    var sim = [generate(controls.state['shared_params'], controls.state['pop0_params']),
               generate(controls.state['shared_params'], controls.state['pop0_params']),
               generate(controls.state['shared_params'], controls.state['pop1_params']),
               generate(controls.state['shared_params'], controls.state['pop1_params'])]

    if (!controls.state['shared_params']['accumulate_history']) {
      var history = [50, 250]
    } else {
      var history = [1500, 1500]
    }

    // animate four cells
    if (display) {
      animate(svg, sim[0], coords[0], coords['histogram'], duration, controls.state['pop0_params']['color'], 0, false)
      animate(svg, sim[1], coords[1], coords['histogram'], duration, controls.state['pop0_params']['color'], 1, false)
      animate(svg, sim[2], coords[2], coords['histogram'], duration, controls.state['pop1_params']['color'], 2, false)
      animate(svg, sim[3], coords[3], coords['histogram'], duration, controls.state['pop1_params']['color'], 3, false)
    }

    // store the total cell counts
    counts0.push(sim[0].count)
    counts0.push(sim[1].count)

    if (controls.state['shared_params']['comparepops']) {
      counts1.push(sim[2].count)
      counts1.push(sim[3].count)
      hist1 = histogram(svg, counts1, coords['histogram'], duration, history, controls.state['pop1_params']['color'], 1, false)
    } else {
      counts0.push(sim[2].count)
      counts0.push(sim[3].count)
    }
    hist0 = histogram(svg, counts0, coords['histogram'], duration, history, controls.state['pop0_params']['color'], 0, false)
    }
}

module.exports = simulation
