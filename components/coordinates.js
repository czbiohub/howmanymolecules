var d3 = require('d3')

var coordinates = {0: {}, 1: {}, 2: {}, histogram: null}

// cell #0

coordinates[0].cell = {
  x: d3.scaleLinear()
    .domain([-1, 1])
    .range([50, 250]),
  y: d3.scaleLinear()
    .domain([-1, 1])
    .range([50, 250])
}

coordinates[0].sample = {
  x: d3.scaleLinear()
    .domain([-1, 1])
    .range([50, 250]),
  y: d3.scaleLinear()
    .domain([-1, 1])
    .range([300, 500])
}

// cell #1

coordinates[1].cell = {
  x: d3.scaleLinear()
    .domain([-1, 1])
    .range([300, 500]),
  y: d3.scaleLinear()
    .domain([-1, 1])
    .range([50, 250])
}

coordinates[1].sample = {
  x: d3.scaleLinear()
    .domain([-1, 1])
    .range([300, 500]),
  y: d3.scaleLinear()
    .domain([-1, 1])
    .range([300, 500])
}

// cell #2

coordinates[2].cell = {
  x: d3.scaleLinear()
    .domain([-1, 1])
    .range([550, 750]),
  y: d3.scaleLinear()
    .domain([-1, 1])
    .range([50, 250])
}

coordinates[2].sample = {
  x: d3.scaleLinear()
    .domain([-1, 1])
    .range([550, 750]),
  y: d3.scaleLinear()
    .domain([-1, 1])
    .range([300, 500])
}

// histogram

coordinates['histogram'] = {
  x: d3.scaleLinear()
    .domain([0, 60])
    .range([50, 775])
    .clamp(true),
  y: d3.scaleLinear()
    .domain([0, 0.1])
    .range([700, 550])
    .clamp(true)
}
module.exports = coordinates