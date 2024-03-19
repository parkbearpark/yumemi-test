import { useState, useEffect, useCallback } from 'react'
import { Prefecture, RegionMapType, Population, PopResult } from '../types'
import { getPrefectures, getPopulation } from '../helpers/api'
import { getRegion } from '../helpers/region'

export const useRegions = () => {
  const [regions, setRegions] = useState<RegionMapType>({})
  const [populations, setPopulations] = useState<{
    [prefName: string]: { [label: string]: Population[] }
  }>({})

  const fetchPrefecturesAsync = useCallback(async () => {
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

    prefs.forEach((pref: Prefecture) => fetchPopulationAsync(pref))
  }, [])

  const fetchPopulationAsync = async (prefecture: Prefecture) => {
    const res = await getPopulation(prefecture.prefCode)
    console.log(res)
    setPopulations((pre) => {
      return {
        ...pre,
        [prefecture.prefCode]: res.reduce(
          (tmpPop: { [label: string]: Population }, r: PopResult) => {
            return {
              ...tmpPop,
              [r.label]: r.data,
            }
          },
          {}
        ),
      }
    })
  }

  useEffect(() => {
    fetchPrefecturesAsync()
  }, [fetchPrefecturesAsync])

  return { regions, populations }
}
