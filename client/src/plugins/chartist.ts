import Chartist, { ChartistStatic, IChartistBase } from 'chartist'

export function ctPointLabels(options: any = {}) {
  return function ctPointLabels(chart: IChartistBase<any>) {
    var defaultOptions = {
      labelClass: 'point-label',
      labelOffset: {
        x: 0,
        y: -10
      },
      textAnchor: 'middle'
    }

    options = Chartist.extend({}, defaultOptions, options)

    if (chart instanceof Chartist.Line) {
      chart.on('draw', function(data: any) {
        if (data.type === 'point') {
          data.group
            .elem(
              'text',
              {
                x: data.x + options.labelOffset.x,
                y: data.y + options.labelOffset.y,
                style: 'text-anchor: ' + options.textAnchor
              },
              options.labelClass
            )
            .text(data.value.y)
        }
      })
    }
    if (chart instanceof Chartist.Bar) {
      chart.on('draw', function(data:any) {
        if (data.type === 'bar') {
          data.group
            .elem(
              'text',
              {
                x: (data.x === undefined ? data.x1 : data.x) + options.labelOffset.x,
                y: (data.y === undefined ? data.y2 : data.y) + options.labelOffset.y,
                style: 'text-anchor: ' + options.textAnchor
              },
              options.labelClass
            )
            .text(data.value.y)
        }
      })
    }
  }
}

export function ratioLabels(options: any = {}) {
  return function ratioLabels(chart: IChartistBase<any>) {
    var defaultOptions = {
      labelClass: 'ratio-label',
      labelOffset: {
        x: 10,
        y: 15
      },
      textAnchor: 'right'
    }

    options = Chartist.extend({}, defaultOptions, options)

    if (chart instanceof Chartist.Line) {
      chart.on('draw', function(data: any) {
        if (data.type === 'point') {
          data.group
            .elem(
              'text',
              {
                x: data.x + options.labelOffset.x,
                y: data.y + options.labelOffset.y,
                style: 'text-anchor: ' + options.textAnchor
              },
              options.labelClass
            )
            .text(data.value.y ? `${Math.round((data.value.y / data.series[0]) * 100)}% ` : '')
        }
      })
    }
  }
}
