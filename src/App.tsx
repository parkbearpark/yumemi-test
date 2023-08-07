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
  const populationTypes = ['総人口', '年少人口', '生産年齢人口', '老年人口'] as const
  type populationType = typeof populationTypes[number]

  const [regions, setRegions] = React.useState<RegionMapType>({})
  const [chartData, setChartData] = React.useState<ChartData<'line', number[], string>>({
    labels: [],
    datasets: [],
  })
  const [selectedPopType, setSelectedPopType] = React.useState<populationType>(populationTypes[0])

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

  const updatePopulationChart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const prefCode = parseInt(target.getAttribute('data-code') as string)
    const prefName = target.getAttribute('data-name') as string

    if (target.checked) {
      getPopulation(prefCode).then((res: PopResult[]) => {
        const population: Population[] = res.filter((result) => {
          return result.label === selectedPopType
        })[0].data
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

  const handlePopType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = target.value as populationType
    setSelectedPopType(value)
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
                        onChange={updatePopulationChart}
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
          {populationTypes.map((popType) => {
            return (
              <div key={popType}>
                <input type="checkbox" id={`${popType}`} name={popType} value={popType} onChange={handlePopType} checked={popType === selectedPopType} />
                <label htmlFor={`${popType}`}>{popType}</label>
              </div>
            )}
          )}
        </div>
      </div>
    </div>
  )
}

export default App
