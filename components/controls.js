var css = require('dom-css')
var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var _ = require('lodash')
var generate = require('./generate')


inherits(controls, EventEmitter)

function controls (opts) {
  if (!(this instanceof controls)) return new controls(opts)

  var self = this

  opts = opts || {}
  opts.root = opts.root || document.body

  function make_ctrlpanel(style_dict) {
    var box = document.createElement('div')
    css(box, style_dict)
    return {'box': box, 'values': {}, 'labels': {}, 'inputs': {}, 'group': {}}
  }

  var pop0_ctrl_style = {
    backgroundColor: '#FFFFFF',//rgb(200,200,200)',
    zIndex: '1000',
    width: '190px',
    height: '215px',
    position: 'absolute',
    left: '0px',
    top: '100px',
    borderRight: 'solid 4px #F768A1',
    borderTop: 'solid 4px #F768A1',
    borderBottom: 'solid 4px #F768A1',
    padding: '0px 0px 0px 10px',
  }

  var pop1_ctrl_style = {
    backgroundColor: '#FFFFFF',//rgb(200,200,200)',
    zIndex: '1000',
    width: '190px',
    height: '30%',
    position: 'absolute',
    right: '0px',
    top: '100px',
    borderLeft: 'solid 4px #B191DB',
    borderTop: 'solid 4px #B191DB',
    borderBottom: 'solid 4px #B191DB',
    padding: '0px 7px 0px 3px'
  }

  var shared_ctrl_style = {
    backgroundColor: '#FFFFFF',//rgb(200,200,200)',
    zIndex: '1000',
    width: '190px',
    height: '360px',
    position: 'absolute',
    left: '0px',
    top: '340px',
    borderRight: 'solid 4px #646464',
    borderBottom: 'solid 4px #646464',
    borderTop: 'solid 4px #646464',
    padding: '0px 0px 0px 10px',
  }

  var play_ctrl_style = {
    // backgroundColor: '#FFFFFF',//rgb(200,200,200)',
    // opacity: '.7',
    zIndex: '1000',
    width: '190px',
    padding: '0px 7px 0px 0px',
    height: '100px',
    position: 'absolute',
    right: '0px',
    top: '345px',
    padding: '0px 10px 0px 0px'
    // borderLeft: 'solid 4px #646464',
    // borderBottom: 'solid 4px #646464',
    // borderTop: 'solid 4px #646464',
  }

  var pop0_ctrls = make_ctrlpanel(pop0_ctrl_style)
  var pop1_ctrls = make_ctrlpanel(pop1_ctrl_style)
  var shared_ctrls = make_ctrlpanel(shared_ctrl_style)
  var play_ctrls = make_ctrlpanel(play_ctrl_style)

  var title = document.createElement('div')
    title.innerHTML = 'how many\nmolecules'
    title.style['font-weight'] = 'bold'
    title.style['font-size'] = '36px'
    title.style['height'] = '80px'
    title.style['width'] = '190px'
    title.style['padding'] = '0px 10px 0px 0px'
    title.style['align-items'] = 'center'
    opts.root.appendChild(title)

  // shared_ctrls['box'].appendChild(title)

  function make_ctrl (name, label, type, params, ctrlpanel) {
    ctrlpanel['group'][name] = document.createElement('div')
    css(ctrlpanel['group'][name], {
      marginBottom: '15px',
      marginTop: '5px',
    })
    ctrlpanel['box'].appendChild(ctrlpanel['group'][name])
    ctrlpanel['labels'][name] = document.createElement('div')
    ctrlpanel['labels'][name].innerHTML = label
    ctrlpanel['group'][name].appendChild(ctrlpanel['labels'][name])

    if (type == 'range') {
      ctrlpanel['inputs'][name] = document.createElement('input')
      ctrlpanel['inputs'][name].type = 'range'
      ctrlpanel['inputs'][name].min = params.min
      ctrlpanel['inputs'][name].max = params.max
      ctrlpanel['inputs'][name].step = params.step
      ctrlpanel['inputs'][name].value = params.value
      ctrlpanel['group'][name].appendChild(ctrlpanel['inputs'][name])
    }

    if (type == 'checkbox') {
      ctrlpanel['inputs'][name] = document.createElement('input')
      ctrlpanel['inputs'][name].type = 'checkbox'
      ctrlpanel['inputs'][name].checked = params.value
      ctrlpanel['group'][name].appendChild(ctrlpanel['inputs'][name])
    }

    ctrlpanel['values'][name] = document.createElement('div')
    if (type == 'range') {ctrlpanel['values'][name].innerHTML = ctrlpanel['inputs'][name].value}
    ctrlpanel['group'][name].appendChild(ctrlpanel['values'][name])
  }

  make_ctrl('nmolecules', 'Total molecules per cell', 'range', {min: 0, max: 100, value: 50, step: 1}, pop0_ctrls)
  make_ctrl('samples', 'Sampling depth', 'range', {min: 0, max: 1, value: 0.7, step: 0.01}, pop0_ctrls)
  make_ctrl('expression', 'Expression level', 'range', {min: 0, max: 1, value: .2, step: .01}, pop0_ctrls)

  make_ctrl('nmolecules', 'Total molecules per cell', 'range', {min: 0, max: 100, value: 50, step: 1}, pop1_ctrls)
  make_ctrl('samples', 'Sampling depth', 'range', {min: 0, max: 1, value: 0.7, step: 0.01}, pop1_ctrls)
  make_ctrl('expression', 'Expression level', 'range', {min: 0, max: 1, value: .2, step: .01}, pop1_ctrls)

  make_ctrl('pcr', 'Amplify? (PCR)', 'checkbox', {value: false}, shared_ctrls)
  make_ctrl('normalize', 'Normalize to counts/100?', 'checkbox', {value: false}, shared_ctrls)
  make_ctrl('log', 'Log-normalize?', 'checkbox', {value: false}, shared_ctrls)
  make_ctrl('comparepops', 'Compare two populations?', 'checkbox', {value: true}, shared_ctrls)
  make_ctrl('accumulate_history', 'Accumulate all samples?', 'checkbox', {value: false}, shared_ctrls)
  make_ctrl('showtrue', 'Show true distribution?', 'checkbox', {value: false}, shared_ctrls)


  button_style = {
    'font-weight': 'bold',
    'font-size': '20px',
    'text-align': 'center',
    'background-color': '#FFFFFF',
    'color': '#646464',
    'padding': '0px, 30px',
    'border-radius': '6px',
    'border': '2px solid #646464',
  }
  var play1x = document.createElement('button')
  play1x.innerHTML = 'Play 1x'
  css(play1x, button_style)
  play_ctrls['box'].appendChild(play1x)
  play_ctrls['inputs']['play1x'] = play1x

  var play3x = document.createElement('button')
  play3x.innerHTML = 'Play 3x'
  css(play3x, button_style)
  play_ctrls['box'].appendChild(play3x)
  play_ctrls['inputs']['play3x'] = play3x
  play3x.style['font-weight'] = 'bold'

  var play100x = document.createElement('button')
  play100x.innerHTML = 'Play 100x'
  css(play100x, button_style)
  play_ctrls['box'].appendChild(play100x)
  play_ctrls['inputs']['play100x'] = play100x
  play100x.style['font-weight'] = 'bold'

  var clear = document.createElement('button')
  clear.innerHTML = 'Clear'
  css(clear, button_style)
  play_ctrls['box'].appendChild(clear)
  play_ctrls['inputs']['clear'] = clear
  clear.style['font-weight'] = 'bold'


  var walkthrough = document.createElement('button')
  walkthrough.innerHTML = 'Walkthrough (tutorial)'
  walkthrough.disabled = true
  css(walkthrough, button_style)
  play_ctrls['box'].appendChild(walkthrough)
  play_ctrls['inputs']['walkthrough'] = walkthrough
  walkthrough.style['font-weight'] = 'bold'


  function naive_copy_obj (obj) {
    var new_obj = {}
    for (key in obj) {
      new_obj[key] = obj[key]
    }
    return new_obj
  }


  function generate_true_counts(state) {
      var true_pop0_params = naive_copy_obj(state['pop0_params'])
      true_pop0_params['samples'] = 1.0
      true_pop0_params['pcr'] = false

      true_pop0_counts = []
      for (cell in _.range(0, 2000)) {
        true_pop0_counts.push(generate(state['shared_params'], true_pop0_params).count)
      }

      state['pop0_params']['true_counts'] = true_pop0_counts

      if ( !state['shared_params']['comparepops']) {
        state['pop1_params']['true_counts'] = true_pop0_counts
      } else {
        var true_pop1_params = naive_copy_obj(state['pop1_params'])
        true_pop1_params['samples'] = 1.0
        true_pop1_params['pcr'] = false
        true_pop1_counts = []
        for (cell in _.range(0, 1000)) {
          true_pop1_counts.push(generate(state['shared_params'], true_pop1_params).count)
        }
        state['pop1_params']['true_counts'] = true_pop1_counts
      }
  }


  var state = {
    'shared_params': {
    'accumulate_history': shared_ctrls['inputs']['accumulate_history'].checked,
    'showtrue': shared_ctrls['inputs']['showtrue'].checked,
    'comparepops': shared_ctrls['inputs']['comparepops'].checked,
    'normalize': shared_ctrls['inputs']['normalize'].checked,
    'log': shared_ctrls['inputs']['log'].checked
  },
  'pop0_params': {
    'pcr': shared_ctrls['inputs']['pcr'].checked,
    'nmolecules': parseFloat(pop0_ctrls['inputs']['nmolecules'].value),
    'expression': parseFloat(pop0_ctrls['inputs']['expression'].value),
    'samples': parseFloat(pop0_ctrls['inputs']['samples'].value),
    'color': '#F768A1',
  },
}

function setup_pop1 (state) {
  if (state['shared_params']['comparepops'] == false) {
    state['pop1_params'] = state['pop0_params']
  } else {
    state['pop1_params'] = {
      'pcr': shared_ctrls['inputs']['pcr'].checked,
      'nmolecules': parseFloat(pop1_ctrls['inputs']['nmolecules'].value),
      'expression': parseFloat(pop1_ctrls['inputs']['expression'].value),
      'samples': parseFloat(pop1_ctrls['inputs']['samples'].value),
      'color': '#B191DB',
    }
  }
}

  setup_pop1(state)
  generate_true_counts(state)

  shared_ctrls['inputs']['pcr'].oninput = function (e) {
    state['pop0_params']['pcr'] = e.target.checked
    state['pop1_params']['pcr'] = e.target.checked
  }
  shared_ctrls['inputs']['showtrue'].oninput = function (e) {
    state['shared_params']['showtrue'] = e.target.checked
    self.emit('showtrue', e.target.checked)
  }
  shared_ctrls['inputs']['accumulate_history'].oninput = function (e) {
    state['shared_params']['accumulate_history'] = e.target.checked
  }
  shared_ctrls['inputs']['comparepops'].oninput = function (e) {
    self.emit('clear', true)
    state['shared_params']['comparepops'] = e.target.checked
    setup_pop1(state)

    pop1_ctrls['box'].style.borderLeft ='solid 4px ' + state['pop1_params']['color']
    pop1_ctrls['box'].style.borderBottom = 'solid 4px '+ state['pop1_params']['color']

    if (state['shared_params']['comparepops']) {
      pop1_ctrls['inputs']['nmolecules'].disabled = false
      pop1_ctrls['inputs']['expression'].disabled = false
      pop1_ctrls['inputs']['samples'].disabled = false
      pop1_ctrls['box'].style.opacity = 1

    } else {
      pop1_ctrls['inputs']['nmolecules'].disabled = true
      pop1_ctrls['inputs']['expression'].disabled = true
      pop1_ctrls['inputs']['samples'].disabled = true
      pop1_ctrls['box'].style.opacity = 0.5
    }

    }

  shared_ctrls['inputs']['normalize'].oninput = function (e) {
    self.emit('clear', true)
    state['shared_params']['normalize'] = e.target.checked
    self.emit('set_histogram', true)
    generate_true_counts(state)
  }
  shared_ctrls['inputs']['log'].oninput = function (e) {
    self.emit('clear', true)
    state['shared_params']['log'] = e.target.checked
    self.emit('set_histogram', true)
    generate_true_counts(state)
  }

  pop0_ctrls['inputs']['nmolecules'].oninput = function (e) {
    state['pop0_params']['nmolecules'] = parseFloat(e.target.value)
    pop0_ctrls['values']['nmolecules'].innerHTML = state['pop0_params']['nmolecules']
    generate_true_counts(state)
  }
  pop0_ctrls['inputs']['expression'].oninput = function (e) {
    state['pop0_params']['expression'] = parseFloat(e.target.value)
    pop0_ctrls['values']['expression'].innerHTML = state['pop0_params']['expression']
    generate_true_counts(state)
  }
  pop0_ctrls['inputs']['samples'].oninput = function (e) {
    state['pop0_params']['samples'] = parseFloat(e.target.value)
    pop0_ctrls['values']['samples'].innerHTML = state['pop0_params']['samples']
    generate_true_counts(state)
  }


  pop1_ctrls['inputs']['nmolecules'].oninput = function (e) {
    state['pop1_params']['nmolecules'] = parseFloat(e.target.value)
    pop1_ctrls['values']['nmolecules'].innerHTML = state['pop1_params']['nmolecules']
    generate_true_counts(state)
  }
  pop1_ctrls['inputs']['expression'].oninput = function (e) {
    state['pop1_params']['expression'] = parseFloat(e.target.value)
    pop1_ctrls['values']['expression'].innerHTML = state['pop1_params']['expression']
    generate_true_counts(state)
  }
  pop1_ctrls['inputs']['samples'].oninput = function (e) {
    state['pop1_params']['samples'] = parseFloat(e.target.value)
    pop1_ctrls['values']['samples'].innerHTML = state['pop1_params']['samples']
    generate_true_counts(state)
  }

  play1x.onclick = function (e) {
    self.emit('play', '1x')
  }
  play3x.onclick = function (e) {
    self.emit('play', '3x')
  }
  play100x.onclick = function (e) {
    self.emit('play', '100x')
  }
  clear.onclick = function (e) {
    self.emit('clear', true)
  }

  opts.root.appendChild(pop0_ctrls['box'])
  opts.root.appendChild(pop1_ctrls['box'])
  opts.root.appendChild(shared_ctrls['box'])
  opts.root.appendChild(play_ctrls['box'])
  self.state = state
  self.shared_ctrls = shared_ctrls
  self.pop0_ctrls = pop0_ctrls
  self.pop1_ctrls = pop1_ctrls
  self.play_ctrls = play_ctrls
}

module.exports = controls
