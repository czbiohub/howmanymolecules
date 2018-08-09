var _ = require('lodash')
var prob = require('prob.js')

// generate underlying data for all stages of a simulation
// we think of each molecule as a particle
// data structure precomputes all neccessary information for each molecule
// [x0, y0, label, x1, y1, sample, copy, x2, y2, count, norm_y, norm_height, normalize]
// x0, y0 -> position in cell
// x1, y1 -> position in sample space
// x2, y2 -> position in stacked sample space
// norm_y, norm_height -> y coordinate and height for normalized bars
// normalize -> boolean for whether nontrivial normalization is performed
// label -> gene identity (0 or 1)
// sample -> is it sampled (1) or dropped (0)
// copy -> is it a copy (1) or original (0)

function generate (shared_params, params) {
  var data

  // stage one
  // create n total molecules with e expressing gene of interest
  // where e is drawn from a poisson with mean u
  // sample positions randomly on the unit sphere
  function create () {
    var n = 100 //params.nmolecules
    var u = params.expression*n//*params.nmolecules
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
  function sample (init) {
    var rand = prob.uniform(0, 1)
    var data = init.map(function (d) {
      var sample = (rand() < params.samples/100) ? 1 : 0
      return _.concat(d, [d[0], d[1], sample])
    })

    // make sure to sample at least one molecule
    if (_.sum(data.map(function (d) {return d[5]})) == 0){
      data[0][5] = 1
    }

    return data
  }

  // stage three
  // apply PCR to a random subset of molecules
  // by creating and storing an additional copy at random
  function amplify (init) {
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
  function count (init) {
    var filtered = _.filter(init, function (d) {return d[5] == 1})
    var counts = _.countBy(filtered, function (d) {return d[2]})
    counts[0] = counts[0] || 0
    counts[1] = counts[1] || 0
    return counts
  }

  function normalize (counts) {
    norm = counts[1]/(counts[0] + counts[1]) * 100
    lognorm = Math.log10(1 + norm) * 40

    if (shared_params['log']) {
      return lognorm
    }
    else if (shared_params['normalize']){
      return norm
    }
    else {
      return counts[1]
    }
  }

  // stage five
  // determine positions in a count "bucket"
  // by iterating over elements and stacking vertically
  function stack (init, counts, norm=false) {

    var w = Math.min(((counts[1] > counts[0]) ? (2 / counts[1]) : (2 / counts[0])) * 0.75, 0.05)
    var h0 = w*counts[0]
    var h1 = w*counts[1]
    var norm = normalize(counts)

    var dy0 = -0.75 // initial vertical position
    var dy1 = -0.75 // initial vertical position

    for (i = 0; i < init.length; i++) {
      if (init[i][2]) {
        init[i][7] = 0.25 // x coord
        init[i][8] = dy1 // y coord
        init[i][11] = h1 // total height
        if (init[i][5] == 1) dy1 += w // increment if sampled
      } else { // if gray
        init[i][7] = -0.25
        init[i][8] = dy0
        init[i][9] = norm
        init[i][11] = h0
        if (init[i][5] == 1) dy0 += w // increment if sampled
      }
      init[i][9] = norm // normalized count
      init[i][10] = -0.75 // bottom of bar
    }

    return init
  }

  // stretch if normalization is being used
  function stretch (init, counts){
    if (shared_params['log'] | shared_params['normalize']) {
      var normalized_height = [(2/(counts[0] + counts[1]) * counts[0]) * 0.75,
                               (2/(counts[0] + counts[1]) * counts[1]) * 0.75]
     for (i = 0; i < init.length; i++) {
       init[i][11] = init[i][2] ? normalized_height[1] : normalized_height[0]
       init[i][12] = 1
     }
    }
    return init
  }

  // cascade a full run of the simulation
  // return the final data array and the total gene count
  data = create()
  data = sample(data)
  data = amplify(data)
  counts = count(data)
  data = stack(data, counts)
  data = stretch(data, counts)
  return {data: data, count: normalize(counts)}
}

module.exports = generate
