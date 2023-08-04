import React from 'react'
import { getPrefectures } from './api'
import { Prefecture } from './types'
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

  return (
    <div className="App">
      <div className="checkbox-container">
        {prefectures.map((prefecture) => {
          return (
            <div key={prefecture.prefCode}>
              <input type="checkbox" id={`${prefecture.prefCode}`} name={prefecture.prefName} value={prefecture.prefCode} />
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
