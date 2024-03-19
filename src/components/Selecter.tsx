import { RegionMapType, labelType, Prefecture } from '../types'

interface SelecterInterface {
  regions: RegionMapType
  labels: readonly labelType[]
  selectedLabel: labelType
  onPrefectureSelected: (pref: Prefecture) => void
  onLabelSelected: (label: labelType) => void
}

const Selecter = ({
  regions,
  labels,
  selectedLabel,
  onPrefectureSelected,
  onLabelSelected,
}: SelecterInterface) => {
  const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const label = target.value as labelType

    onLabelSelected(label)
  }

  const handlePrefectures = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const prefecture = {
      prefCode: parseInt(target.getAttribute('data-code') as string),
      prefName: target.getAttribute('data-name') as string,
    }

    onPrefectureSelected(prefecture)
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
        {labels.map((label) => {
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
