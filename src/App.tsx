import React from 'react'
import { getPrefectures, getPopulation } from './api'
import { Population, Prefecture } from './types'
import './App.css'

function App() {
  const [prefectures, setPrefectures] = React.useState<Prefecture[]>([])

  React.useEffect(() => {
    getPrefectures().then((res) => {
      setPrefectures(res)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = parseInt(target.value)
    const prefIndex = prefectures.findIndex((prefecture) => prefecture.prefCode === value)
    const prefName = prefectures[prefIndex].prefName

    if (target.checked) {
      getPopulation(value).then((res) => {
        const population = res[0].data as Population[]
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`

        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  return (
    <div className="App">
      <div className="checkbox-container">
        {prefectures.map((prefecture) => {
          return (
            <div key={prefecture.prefCode}>
              <input type="checkbox" id={`${prefecture.prefCode}`} name={prefecture.prefName} value={prefecture.prefCode} onChange={handleCheck} />
              <label htmlFor={`${prefecture.prefCode}`}>{prefecture.prefName}</label>
            </div>
          )
        })}
      </div>
      <div className="graph-container">

      </div>
    </div>
  )
}

export default App
