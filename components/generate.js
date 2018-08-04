var _ = require('lodash')
var prob = require('prob.js')

// generate underlying data for all stages of a simulation
// we think of each molecule as a particle
// data structure precomputes all neccessary information for each molecule
// [x0, y0, label, x1, y1, sample, copy]
// x0, y0 -> position in cell
// x1, y1 -> position in sample space
// label -> gene identity (0 or 1)
// sample -> is it sampled (1) or dropped (0)
// copy -> is it a copy (1) or original (0)

function generate (params) {
  var data

  // stage one
  // create n total molecules with e expressing gene of interest
  // where e is drawn from a poisson with mean u
  // sample positions randomly on the unit sphere
  function one () {
    var n = params.molecules
    var u = params.expression
    var rand = prob.uniform(0, 1)
    var e = prob.poisson(u)()
    if (e >= n) e = (n - 1)
    var data = []
    for (i = 0; i < n; i++) {
      var r = 0.8 * Math.sqrt(rand())
      var t = rand() * 2 * Math.PI
      var x = r * Math.cos(t)
      var y = r * Math.sin(t)
      if (i < e) data.push([x, y, 1])
      else data.push([x, y, 0])
    }
    data = _.shuffle(data)
    return data
  }

  // stage two
  // randomly sample each molecule based on the sampling probability
  // we don't drop samples from the array
  // rather we just store whether it's a sample or not
  function two (init) {
    var rand = prob.uniform(0, 1)
    var data = init.map(function (d) {
      var sample = (rand() < params.samples) ? 1 : 0
      return _.concat(d, [d[0], d[1], sample])
    })
    return data
  }

  // stage three
  // apply PCR to a random subset of molecules
  // by creating and storing an additional copy at random
  function three (init) {
    var r = prob.uniform(0, 1)
    var init = _.map(init, function (d) {
      return _.concat(d, 0)
    })
    var additional = []
    if (params.pcr) {
      additional = _.map(init, function (d) {
        if (r() > 0.5) {
          return _.concat(d.slice(0, 6), 1)
        }
      })
    }
    var amplified = _.compact(_.concat(init, additional))
    return amplified
  }

  // stage four
  // count the total number of molecules
  // ignoring those removed during sampling
  function four (init) {
    var filtered = _.filter(init, function (d) {return d[5] == 1})
    var counts = _.countBy(filtered, function (d) {return d[2]})
    counts[0] = counts[0] || 0
    counts[1] = counts[1] || 0
    return counts
  }

  // stage five
  // determine normalized positions in a count "bucket"
  // by iterating over elements and stacking vertically

  // normalize counts
  function five (init, counts) {

    // the elements are stacked in an overlapping fashion, with offset
    // the 5% of the radius of the circle, or, if that would overflow,
    // a height such that they would fill 80%
    // of the height of the circle. Circles have a radius of 100 and the pills
    // have a height of 15, so 0.05 overlap is 5 pix, ie, 1/3 of a pill.
    var w = Math.min(((counts[1] > counts[0]) ? (2 / counts[1]) : (2 / counts[0])) * 0.8, 0.05)
    var dy0 = -0.75 // initial vertical position
    var dy1 = -0.75 // initial vertical position



    for (i = 0; i < init.length; i++) {
      if (init[i][2]) {
        init[i][7] = 0.25 // x location of gene stack
        init[i][8] = dy1 // y location of pill
        init[i][9] = normalize(counts) // count for histogram for gene stack
        if (init[i][5] == 1) dy1 += w // increment if sampled
      } else {
        init[i][7] = -0.25 // x location of other stack
        init[i][8] = dy0 // y location of pill
        init[i][9] = counts[0] // count for histogram for other stack
        if (init[i][5] == 1) dy0 += w // increment if sampled
      }
    }
    return init
  }

  function normalize(counts){
    count = counts[1]
    norm = counts[1]/(counts[0] + counts[1]) * 100 // counts per hundred
    lognorm = Math.log10(1 + norm)*10
    if (params.log){
      return lognorm
    }
    else if (params.norm) {
      return norm
    }
    else {
      return count
    }
  }

  // cascade a full run of the simulation
  // return the final data array and the (normalized) gene count
  data = one()
  data = two(data)
  data = three(data)
  counts = four(data)
  data = five(data, counts)
  count = normalize(counts)
  return {data: data, count: count}
}

module.exports = generate
