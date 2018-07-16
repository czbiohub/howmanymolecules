var css = require('dom-css')

function controls (opts) {
  if (!(this instanceof controls)) return new controls(opts)

  opts = opts || {}
  opts.root = opts.root || document.body

  var box = document.createElement('div')

  css(box, {
    backgroundColor: 'rgb(200,200,200)',
    width: '170px',
    height: '100%',
    position: 'absolute',
    left: '0px',
    top: '0px',
    borderRight: 'solid 4px rgb(100,100,100)'
  })

  var label = document.createElement('div')
  label.innerHTML = 'molecules'
  box.appendChild(label)

  var molecules = document.createElement('input')
  molecules.type = 'range'
  molecules.min = 0
  molecules.max = 100
  molecules.value = 50
  molecules.step = 1
  box.appendChild(molecules)

  var label = document.createElement('div')
  label.innerHTML = 'expression'
  box.appendChild(label)

  var expression = document.createElement('input')
  expression.type = 'range'
  expression.min = 0
  expression.max = 100
  expression.value = 10
  expression.step = 1
  box.appendChild(expression)

  var label = document.createElement('div')
  label.innerHTML = 'samples'
  box.appendChild(label)

  var samples = document.createElement('input')
  samples.type = 'range'
  samples.min = 0
  samples.max = 1
  samples.step = 0.1
  box.appendChild(samples)

  var label = document.createElement('div')
  label.innerHTML = 'PCR'
  box.appendChild(label)

  var pcr = document.createElement('input')
  pcr.type = 'checkbox'
  box.appendChild(pcr)

  var state = {
    'pcr': pcr.value,
    'molecules': parseFloat(molecules.value),
    'expression': parseFloat(expression.value),
    'samples': parseFloat(samples.value)
  }

  pcr.onchange = function (p) {
    state['pcr'] = p.target.value
  }
  molecules.onchange = function (n) {
    state['molecules'] = parseFloat(n.target.value)
  }
  expression.onchange = function (e) {
    state['expression'] = parseFloat(e.target.value)
  }
  samples.onchange = function (e) {
    state['samples'] = parseFloat(e.target.value)
  }

  opts.root.appendChild(box)

  this.state = state
  this.box = box
}

module.exports = controls
