import { useState, useEffect } from 'react'
import { Prefecture, RegionMapType } from '../types'
import { getPrefectures } from '../helpers/api'
import { getRegion } from '../helpers/region'

export const useRegions = () => {
  const [regions, setRegions] = useState<RegionMapType>({})
  // const [prefectures, setPrefectures] = useState<Prefecture[]>([])

  const fetchPrefecturesAsync = async () => {
    const prefs = await getPrefectures()

    const regs = prefs.reduce(
      (prefecture: Prefecture, currentRegions: RegionMapType) => {
        const regionName = getRegion(prefecture.prefName)
        return {
          ...currentRegions,
          [regionName]: [...(currentRegions[regionName] || []), prefecture],
        }
      },
      {}
    )

    // setPrefectures(prefs)
    setRegions(regs)
  }

  useEffect(() => {
    fetchPrefecturesAsync()
  }, [])

  return { regions }
}
