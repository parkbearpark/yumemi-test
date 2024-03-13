import { useState } from 'react'
import { useRegions } from '../hooks/useRegions'
import { Prefecture } from '../types'

const Selecter = () => {
  const labelTypes = ['総人口', '年少人口', '生産年齢人口', '老年人口'] as const
  type labelType = (typeof labelTypes)[number]

  const { regions } = useRegions()
  const [selectedLabel, setSelectedLabel] = useState<labelType>(labelTypes[0])
  const [selectedPrefectures, setSelectedPrefectures] = useState<Prefecture[]>(
    []
  )

  const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = target.value as labelType

    setSelectedLabel(value)
  }

  const handlePrefectures = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const prefecture = {
      prefCode: parseInt(target.getAttribute('data-code') as string),
      prefName: target.getAttribute('data-name') as string,
    }

    if (target.checked) {
      setSelectedPrefectures([...selectedPrefectures, prefecture])
    } else {
      setSelectedPrefectures(
        selectedPrefectures.filter((pref) => {
          return pref.prefCode !== prefecture.prefCode
        })
      )
    }
  }

  return (
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
                    <label htmlFor={prefecture.prefName}>
                      {prefecture.prefName}
                    </label>
                  </div>
                ))}
              </div>
            </details>
          )
        })}
      </ul>
      <div>
        {labelTypes.map((label) => {
          return (
            <div key={label}>
              <input
                type="radio"
                id={`${label}`}
                name={label}
                value={label}
                onChange={handleLabel}
                checked={selectedLabel === label}
              />
              <label htmlFor={`${label}`}>{label}</label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Selecter }
