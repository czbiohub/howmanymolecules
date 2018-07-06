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

	expression.onchange = function (e) {
		state['expression'] = e.target.value
	}

	this.state = state
	this.box = box
}

module.exports = controls