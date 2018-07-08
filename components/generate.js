var _ = require('lodash')
var prob = require('prob.js')

// generate underlying data for all stages of a simulation
function generate (params) {
	var data = {}

	// stage one
	// create n total molecules with u expressing gene of interest
	// store as [x, y, label]
	function one () {
		var n = params.molecules
		var u = params.expression
		var rand = prob.uniform(0, 1)
		var e = prob.poisson(u)()
		if (e > n) e = n
		var data = Array(n).fill(0).map(function (d, i) {
			var r = 1 * Math.sqrt(rand())
			var t = rand() * 2 * Math.PI
			var x = r * Math.cos(t)
			var y = r * Math.sin(t)
			if (i <= e) return [x, y, 1]
			return [x, y, 0]
		})
		data = _.shuffle(data)
		return data
	}

	// stage two
	// sample n total molecules with u expression gene of interest
	// store as [x, y, label]
	function two (init) {
		var n = Math.round(params.molecules * params.samples)
		var samples = _.take(init, n)
		return samples
	}

	// stage three
	// apply PCR to a random subset of molecules
	// store as [x, y, label]
	function three (init) {
		var r = prob.uniform(0, 1)
		var additional = _.map(init, function (d) {
			if (r() > 0) {
				return [d[0]+0.05, d[1]+0.05, d[2]]
			}
		})
		var amplified = _.compact(_.concat(init, additional))
		return amplified
	}

	data.one = one()
	data.two = two(data.one)
	data.three = three(data.two)
	// data.four = four(data.three)
	return data
}

module.exports = generate