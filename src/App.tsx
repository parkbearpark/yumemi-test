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

  const wholeData = React.useMemo(() => {return {} as {[prefCode: number]: {[label: string]: Population[] } } }, [])

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
      return res
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  React.useEffect(() => {
    Object.keys(regions).forEach((region) => {
      const prefectures = regions[region]
      prefectures.forEach((prefecture) => {
        getPopulation(prefecture.prefCode).then((res: PopResult[]) => {
          wholeData[prefecture.prefCode] = {}
          res.forEach((result) => {
            wholeData[prefecture.prefCode][result.label] = result.data
          })
        }).catch((err) => {
          console.log(err)
        })
      }
    )})
  }, [regions, wholeData])

  React.useEffect(() => {
    if (selectedPrefectures.length === 0) return

    setChartData({
      labels: [],
      datasets: []
    })

    const prefectures = selectedPrefectures
    prefectures.forEach((prefecture, index) => {
      const population = wholeData[prefecture.prefCode][selectedLabel]
      const color = `#${(Math.floor(index) * 360).toString(16)}`
      setChartData((prevData) => {
        return {
          datasets: [...prevData.datasets,
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
      return selectedPrefectures.findIndex((pref) => {
        return pref.prefName === dataset.label
      }) === -1
    })[0]
    if (prefData === undefined) return

    const prefName = prefData.label
    setChartData({
      labels: chartData.labels,
      datasets: chartData.datasets.filter((dataset) => {
        console.log(dataset.label, prefName, dataset.label !== prefName)
        return dataset.label !== prefName
      })
    })
  }, [selectedPrefectures, chartData])

  const handlePrefectures = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const prefecture = {
      prefCode: parseInt(target.getAttribute('data-code') as string),
      prefName: target.getAttribute('data-name') as string
    }

    if (target.checked) {
      setSelectedPrefectures([...selectedPrefectures, prefecture])
    } else {
      setSelectedPrefectures(selectedPrefectures.filter((pref) => {
        return pref.prefCode !== prefecture.prefCode
      }))
    }
  }

  const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = target.value as labelType

    setSelectedLabel(value)
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
