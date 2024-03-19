import { useState, useEffect } from 'react'
import ReactLoading from 'react-loading'
import { useRegions } from './hooks/useRegions'
import { Prefecture, labelType } from './types'
import './App.scss'
import { labels } from './helpers/labels'
import { Selecter } from './components/Selecter'
import { ChartData } from 'chart.js'
import { Graph } from './components/Graph'

function App() {
  const { regions, populations } = useRegions()
  const [selectedLabel, setSelectedLabel] = useState<labelType>(labels[0])
  const [selectedPrefectures, setSelectedPrefectures] = useState<Prefecture[]>(
    []
  )

  const [chartData, setChartData] = useState<
    ChartData<'line', number[], string>
  >({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    if (selectedPrefectures.length === 0) return

    setChartData({
      labels: [],
      datasets: [],
    })

    selectedPrefectures.forEach((prefecture, index) => {
      const population = populations[prefecture.prefCode][selectedLabel]
      console.log(population)
      const popValue = population.map((pop) => pop.value)
      const yearRange = population.map((pop) => pop.year)
      const color = `#${(Math.floor(index) * 360).toString(16)}`
      setChartData((prevData) => {
        return {
          datasets: [
            ...prevData.datasets,
            {
              label: prefecture.prefName,
              data: popValue,
              type: 'line',
              borderColor: color,
              backgroundColor: color,
              fill: false,
            },
          ],
          labels: yearRange,
        }
      })
      console.log(population, color)
    })
  }, [selectedPrefectures, populations, selectedLabel])

  const handlePrefectures = (prefecture: Prefecture) => {
    if (
      selectedPrefectures.find((pref) => pref.prefCode === prefecture.prefCode)
    ) {
      setSelectedPrefectures(
        selectedPrefectures.filter((pref) => {
          return pref.prefCode !== prefecture.prefCode
        })
      )
    } else {
      setSelectedPrefectures([...selectedPrefectures, prefecture])
    }
  }

  const handleLabel = (label: labelType) => {
    setSelectedLabel(label)
  }

  return (
    <div className="App">
      {Object.keys(regions).length === 0 && (
        <ReactLoading className="loading" type="spin" color="#000" />
      )}
      <Selecter
        regions={regions}
        labels={labels}
        selectedLabel={selectedLabel}
        onPrefectureSelected={handlePrefectures}
        onLabelSelected={handleLabel}
      />
      <Graph chartData={chartData} />
    </div>
  )
}

export default App
