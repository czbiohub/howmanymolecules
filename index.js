var controls = require('./components/controls')

var panel = controls()

setInterval(function () {
	console.log(panel.state.expression)	
}, 100)

document.body.appendChild(panel.box)