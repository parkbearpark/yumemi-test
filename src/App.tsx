import { useState } from 'react'
import ReactLoading from 'react-loading'
import { useRegions } from './hooks/useRegions'
import { Prefecture, labelType } from './types'
// import { getPrefectures, getPopulation } from './helpers/api'
import './App.scss'
import { labels } from './helpers/labels'
import { Selecter } from './components/Selecter'
// import { Graph } from './components/Graph'

function App() {
  const { regions } = useRegions()

  const [selectedLabel, setSelectedLabel] = useState<labelType>(labels[0])
  const [selectedPrefectures, setSelectedPrefectures] = useState<Prefecture[]>(
    []
  )

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
      {/* <Graph /> */}
    </div>
  )
}

export default App
