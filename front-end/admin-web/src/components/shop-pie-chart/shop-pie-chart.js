import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { formatTextNumber, getCurrency } from 'utils/helpers'
import i18n from 'utils/i18n'
import './shop-pie-chart.scss'

ChartJS.register(ArcElement, Tooltip, Legend)

/**
 * Follow docs: https://apexcharts.com/docs/options/legend/
 * @param {} props {dataSource}
 * @returns
 */
export function FnbPieChart (props) {
  const {
    className,
    title,
    dataSource,
    width,
    ratioMobile,
    height,
    descriptions,
    showDefaultLegend,
    legend,
    plotOptions,
    totalRevenue,
    isShowTotalRevenue
  } = props
  const [key, setKey] = useState(Math.random())
  const getChartSettings = () => {
    const labels = dataSource?.map((item) => item?.label)
    const colors = dataSource?.map((item) => item?.color)
    const totalValue = dataSource?.reduce((a, b) => a + (b?.value || 0), 0)
    const widthScreen = window.innerWidth || width

    const settings = {
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        }
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val) {
            if (val === totalValue) {
              return 100 + '%'
            }

            const percent = (val / totalValue) * 100
            return percent.toFixed(2) + '%'
          },
          title: {
            formatter: function (seriesName) {
              return seriesName + ''
            }
          }
        }
      },
      labels,
      colors,
      chart: {
        type: 'line',
        width: '100px',
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false
        },
        events: {
          animationEnd: function (ctx) {
            ctx.toggleDataPointSelection(0, 0)
          }
        }
      },
      stroke: {
        show: false
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          customScale: 1,
          startAngle: 0,
          offsetX: 0,
          offsetY: 0,
          endAngle: 360,
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {},
              value: {
                fontSize: '18px',
                fontWeight: '500',
                color: '#A5ABDE'
              },
              total: {
                show: true,
                showAlways: true,
                label: isShowTotalRevenue
                  ? `${formatTextNumber(totalRevenue)} ${getCurrency()}`
                  : `${formatTextNumber(totalValue)} ${getCurrency()}`,
                fontSize: '20px',
                fontWeight: '800',
                lineHeight: '25px',
                color: '#50429B',
                formatter: (w) => {
                  return title
                }
              }
            }
          },
          ...plotOptions?.pie
        }
      },
      dataLabels: {
        enabled: false,
        formatter: function (val, opts) {
          return `${Math.floor(val)}%`
        },
        dropShadow: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              width: (widthScreen * ratioMobile) / 100 || width
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      legend: {
        show: !!showDefaultLegend,
        showForSingleSeries: false,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'right',
        horizontalAlign: 'center',
        floating: true,
        inverseOrder: false,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        customLegendItems: [],
        offsetX: 0,
        offsetY: 0,
        formatter: function (seriesName, opts) {
          return [seriesName, ' - ', opts.w.globals.series[opts.seriesIndex], getCurrency()]
        },
        labels: {
          colors: undefined,
          useSeriesColors: false
        },
        itemMargin: {
          horizontal: 0,
          vertical: 10
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: undefined,
          radius: 12,
          customHTML: undefined,
          onClick: undefined,
          offsetX: 0,
          offsetY: 0
        },
        ...legend
      }
    }
    return settings
  }

  useEffect(() => {
    setKey(Math.random())
  }, [i18n.language])

  const getChartSeries = () => {
    if (dataSource) {
      return dataSource?.map((item) => {
        return item?.value
      })
    }

    return []
  }

  return (
    <div className={className} style={{ width }}>
      <Chart
        key={key}
        className="shop-pie-chart"
        series={getChartSeries()}
        options={getChartSettings()}
        type="donut"
        height={height}
        width={width}
      />
      <div className="chart-description-wrapper">{descriptions}</div>
    </div>
  )
}
