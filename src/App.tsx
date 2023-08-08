// TODO: 都道府県を選択 -> 人口構成タイプを変更したときにグラフを更新する
// 描画の部分を別に分ければ良い

// TODO: デフォルトのグラフの描画

// TODO: スタイリング

import React from 'react'
import 'chart.js/auto'
import { ChartData } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Population, Prefecture, PopResult, RegionMapType } from './types'
import { getPrefectures, getPopulation } from './helpers/api'
import { getRegion } from './helpers/region'
import './App.scss'

function App() {
  const labelTypes = ['総人口', '年少人口', '生産年齢人口', '老年人口'] as const
  type labelType = typeof labelTypes[number]

  const [regions, setRegions] = React.useState<RegionMapType>({})
  const [chartData, setChartData] = React.useState<ChartData<'line', number[], string>>({
    labels: [],
    datasets: [],
  })
  const [selectedLabel, setSelectedLabel] = React.useState<labelType>(labelTypes[0])
  const [selectedPrefectures, setSelectedPrefectures] = React.useState<Prefecture[]>([])

  React.useEffect(() => {
    getPrefectures().then((res) => {
      res.forEach((prefecture: Prefecture) => {
        const regionName = getRegion(prefecture.prefName)
        setRegions(prevRegions => {
          return {
            ...prevRegions,
            [regionName]: [...(prevRegions[regionName] || []), prefecture]
          }
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  const addPrefToChart = (prefecture: Prefecture, label: labelType) => {
    getPopulation(prefecture.prefCode).then((res: PopResult[]) => {
      const population: Population[] = res.filter((result) => {
        return result.label === label
      })[0].data
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`

      setChartData((prevData) => {
        return {
          labels: population.map((population) => `${population.year}`),
          datasets: [...prevData.datasets,
             {
              label: prefecture.prefName,
              data: population.map((population) => population.value),
              type: 'line',
              borderColor: color,
              backgroundColor: color,
              fill: false,
            }
          ]
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  const erasePrefFromChart = (prefecture: Prefecture) => {
    const prefName = prefecture.prefName
    setChartData({
      labels: chartData.labels,
      datasets: chartData.datasets.filter((dataset) => {
        console.log(dataset.label, prefName, dataset.label !== prefName)
        return dataset.label !== prefName
      })
    })
  }

  const handlePrefectures = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const prefecture = {
      prefCode: parseInt(target.getAttribute('data-code') as string),
      prefName: target.getAttribute('data-name') as string
    }

    if (target.checked) {
      setSelectedPrefectures([...selectedPrefectures, prefecture])
      addPrefToChart(prefecture, selectedLabel)
    } else {
      setSelectedPrefectures(selectedPrefectures.filter((pref) => {
        return pref.prefCode !== prefecture.prefCode
      }))
      erasePrefFromChart(prefecture)
    }
  }

  const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = target.value as labelType

    setSelectedLabel(value)
    setChartData({
      labels: [],
      datasets: []
    })
    selectedPrefectures.forEach((prefecture) => {
      addPrefToChart(prefecture, value)
    })
  }

  return (
    <div className="App">
      <div className="prefectures">
        <ul className="prefectures__container">
          {Object.keys(regions).map((regionName) => {
            return (
              <details key={regionName}>
                <summary>{regionName}</summary>
                <div>
                  {regions[regionName].map((prefecture) => (
                    <div key={prefecture.prefCode}>
                      <input
                        type="checkbox"
                        id={prefecture.prefName}
                        name={prefecture.prefName}
                        data-code={prefecture.prefCode}
                        data-name={prefecture.prefName}
                        onChange={handlePrefectures}
                      />
                      <label htmlFor={prefecture.prefName}>{prefecture.prefName}</label>
                    </div>
                  ))}
                </div>
              </details>
            )}
          )}
        </ul>
      </div>
      <div className="graph-container">
        {chartData !== null && <Line data={chartData} />}

        <div>
          {labelTypes.map((label) => {
            return (
              <div key={label}>
                <input type="radio" id={`${label}`} name={label} value={label} onChange={handleLabel} checked={selectedLabel === label} />
                <label htmlFor={`${label}`}>{label}</label>
              </div>
            )}
          )}
        </div>
      </div>
    </div>
  )
}

export default App
