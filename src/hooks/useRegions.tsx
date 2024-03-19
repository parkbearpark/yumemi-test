import { useState, useEffect } from 'react'
import { Prefecture, RegionMapType } from '../types'
import { getPrefectures } from '../helpers/api'
import { getRegion } from '../helpers/region'

export const useRegions = () => {
  const [regions, setRegions] = useState<RegionMapType>({})

  const fetchPrefecturesAsync = async () => {
    const prefs = await getPrefectures()

    const regs = prefs.reduce(
      (currentRegions: RegionMapType, prefecture: Prefecture) => {
        const regionName = getRegion(prefecture.prefName)
        return {
          ...currentRegions,
          [regionName]: [...(currentRegions[regionName] || []), prefecture],
        }
      },
      {}
    )

    setRegions(regs)
  }

  useEffect(() => {
    fetchPrefecturesAsync()
  }, [])

  return { regions }
}
