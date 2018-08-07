var css = require('dom-css')
var controls = require('./components/controls')()
var simulation = require('./components/simulation')

simulation(controls)

document.body.style['background'] = 'rgb(240,240,240)'
document.body.style['font-family'] = 'Helvetica'
document.body.style['font-weight'] = 'bold'
document.body.style['color'] = '#646464'
