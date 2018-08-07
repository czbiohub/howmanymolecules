var _ = require('lodash')
var d3 = require('d3')
var coords = require('./coordinates')
var setup = require('./setup')
var animate = require('./animate')
var generate = require('./generate')
var histogram = require('./histogram')
var prob = require('prob.js')

function walkthrough(svg, controls, coords, duration) {
  if (!(this instanceof walkthrough)) return new walkthrough(svg, controls, coords, duration)

  controls.on('walkthrough', lineup(duration))
  console.log('made it to walkthrough main fn')

  function lineup(duration) {

    cell_explainer = setup(svg, coords[0], cell)
    console.log('cell explainer', cell_explainer)
    // this.emit('play1x')


  }

  function start(duration) {


  }




}
