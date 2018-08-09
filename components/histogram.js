var d3 = require('d3')
var _ = require('lodash')

function histogram (svg, counts, coords, duration, history, color, index, true_distrib_boolean) {

	// create histogram with ticks and density estimate

	// add an index to each element of count vector for correct data binding
  var currentCounts = counts.map(function (d, i) {return {name: i, value: d}})

  var count = svg.selectAll('.count'+index)
    .data(_.takeRight(currentCounts, history[0]), function (d) {return d.name})

  count.enter().append('circle')
    .attr('class', 'count'+index)
    .attr('r', 0)
    .attr('cx', function (d) {return coords.x(d.value)})
    .attr('cy', function (d) {return coords.y(0.01)})
    .attr('transform', 'translate(0,5)')
    .style('fill', color)
    .style('opacity', 0.75)
  .transition()
    .delay(duration - duration * 0.1)
    .attr('r', 10)

  var count = svg.selectAll('.count'+index)
    .data(_.takeRight(currentCounts, history[0] - 1), function (d) {return d.name})
    .exit()
    .transition()
    .delay(duration - duration * 0.1)
    .attr('r', 0)
    .remove()

  var it = setTimeout(function () {
    update()
  }, duration - duration * 0.1)

  function update () {
    var vals = _.takeRight(currentCounts, history[1]).map(function (d) {return d.value})
    var n = vals.length
    var density = kde(epanechnikov(4), coords.x.ticks(40))(vals)

    svg.selectAll('.path' + index).remove()


    if (true_distrib_boolean == true) {
      var opacity = 0.7
      var dasharray="10,10"
    } else {
      var opacity = 1
      var dasharray=null
    }

    svg.append('path')
      .datum(density)
      .attr('opacity', opacity)
      .attr('stroke-dasharray', dasharray)
      .attr('class', 'path' + index)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('d',  d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return coords.x(d[0]) })
        .y(function(d) { return coords.y(d[1]) }))
  }

  function kde (kernel, X) {
    return function (V) {
      return X.map(function (x) {
        return [x, d3.mean(V, function(v) { return kernel(x - v) })]
      })
    }
  }

  function epanechnikov (k) {
    return function (v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0
    }
  }

  return it
}

module.exports = histogram
