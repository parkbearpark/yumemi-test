import React from 'react'
import ReactLoading from 'react-loading'
import { Population, Prefecture, PopResult } from './types'
import { getPrefectures, getPopulation } from './helpers/api'
import './App.scss'
import { Selecter } from './components/Selecter'
import { Graph } from './components/Graph'

function App() {
  const wholeData = React.useMemo(() => {
    return {} as { [prefCode: number]: { [label: string]: Population[] } }
  }, [])

  React.useEffect(() => {
    Object.keys(regions).forEach((region) => {
      const prefectures = regions[region]
      prefectures.forEach((prefecture) => {
        getPopulation(prefecture.prefCode)
          .then((res: PopResult[]) => {
            wholeData[prefecture.prefCode] = {}
            res.forEach((result) => {
              wholeData[prefecture.prefCode][result.label] = result.data
            })
          })
          .catch((err) => {
            console.log(err)
          })
      })
    })
  }, [regions, wholeData])

  React.useEffect(() => {
    if (selectedPrefectures.length === 0) return

    setChartData({
      labels: [],
      datasets: [],
    })

    const prefectures = selectedPrefectures
    prefectures.forEach((prefecture, index) => {
      const population = wholeData[prefecture.prefCode][selectedLabel]
      const color = `#${(Math.floor(index) * 360).toString(16)}`
      setChartData((prevData) => {
        return {
          datasets: [
            ...prevData.datasets,
            {
              label: prefecture.prefName,
              data: population.map((population) => population.value),
              type: 'line',
              borderColor: color,
              backgroundColor: color,
              fill: false,
            },
          ],
          labels: population.map((population) => String(population.year)),
        }
      })
    })
  }, [selectedPrefectures, selectedLabel, wholeData])

  React.useEffect(() => {
    const prefData = chartData.datasets.filter((dataset) => {
      return (
        selectedPrefectures.findIndex((pref) => {
          return pref.prefName === dataset.label
        }) === -1
      )
    })[0]
    if (prefData === undefined) return

    const prefName = prefData.label
    setChartData({
      labels: chartData.labels,
      datasets: chartData.datasets.filter((dataset) => {
        console.log(dataset.label, prefName, dataset.label !== prefName)
        return dataset.label !== prefName
      }),
    })
  }, [selectedPrefectures, chartData])

  return (
    <div className="App">
      {Object.keys(regions).length === 0 && (
        <ReactLoading className="loading" type="spin" color="#000" />
      )}
    </div>
  )
}

export default App
