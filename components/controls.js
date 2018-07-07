var css = require('dom-css')

function controls (opts) {
  if (!(this instanceof controls)) return new controls(opts)

  opts = opts || {}
  opts.root = opts.root || document.body

  var box = document.createElement('div')

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
  expression.min = 0
  expression.max = 500
  box.appendChild(expression)

  var molecules = document.createElement('input')
  molecules.type = 'range'
  molecules.min = 0
  molecules.max = 1
  molecules.step = 0.1
  box.appendChild(molecules)

  var pcr = document.createElement('input')
  pcr.type = 'checkbox'
  box.appendChild(pcr)

  var state = {
    'pcr': pcr.value,
    'expression': parseFloat(expression.value),
    'molecules': parseFloat(molecules.value)
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

  opts.root.appendChild(box)

  this.state = state
  this.box = box
}

module.exports = controls
