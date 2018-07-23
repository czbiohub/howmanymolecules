var css = require('dom-css')
var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter

inherits(controls, EventEmitter)

function controls (opts) {
  if (!(this instanceof controls)) return new controls(opts)

  var self = this

  opts = opts || {}
  opts.root = opts.root || document.body

  var box = document.createElement('div')
  var values = {}
  var labels = {}
  var inputs = {}
  var group = {}

  css(box, {
    backgroundColor: 'rgb(200,200,200)',
    width: '170px',
    height: '100%',
    position: 'absolute',
    left: '0px',
    top: '0px',
    borderRight: 'solid 4px rgb(100,100,100)'
  })

  var title = document.createElement('div')
  title.innerHTML = 'howmanymolecules'
  box.appendChild(title)

  function make (name, type, params) {
    group[name] = document.createElement('div')
    css(group[name], {
      marginBottom: '10px',
      marginTop: '10px'
    })
    box.appendChild(group[name])

    labels[name] = document.createElement('div')
    labels[name].innerHTML = name
    group[name].appendChild(labels[name])

    if (type == 'range') {
      inputs[name] = document.createElement('input')
      inputs[name].type = 'range'
      inputs[name].min = params.min
      inputs[name].max = params.max
      inputs[name].step = params.step
      inputs[name].value = params.value
      group[name].appendChild(inputs[name])
    }

    if (type == 'checkbox') {
      inputs[name] = document.createElement('input')
      inputs[name].type = 'checkbox'
      inputs[name].checked = params.value
      group[name].appendChild(inputs[name])
    }
    
    values[name] = document.createElement('div')
    values[name].innerHTML = inputs[name].value
    group[name].appendChild(values[name])
  }

  make('molecules', 'range', {min: 0, max: 100, value: 50, step: 1})
  make('expression', 'range', {min: 0, max: 100, value: 10, step: 1})
  make('samples', 'range', {min: 0, max: 1, value: 0.7, step: 0.01})
  make('pcr', 'checkbox', {value: true})

  
  var play1x = document.createElement('button')
  play1x.innerHTML = 'play 1x'
  box.appendChild(play1x)

  var play3x = document.createElement('button')
  play3x.innerHTML = 'play 3x'
  box.appendChild(play3x)

  var play10x = document.createElement('button')
  play10x.innerHTML = 'play 10x'
  box.appendChild(play10x)

  var play100x = document.createElement('button')
  play100x.innerHTML = 'play 100x'
  box.appendChild(play100x)

  var clear = document.createElement('button')
  clear.innerHTML = 'clear'
  box.appendChild(clear)

  var state = {
    'pcr': inputs['pcr'].value,
    'molecules': parseFloat(inputs['molecules'].value),
    'expression': parseFloat(inputs['expression'].value),
    'samples': parseFloat(inputs['samples'].value),
  }

  inputs['pcr'].oninput = function (e) {
    state['pcr'] = e.target.checked
  }
  inputs['molecules'].oninput = function (e) {
    state['molecules'] = parseFloat(e.target.value)
    values['molecules'].innerHTML = state['molecules']
  }
  inputs['expression'].oninput = function (e) {
    state['expression'] = parseFloat(e.target.value)
    values['expression'].innerHTML = state['expression']
  }
  inputs['samples'].oninput = function (e) {
    state['samples'] = parseFloat(e.target.value)
    values['samples'].innerHTML = state['samples']
  }

  play1x.onclick = function (e) {
    self.emit('play', '1x')
  }
  play3x.onclick = function (e) {
    self.emit('play', '3x')
  }
  play10x.onclick = function (e) {
    self.emit('play', '10x')
  }
  play100x.onclick = function (e) {
    self.emit('play', '100x')
  }
  clear.onclick = function (e) {
    self.emit('clear', true)
  }

  opts.root.appendChild(box)

  self.state = state
  self.box = box
}

module.exports = controls
