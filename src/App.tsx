import React from 'react'
import 'chart.js/auto'
import { ChartData } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { getPrefectures, getPopulation } from './api'
import { Population, Prefecture } from './types'
import './App.css'

function App() {
  const [prefectures, setPrefectures] = React.useState<Prefecture[]>([])
  const [chartData, setChartData] = React.useState<ChartData<'line', number[], string>>({
    labels: [],
    datasets: [],
  })

  React.useEffect(() => {
    getPrefectures().then((res) => {
      setPrefectures(res)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  const updatePopulationChart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = parseInt(target.value)
    const prefIndex = prefectures.findIndex((prefecture) => prefecture.prefCode === value)
    const prefName = prefectures[prefIndex].prefName

    if (target.checked) {
      getPopulation(value).then((res) => {
        const population = res[0].data as Population[]
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`

        setChartData({
          labels: population.map((population) => `${population.year}`),
          datasets: [...chartData.datasets,
             {
              label: prefName,
              data: population.map((population) => population.value),
              type: 'line',
              borderColor: color,
              backgroundColor: color,
              fill: false,
            }
          ]
        })
      }).catch((err) => {
        console.log(err)
      })
    } else {
      setChartData({
        labels: chartData.labels,
        datasets: chartData.datasets.filter((dataset) => {
          return dataset.label !== prefName
        })
      })
    }
  }

  return (
    <div className="App">
      <div className="checkbox-container">
        {prefectures.map((prefecture) => {
          return (
            <div key={prefecture.prefCode}>
              <input type="checkbox" id={`${prefecture.prefCode}`} name={prefecture.prefName} value={prefecture.prefCode} onChange={updatePopulationChart} />
              <label htmlFor={`${prefecture.prefCode}`}>{prefecture.prefName}</label>
            </div>
          )
        })}
      </div>
      <div className="graph-container">
        {chartData !== null && <Line data={chartData} />}
      </div>
    </div>
  )
}

export default App
