var _ = require('lodash')
var prob = require('prob.js')

// generate underlying data for all stages of a simulation
// we think of each molecule as a particle
// data structure precomputes all neccessary information for each particle
// [x0, y0, label, x1, y1, sample, copy]
// 
function generate (params) {
	var data

	// stage one
	// create n total molecules with u expressing gene of interest
	function one () {
		var n = params.molecules
		var u = params.expression
		var rand = prob.uniform(0, 1)
		var rand2 = prob.uniform(100, 400)
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
	// sample n total molecules with u expression gene of interest
	// store as [x, y, label]
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
	// store as [x, y, label]
	function three (init) {
		var r = prob.uniform(0, 1)
		var init = _.map(init, function (d) {
			return _.concat(d, 0)
		})
		var additional = _.map(init, function (d) {
			if (r() > 0.5) {
				return _.concat(d.slice(0, 6), 1)
			}
		})
		var amplified = _.compact(_.concat(init, additional))
		return amplified
	}


	function four (init) {
		// count ignores those removed during sampling
		var filtered = _.filter(init, function (d) {return d[5] == 1})
		var counts = _.countBy(filtered, function (d) {return d[2]}) 
		return counts
	}

	function five (init, counts) {
		// normalize based on larger count
		var w = Math.min(((counts[1] > counts[0]) ? (2 / counts[1]) : (2 / counts[0])) * 0.8, 0.05)
		var dy0 = -0.75
		var dy1 = -0.75
		for (i = 0; i < init.length; i++) { 
    	if (init[i][2]) {
    		init[i][7] = 0.25
    		init[i][8] = dy1
    		init[i][9] = counts[1]
    		if (init[i][5] == 1) dy1 += w
    	} else {
    		init[i][7] = -0.25
    		init[i][8] = dy0
    		init[i][9] = counts[0]
    		if (init[i][5] == 1) dy0 += w
    	}
		}
		return init
	}


	data = one()
	data = two(data)
	data = three(data)
	counts = four(data)
	data = five(data, counts)
	return {data: data, count: counts[1]}
}

module.exports = generate