var css = require('dom-css')

function controls (opts) {
	if (!(this instanceof controls)) return new controls(opts)

	var box = document.createElement('div')

	var state = {}

	css(box, {
		backgroundColor: 'rgb(100,100,100)',
		width: '170px',
		height: '100%',
		position: 'absolute',
		left: '0px',
		top: '0px'
	})

	var expression = document.createElement('input')
	expression.type = 'range'
	box.appendChild(expression)

	var n_molecules = document.createElement('input')
	n_molecules.type = 'range'
	box.appendChild(n_molecules)

	var pcr = document.createElement('input')
	pcr.type = 'checkbox'
	box.appendChild(pcr)

	pcr.onchange = function (p) {
	state['pcr'] = p.target.value
	}
	n_molecules.onchange = function (n) {
		state['n_molecules'] = n.target.value
	}
	expression.onchange = function (e) {
		state['expression'] = e.target.value
	}
	this.state = state
	this.box = box

	console.log('state', this.state)
}

module.exports = controls
