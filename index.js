var css = require('dom-css')
var controls = require('./components/controls')()
var simulation = require('./components/simulation')

simulation(controls)

css(document.body, {
	background : 'rgb(240,240,240)'
})